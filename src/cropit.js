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

    this.$fileInput = this.options.$fileInput.attr({ accept: 'image/*' });
    this.$preview = this.options.$preview.css({ backgroundRepeat: 'no-repeat' });
    this.$zoomSlider = this.options.$zoomSlider.attr({ min: 0, max: 1, step: 0.01 });
    
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
    // const $previewContainer = this.options.$previewContainer;
    this.$imageBg = $('<img />')
      .addClass(CLASS_NAMES.IMAGE_BACKGROUND)
      .attr('alt', '')
      .css('position', 'absolute');
    this.$imageBgContainer = $('<div />')
      .addClass(CLASS_NAMES.IMAGE_BACKGROUND_CONTAINER)
      .css({
        position: 'absolute',
        // zIndex: 0,
        left: -this.imageBgBorderWidthArray[3] + window.parseInt(this.$preview.css('border-left-width') || 0),
        top: -this.imageBgBorderWidthArray[0] + window.parseInt(this.$preview.css('border-top-width') || 0),
        width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
        height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2],
        })
      .append(this.$imageBg);
    // $previewContainer
    //   .css('position', 'relative')
    //   .prepend(this.$imageBgContainer);
    this.$preview.css('position', 'relative')
      .prepend(this.$imageBgContainer);
    
    this.$preview.hover(() => {
      this.$imageBg.addClass(CLASS_NAMES.PREVIEW_HOVERED);
    }, () => {
      this.$imageBg.removeClass(CLASS_NAMES.PREVIEW_HOVERED);
    });

    this.offset = { x: 0, y: 0 };
    this.setInitialZoom(this.options.initialZoom);
    this.zoom = this.initialZoom;

    this.imageLoaded = false;

    if (this.options.allowDragNDrop) {
      $.event.props.push('dataTransfer');
    }

    this.$imageBg.panzoom({
      eventNamespace: '.cropit',
      maxScale: this.options.maxZoom,
      minScale: this.options.minZoom,
      $zoomRange: this.$zoomSlider,
      onEnd: this.onChangePanZoom.bind(this),
      onZoom: this.onZoomChange.bind(this),
      contain: 'invert'
    }).panzoom('zoom');

    this.bindListeners();

    if (this.options.imageState && this.options.imageState.src) {
      this.loadImage(this.options.imageState.src);
    }
  }

  bindListeners() {
    this.$fileInput.on('change.cropit', this.onFileChange.bind(this));
    //this.$preview.on(EVENTS.PREVIEW, this.onPreviewEvent.bind(this));
    //this.$zoomSlider.on(EVENTS.ZOOM_INPUT, this.onZoomSliderChange.bind(this));

    if (this.options.allowDragNDrop) {
      this.$preview.on('dragover.cropit dragleave.cropit', this.onDragOver.bind(this));
      this.$preview.on('drop.cropit', this.onDrop.bind(this));
    }
  }

  unbindListeners() {
    this.$fileInput.off('change.cropit');
    //this.$preview.off(EVENTS.PREVIEW);
    this.$preview.off('dragover.cropit dragleave.cropit drop.cropit');
    //this.$zoomSlider.off(EVENTS.ZOOM_INPUT);
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
          (this.preImage.width * this.options.maxZoom < this.previewSize.w * this.options.exportZoom ||
           this.preImage.height * this.options.maxZoom < this.previewSize.h * this.options.exportZoom)) {
      this.onImageError(ERRORS.SMALL_IMAGE);
      if (this.image.src) { this.setImageLoadedClass(); }
      return;
    }

    if (this.options.allowCrossOrigin) {
      this.image.crossOrigin = this.preImage.src.indexOf('data:') === 0 ? null : 'Anonymous';
    }

    this.image.src = this.imageSrc = this.preImage.src;
  }

  onImageLoaded() {
    this.imageSize = {
      w: this.image.width,
      h: this.image.height,
    };
    

    // this.setupZoomer(this.options.imageState && this.options.imageState.zoom || this.initialZoom);
    if (this.options.imageState && this.options.imageState.offset) {
      this.offset = this.options.imageState.offset;
    }
    else {
      this.centerImage();
    }

    this.options.imageState = {};

    this.$imageBg.attr('src', this.imageSrc)
      .panzoom('resetDimensions');
    this.zoom = 1; // should fix zoom
    this.$imageBg.panzoom('zoom', this.zoom);

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

  // getEventPosition(e) {
  //   if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0]) {
  //     e = e.originalEvent.touches[0];
  //   }
  //   if (e.clientX && e.clientY) {
  //     return { x: e.clientX, y: e.clientY };
  //   }
  // }

  // onPreviewEvent(e) {
  //   if (!this.imageLoaded) { return; }

  //   this.moveContinue = false;
  //   this.$preview.off(EVENTS.PREVIEW_MOVE);

  //   if (e.type === 'mousedown' || e.type === 'touchstart') {
  //     this.origin = this.getEventPosition(e);
  //     this.moveContinue = true;
  //     this.$preview.on(EVENTS.PREVIEW_MOVE, this.onMove.bind(this));
  //   }
  //   else {
  //     $(document.body).focus();
  //   }

  //   e.stopPropagation();
  //   return false;
  // }

  onChangePanZoom(e, panzoom, matrix, changed) {
    if(changed) {
      console.log(matrix);
      this.offset = { x: matrix[4], y: matrix[5] };
      this.zoom = matrix[0];
    }
    
    // if (eventPosition) {
    //   this.setOffset({
    //     x: this.offset.x + eventPosition.x - this.origin.x,
    //     y: this.offset.y + eventPosition.y - this.origin.y,
    //   });
    // }

    // this.origin = eventPosition;

    //e.stopPropagation();
    return false;
  }

  // setOffset(position) {
  //   if (!position || !exists(position.x) || !exists(position.y)) { return; }

  //   this.offset = { x: round(position.x),
  //                   y: round(position.y)
  //                 };
  //   this.$el.panzoom("pan", this.offset.x, this.offset.y);
    // this.$preview.css('background-position', `${this.offset.x}px ${this.offset.y}px`);
    // if (this.options.imagebackground) {
    //   this.$imagebg.css({
    //     left: this.offset.x + this.imagebgborderwidtharray[3],
    //     top: this.offset.y + this.imagebgborderwidtharray[0],
    //   });
    // }

  //   this.options.onOffsetChange(position);
  // }

  // fixOffset(offset) {
  //   if (!this.imageLoaded) { return offset; }

  //   const ret = { x: offset.x, y: offset.y };

  //   if (!this.options.freeMove) {
  //     if (this.imageSize.w * this.zoom >= this.previewSize.w) {
  //       ret.x = Math.min(0, Math.max(ret.x,
  //         this.previewSize.w - this.imageSize.w * this.zoom));
  //     }
  //     else {
  //       ret.x = Math.max(0, Math.min(ret.x,
  //         this.previewSize.w - this.imageSize.w * this.zoom));
  //     }

  //     if (this.imageSize.h * this.zoom >= this.previewSize.h) {
  //       ret.y = Math.min(0, Math.max(ret.y,
  //         this.previewSize.h - this.imageSize.h * this.zoom));
  //     }
  //     else {
  //       ret.y = Math.max(0, Math.min(ret.y,
  //         this.previewSize.h - this.imageSize.h * this.zoom));
  //     }
  //   }

  //   ret.x = round(ret.x);
  //   ret.y = round(ret.y);

  //   return ret;
  // }

  centerImage() {
    if (!this.imageSize || !this.zoom) { return; }
    this.$imageBg.panzoom("resetPan");

    // this.setOffset({
    //   x: (this.previewSize.w - this.imageSize.w * this.zoom) / 2,
    //   y: (this.previewSize.h - this.imageSize.h * this.zoom) / 2,
    // });
  }

  onZoomChange(e, panzoom, scale, opts) {
    if (!this.imageLoaded || scale === this.zoom) { return; }

    this.zoom = scale;
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

  // setupZoomer(zoom) {
  //   this.zoomer.setup({
  //     imageSize: this.imageSize,
  //     previewSize: this.previewSize,
  //     exportZoom: this.options.exportZoom,
  //     maxZoom: this.options.maxZoom,
  //     minZoom: this.options.minZoom,
  //     smallImage: this.options.smallImage,
  //   });
  //   this.setZoom(exists(zoom) ? zoom : this.zoom);

  //   if (this.isZoomable()) {
  //     this.enableZoomSlider();
  //   }
  //   else {
  //     this.disableZoomSlider();
  //   }
  // }

  // setZoom(newZoom) {
  //   // newzoom = this.fixzoom(newzoom);

  //   // const updatedWidth = round(this.imageSize.w * newZoom);
  //   // const updatedHeight = round(this.imageSize.h * newZoom);

  //   if (this.imageLoaded) {
  //     this.$imageBg.panzoom("zoom", newZoom);
  //     // const oldzoom = this.zoom;

  //     // const newx = this.previewsize.w / 2 - (this.previewsize.w / 2 - this.offset.x) * newzoom / oldzoom;
  //     // const newy = this.previewsize.h / 2 - (this.previewsize.h / 2 - this.offset.y) * newzoom / oldzoom;

  //     // this.zoom = newzoom;
  //     // this.setoffset({ x: newx, y: newy });
  //   }
  //   this.zoom = newZoom;

  //   // this.zoomsliderpos = this.zoomer.getsliderpos(this.zoom);
  //   // this.$zoomslider.val(this.zoomsliderpos);

  //   // this.$imageBg.css({
  //   //   width: updatedWidth,
  //   //   height: updatedHeight,
  //   // });

  //   this.options.onZoomChange(newZoom);
  // }

  // fixzoom(zoom) {
  //   return this.zoomer.fixzoom(zoom);
  // }

  isZoomable() {
    return this.$imageBg.panzoom("option", "disablezoom");
    // return this.zoomer.iszoomable();
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

    console.log('imageState');
    console.log(this.getImageState());
    const exportZoom = exportOptions.originalSize ? 1 / this.zoom : this.options.exportZoom;
    console.log('exportZoom');
    console.log(exportZoom);
    
    const zoomedSize = {
      w: this.zoom * exportZoom * this.image.naturalWidth,
      h: this.zoom * exportZoom * this.image.naturalHeight,
    };
    console.log('zoomedSize');
    console.log(zoomedSize);
    const transform_origin = this.$imageBg
          .css('transform-origin')
          .split(' ')
          .map((s) => { return s.replace('px',''); });
    console.log('transform-origin');
    console.log(transform_origin);

    const canvas = $('<canvas />')
      .attr({
        width: this.previewSize.w * exportZoom,
        height: this.previewSize.h * exportZoom,
      })
      .get(0);
    const canvasContext = canvas.getContext('2d');

    if (exportOptions.type === 'image/jpeg') {
      canvasContext.fillStyle = exportOptions.fillBg;
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    }

    var matrix = this.$imageBg.panzoom("getMatrix");
    canvasContext.translate(transform_origin[0], transform_origin[1]);
    canvasContext.transform(matrix[0],
                            matrix[1],
                            matrix[2],
                            matrix[3],
                            matrix[4],
                            matrix[5]);
    // canvasContext.drawImage(this.image,
    //   this.offset.x * exportZoom,
    //   this.offset.y * exportZoom,
    //   zoomedSize.w,
    //   zoomedSize.h);
    canvasContext.drawImage(this.image,
                            0,
                            0,
                            zoomedSize.w,
                            zoomedSize.h);

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

  getInitialZoom() {
    return this.options.initialZoom;
  }

  setInitialZoom(initialZoomOption) {
    this.options.initialZoom = initialZoomOption;
    if (initialZoomOption === 'min') {
      this.initialZoom = 0; // Will be fixed when image loads
    }
    else if (initialZoomOption === 'image') {
      this.initialZoom = 1;
    }
    else {
      this.initialZoom = 0;
    }
  }

  getExportZoom() {
    return this.options.exportZoom;
  }

  setExportZoom(exportZoom) {
    this.options.exportZoom = exportZoom;
    // this.setupZoomer();
  }

  getMinZoom() {
    return this.options.minZoom;
  }

  setMinZoom(minZoom) {
    this.options.minZoom = minZoom;
    // this.setupZoomer();
    this.$imageBg.panzoom("option", "minScale", minZoom).panzoom("zoom");
  }

  getMaxZoom() {
    return this.options.maxZoom;
  }

  setMaxZoom(maxZoom) {
    this.options.maxZoom = maxZoom;
    // this.setupZoomer();
    this.$imageBg.panzoom("option", "maxScale", maxZoom).panzoom("zoom");
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
