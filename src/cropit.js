import $ from 'jquery';

import Zoomer from './Zoomer';
import { CLASS_NAMES, ERRORS, EVENTS } from './constants';
import { loadDefaults } from './options';
import { exists, round } from './utils';

class Cropit {
  constructor(jQuery, element, options) {
    this.$el = $(element);

    const defaults = loadDefaults(this.$el);
    this.options = $.extend({}, defaults, options);

    this.init();
  }

  init() {
    this.image = new Image();
    if (this.options.allowCrossOrigin) { this.image.crossOrigin = 'Anonymous'; }
    this.preImage = new Image();
    this.image.onload = this.onImageLoaded.bind(this);
    this.preImage.onload = this.onPreImageLoaded.bind(this);
    this.image.onerror = this.preImage.onerror = () => {
      this.onImageError.call(this, ERRORS.IMAGE_FAILED_TO_LOAD);
    };

    this.$fileInput = this.options.$fileInput.attr({ accept: 'image/*' });
    this.$preview = this.options.$preview.css({ backgroundRepeat: 'no-repeat' });
    this.$zoomSlider = this.options.$zoomSlider.attr({ min: 0, max: 1, step: 0.01 });

    this.previewSize = {
      w: this.options.width || this.$preview.width(),
      h: this.options.height || this.$preview.height(),
    };
    if (this.options.width) { this.$preview.width(this.previewSize.w); }
    if (this.options.height) { this.$preview.height(this.previewSize.h); }

    if (this.options.imageBackground) {
      if ($.isArray(this.options.imageBackgroundBorderWidth)) {
        this.imageBgBorderWidthArray = this.options.imageBackgroundBorderWidth;
      }
      else {
        this.imageBgBorderWidthArray = [];
        [0, 1, 2, 3].forEach((i) => {
          this.imageBgBorderWidthArray[i] = this.options.imageBackgroundBorderWidth;
        });
      }

      const $previewContainer = this.options.$previewContainer;
      this.$imageBg = $('<img />')
        .addClass(CLASS_NAMES.IMAGE_BACKGROUND)
        .attr('alt', '')
        .css('position', 'absolute');
      this.$imageBgContainer = $('<div />')
        .addClass(CLASS_NAMES.IMAGE_BACKGROUND_CONTAINER)
        .css({
          position: 'absolute',
          zIndex: 0,
          left: -this.imageBgBorderWidthArray[3] + window.parseInt(this.$preview.css('border-left-width') || 0),
          top: -this.imageBgBorderWidthArray[0] + window.parseInt(this.$preview.css('border-top-width') || 0),
          width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
          height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2],
        })
        .append(this.$imageBg);
      if (this.imageBgBorderWidthArray[0] > 0) {
        this.$imageBgContainer.css('overflow', 'hidden');
      }
      $previewContainer
        .css('position', 'relative')
        .prepend(this.$imageBgContainer);
      this.$preview.css('position', 'relative');

      this.$preview.hover(() => {
        this.$imageBg.addClass(CLASS_NAMES.PREVIEW_HOVERED);
      }, () => {
        this.$imageBg.removeClass(CLASS_NAMES.PREVIEW_HOVERED);
      });
    }

    if (this.options.initialZoom === 'min') {
      this.initialZoom = 0; // Will be fixed when image loads
    }
    else if (this.options.initialZoom === 'image') {
      this.initialZoom = 1;
    }
    else {
      this.initialZoom = 0;
    }

    this.imageLoaded = false;

    this.moveContinue = false;

    this.zoomer = new Zoomer();

    if (this.options.allowDragNDrop) {
      $.event.props.push('dataTransfer');
    }

    this.bindListeners();

