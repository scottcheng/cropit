import $ from 'jquery';
import panzoom from 'jquery.panzoom';

import { CLASS_NAMES, ERRORS } from './constants';
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
    this.preImage = new Image();
    this.image.onload = this.onImageLoaded.bind(this);
    this.preImage.onload = this.onPreImageLoaded.bind(this);
    this.image.onerror = this.preImage.onerror = () => {
      this.onImageError.call(this, ERRORS.IMAGE_FAILED_TO_LOAD);
    };

    this.$fileInput = this.options.$fileInput
      .attr({ accept: 'image/*' });
    this.$imageBg = $('<img />')
      .addClass(CLASS_NAMES.IMAGE_BACKGROUND)
      .attr({ alt: '' })
      .css({ position: 'absolute' });
    this.$imageBgContainer = $('<div />')
      .addClass(CLASS_NAMES.IMAGE_BACKGROUND_CONTAINER)
      .css({
        position: 'absolute',
        zIndex: 0,
      })
      .prepend(this.$imageBg);
    this.$previewContainer = $('<div />')
      .css({ position: 'relative' })
      .prepend(this.$imageBgContainer);
    this.$preview = this.options.$preview
      .css({
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      })
      .append(this.$previewContainer);
    this.$zoomSlider = this.options.$zoomSlider
      .attr({
        min: 0,
        max: 1,
        step: 0.01,
      });

    this.previewSize = {
      w: this.options.width || this.$preview.width(),
      h: this.options.height || this.$preview.height(),
    };
    if (this.options.width) { this.$preview.width(this.previewSize.w); }
    if (this.options.height) { this.$preview.height(this.previewSize.h); }

    this.imageBgBorderWidthArray = [0,0,0,0];
    if (this.options.imageBackground) {
      if ($.isArray(this.options.imageBackgroundBorderWidth)) {
        this.imageBgBorderWidthArray = this.options.imageBackgroundBorderWidth;
      }
      else {
        [0, 1, 2, 3].forEach((i) => {
          this.imageBgBorderWidthArray[i] = this.options.imageBackgroundBorderWidth;
        });
      }
      if (this.imageBgBorderWidthArray[0] > 0) {
        this.$imageBgContainer.css('overflow', 'hidden');
      }
    }
    this.$imageBgContainer
      .css({
        left: -this.imageBgBorderWidthArray[3] + window.parseInt(this.$preview.css('border-left-width') || 0),
        top: -this.imageBgBorderWidthArray[0] + window.parseInt(this.$preview.css('border-top-width') || 0),
        width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
        height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2],
      });

    this.$preview.hover(() => {
      this.$imageBg.addClass(CLASS_NAMES.PREVIEW_HOVERED);
    }, () => {
      this.$imageBg.removeClass(CLASS_NAMES.PREVIEW_HOVERED);
    });

    this.imageLoaded = false;

    if (this.options.allowDragNDrop) {
      $.event.props.push('dataTransfer');
    }

    this.$imageBg.panzoom({
      eventNamespace: '.cropit',
      $zoomRange: this.$zoomSlider,
      contain: 'invert'
    }).panzoom('zoom');

    this.bindListeners();

    if (this.options.imageState && this.options.imageState.src) {
      this.loadImage(this.options.imageState.src);
    }
  }

  bindListeners() {
    this.$fileInput.on('change.cropit', this.onFileChange.bind(this));
    if (this.options.allowDragNDrop) {
      this.$preview.on('dragover.cropit dragleave.cropit', this.onDragOver.bind(this));
      this.$preview.on('drop.cropit', this.onDrop.bind(this));
    }
  }

  unbindListeners() {
    this.$fileInput.off('change.cropit');
    this.$preview.off('dragover.cropit dragleave.cropit drop.cropit');
  }

  onFileChange(e) {
    this.options.onFileChange(e);
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

  setImageSrc(imageSrc) {
    this.loadImage(imageSrc);
  }

  onPreImageLoaded() {
    if (this.options.smallImage === 'reject' &&
        (this.preImage.width * this.options.maxZoom
         < this.previewSize.w * this.options.exportZoom
         ||
         this.preImage.height * this.options.maxZoom
         < this.previewSize.h * this.options.exportZoom)) {
      this.onImageError(ERRORS.SMALL_IMAGE);
      if (this.image.src) { this.setImageLoadedClass(); }
      return;
    }

    if (this.options.allowCrossOrigin) {
      if(this.preImage.src.indexOf('data:') === 0) {
        this.image.crossOrigin = null;
      } else{
        this.image.crossOrigin = 'Anonymous';
      }
    }

    this.image.src = this.imageSrc = this.preImage.src;
  }

  onImageLoaded() {
    this.imageSize = {
      w: this.image.width,
      h: this.image.height,
    };
    const max_ratio = Math.max(this.previewSize.w / this.imageSize.w,
                               this.previewSize.h / this.imageSize.h);
    var min_zoom = max_ratio;
    var max_zoom = Math.max(max_ratio, 1);
    console.log(this.imageSize);
    console.log(this.previewSize);
    if(min_zoom > 1) {
      this.$imageBg.css({ width: this.imageSize.w * max_ratio,
                          height: this.imageSize.h * max_ratio });
      min_zoom = 1;
      max_zoom = 1;
    }
    this.$imageBg.attr('src', this.imageSrc)
      .panzoom('option', 'maxScale', max_zoom)
      .panzoom('option', 'minScale', min_zoom)
      .panzoom('resetDimensions')
      .panzoom('option', 'contain', 'invert')
      .panzoom('zoom', min_zoom);
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

  centerImage() {
    if (!this.imageSize || !this.zoom) { return; }
    this.$imageBg.panzoom("resetPan");
  }

  enableZoomSlider() {
    this.$zoomSlider.removeAttr('disabled');
    this.$imageBg.panzoom("option", "disableZoom", false);
    this.options.onZoomEnabled();
  }

  disableZoomSlider() {
    this.$zoomSlider.attr('disabled', true);
    this.$imageBg.panzoom('option', 'disableZoom', true);
    this.options.onZoomDisabled();
  }

  isZoomable() {
    return this.$imageBg.panzoom("option", "disablezoom");
  }

  getExportGeometry() {
    if(!this.imageSrc) { return; }
    const matrix = this.$imageBg.panzoom('getMatrix');
    const offset = { x: parseFloat(matrix[4]),
                     y: parseFloat(matrix[5]) };
    const zoom = matrix[0];
    const image_view = { height: this.previewSize.w,
                         width:  this.previewSize.h };
    const image_size = { height: this.image.height,
                         width:  this.image.width };
    const zoom_offset = { x: (image_size.width - image_size.width * zoom) / 2,
                        y: (image_size.height - image_size.height * zoom) / 2 };
    const drag_offset = { x: (zoom_offset.x + offset.x) * -1,
                          y: (zoom_offset.y + offset.y) * -1 };
    const scale_drag = { x: drag_offset.x * 1/zoom,
                         y: drag_offset.y * 1/zoom };
    const scale_image_view = { width: image_view.width * 1/zoom,
                               height: image_view.height * 1/zoom };
    return {
      outputOffset: scale_drag,
      outputSize: scale_image_view
    }
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
    const geometry = this.getExportGeometry(exportOptions);
    const canvas = $('<canvas />')
      .attr({
        width: geometry.outputSize.width,
        height: geometry.outputSize.height,
      })
      .get(0);
    const canvasContext = canvas.getContext('2d');
    if (exportOptions.type === 'image/jpeg') {
      canvasContext.fillStyle = exportOptions.fillBg;
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    }
    canvasContext.drawImage(this.image,
                            geometry.outputOffset.x,
                            geometry.outputOffset.y,
                            geometry.outputSize.width,
                            geometry.outputSize.height,
                            0, 0, geometry.outputSize.width, geometry.outputSize.height);
    return canvas.toDataURL(exportOptions.type, exportOptions.quality);
  }

  getImageSrc() {
    return this.imageSrc;
  }

  getImageSize() {
    if (!this.imageSize) { return null; }

    return {
      width: this.imageSize.w,
      height: this.imageSize.h,
    };
  }

  getMinZoom() {
    return this.options.minZoom;
  }

  setMinZoom(minZoom) {
    this.options.minZoom = minZoom;
    this.$imageBg
      .panzoom('option', 'minScale', minZoom)
      .panzoom('zoom');
  }

  getMaxZoom() {
    return this.options.maxZoom;
  }

  setMaxZoom(maxZoom) {
    this.options.maxZoom = maxZoom;
    this.$imageBg
      .panzoom('option', 'maxScale', maxZoom)
      .panzoom('zoom');
  }

  getPreviewSize() {
    return {
      width: this.previewSize.w,
      height: this.previewSize.h,
    };
  }

  setPreviewSize(size) {
    if (!size || size.width <= 0 || size.height <= 0) { return; }

    this.previewSize = {
      w: size.width,
      h: size.height,
    };
    this.$preview.css({
      width: this.previewSize.w,
      height: this.previewSize.h,
    });

    this.$imageBgContainer.css({
      width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
      height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2],
    });
  }

  disable() {
    this.unbindListeners();
    this.disableZoomSlider();
    this.$el.addClass(CLASS_NAMES.DISABLED);
    this.$imageBg.panzoom("disable");
  }

  reenable() {
    this.bindListeners();
    this.enableZoomSlider();
    this.$el.removeClass(CLASS_NAMES.DISABLED);
    this.$imageBg.panzoom("enable");
  }

  $(selector) {
    if (!this.$el) { return null; }
    return this.$el.find(selector);
  }
}

export default Cropit;
