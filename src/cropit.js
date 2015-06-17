import $ from 'jquery';

import Zoomer from './Zoomer';
import { DEFAULTS, ERRORS, EVENTS } from './constants';
import { exists } from './utils';

class Cropit {
  constructor(jQuery, element, options) {
    this.$el = $(element);

    const dynamicDefaults = {
      $fileInput: this.$('input.cropit-image-input'),
      $preview: this.$('.cropit-image-preview'),
      $zoomSlider: this.$('input.cropit-image-zoom-input'),
      $previewContainer: this.$('.cropit-image-preview-container'),
    };

    this.options = $.extend({}, DEFAULTS, dynamicDefaults, options);
    this.init();
  }

  init() {
    this.image = new Image();

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
        .addClass('cropit-image-background')
        .attr('alt', '')
        .css('position', 'absolute');
      this.$imageBgContainer = $('<div />')
        .addClass('cropit-image-background-container')
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
        this.$imageBg.addClass('cropit-preview-hovered');
      }, () => {
        this.$imageBg.removeClass('cropit-preview-hovered');
      });
    }

    this.initialZoom = 0;
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
    if (this.options.onFileChange) { this.options.onFileChange(); }

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
    if (this.options.onFileReaderError) { this.options.onFileReaderError(); }
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.$preview.toggleClass('cropit-drag-hovered', e.type === 'dragover');
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

    this.$preview.removeClass('cropit-drag-hovered');
  }

  loadImage(imageSrc) {
    this.imageSrc = imageSrc;
    if (!this.imageSrc) { return; }

    if (this.options.onImageLoading) { this.options.onImageLoading(); }
    this.setImageLoadingClass();

    this.image.onload = this.onImageLoaded.bind(this);
    this.image.onerror = () => {
      this.onImageError.call(this, ERRORS.IMAGE_FAILED_TO_LOAD);
    };

    this.image.src = this.imageSrc;
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
      this.setOffset({ x: 0, y: 0 });
    }

    this.options.imageState = {};

    this.$preview.css('background-image', `url(${this.imageSrc})`);
    if (this.options.imageBackground) {
      this.$imageBg.attr('src', this.imageSrc);
    }

    if (this.options.rejectSmallImage &&
          (this.imageSize.w * this.options.maxZoom < this.previewSize.w * this.options.exportZoom ||
           this.imageSize.h * this.options.maxZoom < this.previewSize.h * this.options.exportZoom)) {
      this.onImageError(ERRORS.SMALL_IMAGE);
      return;
    }

    this.setImageLoadedClass();

    this.imageLoaded = true;

    if (this.options.onImageLoaded) { this.options.onImageLoaded(); }
  }

  onImageError() {
    if (this.options.onImageError) { this.options.onImageError.apply(this, arguments); }
    this.removeImageLoadingClass();
  }

  setImageLoadingClass() {
    this.$preview
      .removeClass('cropit-image-loaded')
      .addClass('cropit-image-loading');
  }

  setImageLoadedClass() {
    this.$preview
      .removeClass('cropit-image-loading')
      .addClass('cropit-image-loaded');
  }

  removeImageLoadingClass() {
    this.$preview
      .removeClass('cropit-image-loading');
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

    ret.x = this.round(ret.x);
    ret.y = this.round(ret.y);

    return ret;
  }

  centerImage() {
    if (!this.imageLoaded) { return; }

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
    if (this.options.onZoomEnabled) { this.options.onZoomEnabled(); }
  }

  disableZoomSlider() {
    this.$zoomSlider.attr('disabled', true);
    if (this.options.onZoomDisabled) { this.options.onZoomDisabled(); }
  }

  setupZoomer(zoom) {
    this.zoomer.setup({
      imageSize: this.imageSize,
      previewSize: this.previewSize,
      exportZoom: this.options.exportZoom,
      maxZoom: this.options.maxZoom,
      minZoom: this.options.minZoom,
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

    const updatedWidth = this.round(this.imageSize.w * newZoom);
    const updatedHeight = this.round(this.imageSize.h * newZoom);

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
    this.$el.addClass('cropit-disabled');
  }

  reenable() {
    this.bindListeners();
    this.enableZoomSlider();
    this.$el.removeClass('cropit-disabled');
  }

  round(x) {
    return +(Math.round(x * 1e2)  + 'e-2');
  }

  $(selector) {
    if (!this.$el) { return null; }
    return this.$el.find(selector);
  }
}

export default Cropit;