    if (this.options.imageState && this.options.imageState.src) {
      this.loadImage(this.options.imageState.src);
    }
  }

  bindListeners() {
    this.$fileInput.on('change.cropit', this.onFileChange.bind(this));
    this.$preview.on(EVENTS.PREVIEW, this.onPreviewEvent.bind(this));
    this.$zoomSlider.on(EVENTS.ZOOM_INPUT, this.onZoomSliderChange.bind(this));

    if (this.options.allowDragNDrop) {
      this.$preview.on('dragover.cropit dragleave.cropit', this.onDragOver.bind(this));
      this.$preview.on('drop.cropit', this.onDrop.bind(this));
    }
  }

  unbindListeners() {
    this.$fileInput.off('change.cropit');
    this.$preview.off(EVENTS.PREVIEW);
    this.$preview.off('dragover.cropit dragleave.cropit drop.cropit');
    this.$zoomSlider.off(EVENTS.ZOOM_INPUT);
  }

  onFileChange() {
    this.options.onFileChange();

    if (this.$fileInput.get(0).files) {
      this.loadFileReader(this.$fileInput.get(0).files[0]);
    }
  }

  loadFileReader(file) {
    const fileReader = new FileReader();
    if (file && file.type.match('image')) {
      fileReader.readAsDataURL(file);
      fileReader.onload = this.onFileReaderLoaded.bind(this);
      fileReader.onerror = this.onFileReaderError.bind(this);
    }
    else if (file) {
      this.onFileReaderError();
    }
  }

  onFileReaderLoaded(e) {
    this.loadImage(e.target.result);
  }

  onFileReaderError() {
    this.options.onFileReaderError();
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.$preview.toggleClass(CLASS_NAMES.DRAG_HOVERED, e.type === 'dragover');
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.prototype.slice.call(e.dataTransfer.files, 0);
    files.some((file) => {
      if (!file.type.match('image')) { return false; }

      this.loadFileReader(file);
      return true;
    });

    this.$preview.removeClass(CLASS_NAMES.DRAG_HOVERED);
  }

  loadImage(imageSrc) {
    if (!imageSrc) { return; }

    this.options.onImageLoading();
    this.setImageLoadingClass();

    this.preImage.src = imageSrc;
  }

  onPreImageLoaded() {
    if (this.options.smallImage === 'reject' &&
          (this.preImage.width * this.options.maxZoom < this.previewSize.w * this.options.exportZoom ||
           this.preImage.height * this.options.maxZoom < this.previewSize.h * this.options.exportZoom)) {
      this.onImageError(ERRORS.SMALL_IMAGE);
      return;
    }

    this.image.src = this.imageSrc = this.preImage.src;
  }

  onImageLoaded() {
    this.imageSize = {
      w: this.image.width,
      h: this.image.height,
    };

    this.setupZoomer(this.options.imageState && this.options.imageState.zoom || this.initialZoom);
    if (this.options.imageState && this.options.imageState.offset) {
      this.setOffset(this.options.imageState.offset);
    }
    else {
      this.centerImage();
    }

    this.options.imageState = {};

    this.$preview.css('background-image', `url(${this.imageSrc})`);
    if (this.options.imageBackground) {
      this.$imageBg.attr('src', this.imageSrc);
    }

    this.setImageLoadedClass();

    this.imageLoaded = true;

    this.options.onImageLoaded();
  }

  onImageError() {
    this.options.onImageError.apply(this, arguments);
    this.removeImageLoadingClass();
  }

  setImageLoadingClass() {
    this.$preview
      .removeClass(CLASS_NAMES.IMAGE_LOADED)
      .addClass(CLASS_NAMES.IMAGE_LOADING);
  }

  setImageLoadedClass() {
    this.$preview
      .removeClass(CLASS_NAMES.IMAGE_LOADING)
      .addClass(CLASS_NAMES.IMAGE_LOADED);
  }

  removeImageLoadingClass() {
    this.$preview
      .removeClass(CLASS_NAMES.IMAGE_LOADING);
  }

  getEventPosition(e) {
    if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0]) {
      e = e.originalEvent.touches[0];
    }
    if (e.clientX && e.clientY) {
      return { x: e.clientX, y: e.clientY };
    }
  }

  onPreviewEvent(e) {
    if (!this.imageLoaded) { return; }

    this.moveContinue = false;
    this.$preview.off(EVENTS.PREVIEW_MOVE);

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      this.origin = this.getEventPosition(e);
      this.moveContinue = true;
      this.$preview.on(EVENTS.PREVIEW_MOVE, this.onMove.bind(this));
    }
    else {
      $(document.body).focus();
    }

    e.stopPropagation();
    return false;
  }

  onMove(e) {
    const eventPosition = this.getEventPosition(e);

    if (this.moveContinue && eventPosition) {
      this.setOffset({
        x: this.offset.x + eventPosition.x - this.origin.x,
        y: this.offset.y + eventPosition.y - this.origin.y,
      });
    }

    this.origin = eventPosition;

    e.stopPropagation();
    return false;
  }

  setOffset(position) {
    this.offset = this.fixOffset(position);
    this.$preview.css('background-position', `${this.offset.x}px ${this.offset.y}px`);
    if (this.options.imageBackground) {
      this.$imageBg.css({
        left: this.offset.x + this.imageBgBorderWidthArray[3],
        top: this.offset.y + this.imageBgBorderWidthArray[0],
      });
    }
  }

  fixOffset(offset) {
    if (!this.imageLoaded) { return offset; }

    const ret = { x: offset.x, y: offset.y };

    if (!this.options.freeMove) {
      if (this.imageSize.w * this.zoom >= this.previewSize.w) {
        ret.x = Math.min(0, Math.max(ret.x,
          this.previewSize.w - this.imageSize.w * this.zoom));
      }
      else {
        ret.x = Math.max(0, Math.min(ret.x,
          this.previewSize.w - this.imageSize.w * this.zoom));
      }

      if (this.imageSize.h * this.zoom >= this.previewSize.h) {
        ret.y = Math.min(0, Math.max(ret.y,
          this.previewSize.h - this.imageSize.h * this.zoom));
      }
      else {
        ret.y = Math.max(0, Math.min(ret.y,
          this.previewSize.h - this.imageSize.h * this.zoom));
      }
    }

    ret.x = round(ret.x);
    ret.y = round(ret.y);

    return ret;
  }

  centerImage() {
    if (!this.imageSize || !this.zoom) { return; }

    this.setOffset({
      x: (this.previewSize.w - this.imageSize.w * this.zoom) / 2,
      y: (this.previewSize.h - this.imageSize.h * this.zoom) / 2,
    });
  }

  onZoomSliderChange() {
    if (!this.imageLoaded) { return; }

    this.zoomSliderPos = Number(this.$zoomSlider.val());
    const newZoom = this.zoomer.getZoom(this.zoomSliderPos);
    this.setZoom(newZoom);
  }

  enableZoomSlider() {
    this.$zoomSlider.removeAttr('disabled');
    this.options.onZoomEnabled();
  }

  disableZoomSlider() {
    this.$zoomSlider.attr('disabled', true);
    this.options.onZoomDisabled();
  }

  setupZoomer(zoom) {
    this.zoomer.setup({
      imageSize: this.imageSize,
      previewSize: this.previewSize,
      exportZoom: this.options.exportZoom,
      maxZoom: this.options.maxZoom,
      minZoom: this.options.minZoom,
      smallImage: this.options.smallImage,
    });
    this.setZoom(exists(zoom) ? zoom : this.zoom);

    if (this.isZoomable()) {
      this.enableZoomSlider();
    }
    else {
      this.disableZoomSlider();
    }
  }

  setZoom(newZoom) {
    newZoom = this.fixZoom(newZoom);

    const updatedWidth = round(this.imageSize.w * newZoom);
    const updatedHeight = round(this.imageSize.h * newZoom);

    if (this.imageLoaded) {
      const oldZoom = this.zoom;

      const newX = this.previewSize.w / 2 - (this.previewSize.w / 2 - this.offset.x) * newZoom / oldZoom;
      const newY = this.previewSize.h / 2 - (this.previewSize.h / 2 - this.offset.y) * newZoom / oldZoom;

      this.zoom = newZoom;
      this.setOffset({ x: newX, y: newY });
    }
    else {
      this.zoom = newZoom;
    }

    this.zoomSliderPos = this.zoomer.getSliderPos(this.zoom);
    this.$zoomSlider.val(this.zoomSliderPos);

    this.$preview.css('background-size', `${updatedWidth}px ${updatedHeight}px`);
    if (this.options.imageBackground) {
      this.$imageBg.css({
        width: updatedWidth,
        height: updatedHeight,
      });
    }
  }

  fixZoom(zoom) {
    return this.zoomer.fixZoom(zoom);
  }

  isZoomable() {
    return this.zoomer.isZoomable();
  }

  getCroppedImageData(exportOptions) {
    if (!this.imageSrc) { return; }

    const exportDefaults = {
      type: 'image/png',
      quality: 0.75,
      originalSize: false,
      fillBg: '#fff',
    };
    exportOptions = $.extend({}, exportDefaults, exportOptions);

    const croppedSize = {
      w: this.previewSize.w,
      h: this.previewSize.h,
    };

    const exportZoom = exportOptions.originalSize ? 1 / this.zoom : this.options.exportZoom;

    const canvas = $('<canvas />')
      .attr({
        width: croppedSize.w * exportZoom,
        height: croppedSize.h * exportZoom,
      })
      .get(0);
    const canvasContext = canvas.getContext('2d');

    if (exportOptions.type === 'image/jpeg') {
      canvasContext.fillStyle = exportOptions.fillBg;
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    }

    canvasContext.drawImage(this.image,
      this.offset.x * exportZoom,
      this.offset.y * exportZoom,
      this.zoom * exportZoom * this.imageSize.w,
      this.zoom * exportZoom * this.imageSize.h);

    return canvas.toDataURL(exportOptions.type, exportOptions.quality);
  }

  getImageState() {
    return {
      src: this.imageSrc,
      offset: this.offset,
      zoom: this.zoom,
    };
  }

  getImageSrc() {
    return this.imageSrc;
  }

  getOffset() {
    return this.offset;
  }

  getZoom() {
    return this.zoom;
  }

  getImageSize() {
    if (!this.imageSize) { return null; }

    return {
      width: this.imageSize.w,
      height: this.imageSize.h,
    };
  }

  getPreviewSize() {
    return {
      width: this.previewSize.w,
      height: this.previewSize.h,
    };
  }

  setPreviewSize(size) {
    if (!size || size.width <= 0 || size.height <= 0) {

    }

    this.previewSize = {
      w: size.width,
      h: size.height,
    };
    this.$preview.css({
      width: this.previewSize.w,
      height: this.previewSize.h,
    });

    if (this.options.imageBackground) {
      this.$imageBgContainer.css({
        width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
        height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2],
      });
    }

    if (this.imageLoaded) {
      this.setupZoomer();
    }
  }

  disable() {
    this.unbindListeners();
    this.disableZoomSlider();
    this.$el.addClass(CLASS_NAMES.DISABLED);
  }

  reenable() {
    this.bindListeners();
    this.enableZoomSlider();
    this.$el.removeClass(CLASS_NAMES.DISABLED);
  }

  $(selector) {
    if (!this.$el) { return null; }
    return this.$el.find(selector);
  }
}

export default Cropit;
