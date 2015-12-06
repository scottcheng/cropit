/*! cropit - v0.4.5 <https://github.com/scottcheng/cropit> */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["cropit"] = factory(require("jquery"));
	else
		root["cropit"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _cropit = __webpack_require__(2);

	var _cropit2 = _interopRequireDefault(_cropit);

	var _constants = __webpack_require__(4);

	var _utils = __webpack_require__(6);

	var applyOnEach = function applyOnEach($el, callback) {
	  return $el.each(function () {
	    var cropit = _jquery2['default'].data(this, _constants.PLUGIN_KEY);

	    if (!cropit) {
	      return;
	    }
	    callback(cropit);
	  });
	};

	var callOnFirst = function callOnFirst($el, method, options) {
	  var cropit = $el.first().data(_constants.PLUGIN_KEY);

	  if (!cropit || !_jquery2['default'].isFunction(cropit[method])) {
	    return null;
	  }
	  return cropit[method](options);
	};

	var methods = {
	  init: function init(options) {
	    return this.each(function () {
	      // Only instantiate once per element
	      if (_jquery2['default'].data(this, _constants.PLUGIN_KEY)) {
	        return;
	      }

	      var cropit = new _cropit2['default'](_jquery2['default'], this, options);
	      _jquery2['default'].data(this, _constants.PLUGIN_KEY, cropit);
	    });
	  },

	  destroy: function destroy() {
	    return this.each(function () {
	      _jquery2['default'].removeData(this, _constants.PLUGIN_KEY);
	    });
	  },

	  isZoomable: function isZoomable() {
	    return callOnFirst(this, 'isZoomable');
	  },

	  'export': function _export(options) {
	    return callOnFirst(this, 'getCroppedImageData', options);
	  },

	  imageState: function imageState() {
	    return callOnFirst(this, 'getImageState');
	  },

	  imageSize: function imageSize() {
	    return callOnFirst(this, 'getImageSize');
	  },

	  prop: function prop(name, value) {
	    if ((0, _utils.exists)(value)) {
	      return applyOnEach(this, function (cropit) {
	        cropit['set' + (0, _utils.capitalize)(name)](value);
	      });
	    } else {
	      return callOnFirst(this, 'get' + (0, _utils.capitalize)(name));
	    }
	  },

	  disable: function disable() {
	    return applyOnEach(this, function (cropit) {
	      cropit.disable();
	    });
	  },

	  reenable: function reenable() {
	    return applyOnEach(this, function (cropit) {
	      cropit.reenable();
	    });
	  }
	};

	_jquery2['default'].fn.cropit = function (method) {
	  if (methods[method]) {
	    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	  } else if (['imageSrc', 'offset', 'previewSize', 'zoom', 'initialZoom', 'exportZoom', 'minZoom', 'maxZoom'].indexOf(method) >= 0) {
	    return methods.prop.apply(this, arguments);
	  } else {
	    return methods.init.apply(this, arguments);
	  }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _jquery = __webpack_require__(1);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _jqueryPanzoom = __webpack_require__(3);

	var _jqueryPanzoom2 = _interopRequireDefault(_jqueryPanzoom);

	var _constants = __webpack_require__(4);

	var _options = __webpack_require__(5);

	var _utils = __webpack_require__(6);

	var Cropit = (function () {
	  function Cropit(jQuery, element, options) {
	    _classCallCheck(this, Cropit);

	    this.$el = (0, _jquery2['default'])(element);

	    var defaults = (0, _options.loadDefaults)(this.$el);
	    this.options = _jquery2['default'].extend({}, defaults, options);

	    this.init();
	  }

	  _createClass(Cropit, [{
	    key: 'init',
	    value: function init() {
	      var _this = this;

	      this.image = new Image();
	      this.preImage = new Image();
	      this.image.onload = this.onImageLoaded.bind(this);
	      this.preImage.onload = this.onPreImageLoaded.bind(this);
	      this.image.onerror = this.preImage.onerror = function () {
	        _this.onImageError.call(_this, _constants.ERRORS.IMAGE_FAILED_TO_LOAD);
	      };

	      this.$fileInput = this.options.$fileInput.attr({ accept: 'image/*' });
	      this.$preview = this.options.$preview.css({ backgroundRepeat: 'no-repeat' });
	      this.$zoomSlider = this.options.$zoomSlider.attr({ min: 0, max: 1, step: 0.01 });

	      this.previewSize = {
	        w: this.options.width || this.$preview.width(),
	        h: this.options.height || this.$preview.height()
	      };
	      if (this.options.width) {
	        this.$preview.width(this.previewSize.w);
	      }
	      if (this.options.height) {
	        this.$preview.height(this.previewSize.h);
	      }

	      this.imageBgBorderWidthArray = [0, 0, 0, 0];
	      if (this.options.imageBackground) {
	        if (_jquery2['default'].isArray(this.options.imageBackgroundBorderWidth)) {
	          this.imageBgBorderWidthArray = this.options.imageBackgroundBorderWidth;
	        } else {
	          [0, 1, 2, 3].forEach(function (i) {
	            _this.imageBgBorderWidthArray[i] = _this.options.imageBackgroundBorderWidth;
	          });
	        }
	        if (this.imageBgBorderWidthArray[0] > 0) {
	          this.$imageBgContainer.css('overflow', 'hidden');
	        }
	      }
	      // const $previewContainer = this.options.$previewContainer;
	      this.$imageBg = (0, _jquery2['default'])('<img />').addClass(_constants.CLASS_NAMES.IMAGE_BACKGROUND).attr('alt', '').css('position', 'absolute');
	      this.$imageBgContainer = (0, _jquery2['default'])('<div />').addClass(_constants.CLASS_NAMES.IMAGE_BACKGROUND_CONTAINER).css({
	        position: 'absolute',
	        // zIndex: 0,
	        left: -this.imageBgBorderWidthArray[3] + window.parseInt(this.$preview.css('border-left-width') || 0),
	        top: -this.imageBgBorderWidthArray[0] + window.parseInt(this.$preview.css('border-top-width') || 0),
	        width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
	        height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2]
	      }).append(this.$imageBg);
	      // $previewContainer
	      //   .css('position', 'relative')
	      //   .prepend(this.$imageBgContainer);
	      this.$preview.css('position', 'relative').prepend(this.$imageBgContainer);

	      this.$preview.hover(function () {
	        _this.$imageBg.addClass(_constants.CLASS_NAMES.PREVIEW_HOVERED);
	      }, function () {
	        _this.$imageBg.removeClass(_constants.CLASS_NAMES.PREVIEW_HOVERED);
	      });

	      this.offset = { x: 0, y: 0 };
	      this.setInitialZoom(this.options.initialZoom);
	      this.zoom = this.initialZoom;

	      this.imageLoaded = false;

	      if (this.options.allowDragNDrop) {
	        _jquery2['default'].event.props.push('dataTransfer');
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
	  }, {
	    key: 'bindListeners',
	    value: function bindListeners() {
	      this.$fileInput.on('change.cropit', this.onFileChange.bind(this));
	      //this.$preview.on(EVENTS.PREVIEW, this.onPreviewEvent.bind(this));
	      //this.$zoomSlider.on(EVENTS.ZOOM_INPUT, this.onZoomSliderChange.bind(this));

	      if (this.options.allowDragNDrop) {
	        this.$preview.on('dragover.cropit dragleave.cropit', this.onDragOver.bind(this));
	        this.$preview.on('drop.cropit', this.onDrop.bind(this));
	      }
	    }
	  }, {
	    key: 'unbindListeners',
	    value: function unbindListeners() {
	      this.$fileInput.off('change.cropit');
	      //this.$preview.off(EVENTS.PREVIEW);
	      this.$preview.off('dragover.cropit dragleave.cropit drop.cropit');
	      //this.$zoomSlider.off(EVENTS.ZOOM_INPUT);
	    }
	  }, {
	    key: 'onFileChange',
	    value: function onFileChange(e) {
	      this.options.onFileChange(e);

	      if (this.$fileInput.get(0).files) {
	        this.loadFileReader(this.$fileInput.get(0).files[0]);
	      }
	    }
	  }, {
	    key: 'loadFileReader',
	    value: function loadFileReader(file) {
	      var fileReader = new FileReader();
	      if (file && file.type.match('image')) {
	        fileReader.readAsDataURL(file);
	        fileReader.onload = this.onFileReaderLoaded.bind(this);
	        fileReader.onerror = this.onFileReaderError.bind(this);
	      } else if (file) {
	        this.onFileReaderError();
	      }
	    }
	  }, {
	    key: 'onFileReaderLoaded',
	    value: function onFileReaderLoaded(e) {
	      this.loadImage(e.target.result);
	    }
	  }, {
	    key: 'onFileReaderError',
	    value: function onFileReaderError() {
	      this.options.onFileReaderError();
	    }
	  }, {
	    key: 'onDragOver',
	    value: function onDragOver(e) {
	      e.preventDefault();
	      e.dataTransfer.dropEffect = 'copy';
	      this.$preview.toggleClass(_constants.CLASS_NAMES.DRAG_HOVERED, e.type === 'dragover');
	    }
	  }, {
	    key: 'onDrop',
	    value: function onDrop(e) {
	      var _this2 = this;

	      e.preventDefault();
	      e.stopPropagation();

	      var files = Array.prototype.slice.call(e.dataTransfer.files, 0);
	      files.some(function (file) {
	        if (!file.type.match('image')) {
	          return false;
	        }

	        _this2.loadFileReader(file);
	        return true;
	      });

	      this.$preview.removeClass(_constants.CLASS_NAMES.DRAG_HOVERED);
	    }
	  }, {
	    key: 'loadImage',
	    value: function loadImage(imageSrc) {
	      if (!imageSrc) {
	        return;
	      }

	      this.options.onImageLoading();
	      this.setImageLoadingClass();

	      this.preImage.src = imageSrc;
	    }
	  }, {
	    key: 'setImageSrc',
	    value: function setImageSrc(imageSrc) {
	      this.loadImage(imageSrc);
	    }
	  }, {
	    key: 'onPreImageLoaded',
	    value: function onPreImageLoaded() {
	      if (this.options.smallImage === 'reject' && (this.preImage.width * this.options.maxZoom < this.previewSize.w * this.options.exportZoom || this.preImage.height * this.options.maxZoom < this.previewSize.h * this.options.exportZoom)) {
	        this.onImageError(_constants.ERRORS.SMALL_IMAGE);
	        if (this.image.src) {
	          this.setImageLoadedClass();
	        }
	        return;
	      }

	      if (this.options.allowCrossOrigin) {
	        this.image.crossOrigin = this.preImage.src.indexOf('data:') === 0 ? null : 'Anonymous';
	      }

	      this.image.src = this.imageSrc = this.preImage.src;
	    }
	  }, {
	    key: 'onImageLoaded',
	    value: function onImageLoaded() {
	      this.imageSize = {
	        w: this.image.width,
	        h: this.image.height
	      };

	      // this.setupZoomer(this.options.imageState && this.options.imageState.zoom || this.initialZoom);
	      if (this.options.imageState && this.options.imageState.offset) {
	        this.offset = this.options.imageState.offset;
	      } else {
	        this.centerImage();
	      }

	      this.options.imageState = {};

	      this.$imageBg.attr('src', this.imageSrc).panzoom('resetDimensions');
	      this.zoom = 1; // should fix zoom
	      this.$imageBg.panzoom('zoom', this.zoom);

	      this.setImageLoadedClass();

	      this.imageLoaded = true;

	      this.options.onImageLoaded();
	    }
	  }, {
	    key: 'onImageError',
	    value: function onImageError() {
	      this.options.onImageError.apply(this, arguments);
	      this.removeImageLoadingClass();
	    }
	  }, {
	    key: 'setImageLoadingClass',
	    value: function setImageLoadingClass() {
	      this.$preview.removeClass(_constants.CLASS_NAMES.IMAGE_LOADED).addClass(_constants.CLASS_NAMES.IMAGE_LOADING);
	    }
	  }, {
	    key: 'setImageLoadedClass',
	    value: function setImageLoadedClass() {
	      this.$preview.removeClass(_constants.CLASS_NAMES.IMAGE_LOADING).addClass(_constants.CLASS_NAMES.IMAGE_LOADED);
	    }
	  }, {
	    key: 'removeImageLoadingClass',
	    value: function removeImageLoadingClass() {
	      this.$preview.removeClass(_constants.CLASS_NAMES.IMAGE_LOADING);
	    }
	  }, {
	    key: 'onChangePanZoom',

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

	    value: function onChangePanZoom(e, panzoom, matrix, changed) {
	      if (changed) {
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
	  }, {
	    key: 'centerImage',

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

	    value: function centerImage() {
	      if (!this.imageSize || !this.zoom) {
	        return;
	      }
	      this.$imageBg.panzoom('resetPan');

	      // this.setOffset({
	      //   x: (this.previewSize.w - this.imageSize.w * this.zoom) / 2,
	      //   y: (this.previewSize.h - this.imageSize.h * this.zoom) / 2,
	      // });
	    }
	  }, {
	    key: 'onZoomChange',
	    value: function onZoomChange(e, panzoom, scale, opts) {
	      if (!this.imageLoaded || scale === this.zoom) {
	        return;
	      }

	      this.zoom = scale;
	    }
	  }, {
	    key: 'enableZoomSlider',
	    value: function enableZoomSlider() {
	      this.$zoomSlider.removeAttr('disabled');
	      this.$imageBg.panzoom('option', 'disableZoom', false);
	      this.options.onZoomEnabled();
	    }
	  }, {
	    key: 'disableZoomSlider',
	    value: function disableZoomSlider() {
	      this.$zoomSlider.attr('disabled', true);
	      this.$imageBg.panzoom('option', 'disableZoom', true);
	      this.options.onZoomDisabled();
	    }
	  }, {
	    key: 'isZoomable',

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

	    value: function isZoomable() {
	      return this.$imageBg.panzoom('option', 'disablezoom');
	      // return this.zoomer.iszoomable();
	    }
	  }, {
	    key: 'getCroppedImageData',
	    value: function getCroppedImageData(exportOptions) {
	      if (!this.imageSrc) {
	        return;
	      }

	      var exportDefaults = {
	        type: 'image/png',
	        quality: 0.75,
	        originalSize: false,
	        fillBg: '#fff'
	      };
	      exportOptions = _jquery2['default'].extend({}, exportDefaults, exportOptions);

	      console.log('imageState');
	      console.log(this.getImageState());
	      var exportZoom = exportOptions.originalSize ? 1 / this.zoom : this.options.exportZoom;
	      console.log('exportZoom');
	      console.log(exportZoom);

	      var zoomedSize = {
	        w: this.zoom * exportZoom * this.image.naturalWidth,
	        h: this.zoom * exportZoom * this.image.naturalHeight
	      };
	      console.log('zoomedSize');
	      console.log(zoomedSize);
	      var transform_origin = this.$imageBg.css('transform-origin').split(' ').map(function (s) {
	        return s.replace('px', '');
	      });
	      console.log('transform-origin');
	      console.log(transform_origin);

	      var canvas = (0, _jquery2['default'])('<canvas />').attr({
	        width: this.previewSize.w * exportZoom,
	        height: this.previewSize.h * exportZoom
	      }).get(0);
	      var canvasContext = canvas.getContext('2d');

	      if (exportOptions.type === 'image/jpeg') {
	        canvasContext.fillStyle = exportOptions.fillBg;
	        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	      }

	      var matrix = this.$imageBg.panzoom('getMatrix');
	      canvasContext.translate(transform_origin[0], transform_origin[1]);
	      canvasContext.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
	      // canvasContext.drawImage(this.image,
	      //   this.offset.x * exportZoom,
	      //   this.offset.y * exportZoom,
	      //   zoomedSize.w,
	      //   zoomedSize.h);
	      canvasContext.drawImage(this.image, 0, 0, zoomedSize.w, zoomedSize.h);

	      return canvas.toDataURL(exportOptions.type, exportOptions.quality);
	    }
	  }, {
	    key: 'getImageState',
	    value: function getImageState() {
	      return {
	        src: this.imageSrc,
	        offset: this.offset,
	        zoom: this.zoom
	      };
	    }
	  }, {
	    key: 'getImageSrc',
	    value: function getImageSrc() {
	      return this.imageSrc;
	    }
	  }, {
	    key: 'getOffset',
	    value: function getOffset() {
	      return this.offset;
	    }
	  }, {
	    key: 'getZoom',
	    value: function getZoom() {
	      return this.zoom;
	    }
	  }, {
	    key: 'getImageSize',
	    value: function getImageSize() {
	      if (!this.imageSize) {
	        return null;
	      }

	      return {
	        width: this.imageSize.w,
	        height: this.imageSize.h
	      };
	    }
	  }, {
	    key: 'getInitialZoom',
	    value: function getInitialZoom() {
	      return this.options.initialZoom;
	    }
	  }, {
	    key: 'setInitialZoom',
	    value: function setInitialZoom(initialZoomOption) {
	      this.options.initialZoom = initialZoomOption;
	      if (initialZoomOption === 'min') {
	        this.initialZoom = 0; // Will be fixed when image loads
	      } else if (initialZoomOption === 'image') {
	        this.initialZoom = 1;
	      } else {
	        this.initialZoom = 0;
	      }
	    }
	  }, {
	    key: 'getExportZoom',
	    value: function getExportZoom() {
	      return this.options.exportZoom;
	    }
	  }, {
	    key: 'setExportZoom',
	    value: function setExportZoom(exportZoom) {
	      this.options.exportZoom = exportZoom;
	      // this.setupZoomer();
	    }
	  }, {
	    key: 'getMinZoom',
	    value: function getMinZoom() {
	      return this.options.minZoom;
	    }
	  }, {
	    key: 'setMinZoom',
	    value: function setMinZoom(minZoom) {
	      this.options.minZoom = minZoom;
	      // this.setupZoomer();
	      this.$imageBg.panzoom('option', 'minScale', minZoom).panzoom('zoom');
	    }
	  }, {
	    key: 'getMaxZoom',
	    value: function getMaxZoom() {
	      return this.options.maxZoom;
	    }
	  }, {
	    key: 'setMaxZoom',
	    value: function setMaxZoom(maxZoom) {
	      this.options.maxZoom = maxZoom;
	      // this.setupZoomer();
	      this.$imageBg.panzoom('option', 'maxScale', maxZoom).panzoom('zoom');
	    }
	  }, {
	    key: 'getPreviewSize',
	    value: function getPreviewSize() {
	      return {
	        width: this.previewSize.w,
	        height: this.previewSize.h
	      };
	    }
	  }, {
	    key: 'setPreviewSize',
	    value: function setPreviewSize(size) {
	      if (!size || size.width <= 0 || size.height <= 0) {
	        return;
	      }

	      this.previewSize = {
	        w: size.width,
	        h: size.height
	      };
	      this.$preview.css({
	        width: this.previewSize.w,
	        height: this.previewSize.h
	      });

	      this.$imageBgContainer.css({
	        width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
	        height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2]
	      });
	    }
	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.unbindListeners();
	      this.disableZoomSlider();
	      this.$el.addClass(_constants.CLASS_NAMES.DISABLED);
	      this.$imageBg.panzoom('disable');
	    }
	  }, {
	    key: 'reenable',
	    value: function reenable() {
	      this.bindListeners();
	      this.enableZoomSlider();
	      this.$el.removeClass(_constants.CLASS_NAMES.DISABLED);
	      this.$imageBg.panzoom('enable');
	    }
	  }, {
	    key: '$',
	    value: function $(selector) {
	      if (!this.$el) {
	        return null;
	      }
	      return this.$el.find(selector);
	    }
	  }]);

	  return Cropit;
	})();

	exports['default'] = Cropit;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @license jquery.panzoom.js v2.0.5
	 * Updated: Thu Apr 03 2014
	 * Add pan and zoom functionality to any element
	 * Copyright (c) 2014 timmy willison
	 * Released under the MIT license
	 * https://github.com/timmywil/jquery.panzoom/blob/master/MIT-License.txt
	 */

	(function(global, factory) {
		// AMD
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1) ], __WEBPACK_AMD_DEFINE_RESULT__ = function(jQuery) {
				return factory(global, jQuery);
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		// CommonJS/Browserify
		} else if (typeof exports === 'object') {
			factory(global, require('jquery'));
		// Global
		} else {
			factory(global, global.jQuery);
		}
	}(typeof window !== 'undefined' ? window : this, function(window, $) {
		'use strict';

		// Common properties to lift for touch or pointer events
		var list = 'over out down up move enter leave cancel'.split(' ');
		var hook = $.extend({}, $.event.mouseHooks);
		var events = {};

		// Support pointer events in IE11+ if available
		if ( window.PointerEvent ) {
			$.each(list, function( i, name ) {
				// Add event name to events property and add fixHook
				$.event.fixHooks[
					(events[name] = 'pointer' + name)
				] = hook;
			});
		} else {
			var mouseProps = hook.props;
			// Add touch properties for the touch hook
			hook.props = mouseProps.concat(['touches', 'changedTouches', 'targetTouches', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']);

			/**
			 * Support: Android
			 * Android sets pageX/Y to 0 for any touch event
			 * Attach first touch's pageX/pageY and clientX/clientY if not set correctly
			 */
			hook.filter = function( event, originalEvent ) {
				var touch;
				var i = mouseProps.length;
				if ( !originalEvent.pageX && originalEvent.touches && (touch = originalEvent.touches[0]) ) {
					// Copy over all mouse properties
					while(i--) {
						event[mouseProps[i]] = touch[mouseProps[i]];
					}
				}
				return event;
			};

			$.each(list, function( i, name ) {
				// No equivalent touch events for over and out
				if (i < 2) {
					events[ name ] = 'mouse' + name;
				} else {
					var touch = 'touch' +
						(name === 'down' ? 'start' : name === 'up' ? 'end' : name);
					// Add fixHook
					$.event.fixHooks[ touch ] = hook;
					// Add event names to events property
					events[ name ] = touch + ' mouse' + name;
				}
			});
		}

		$.pointertouch = events;

		var datakey = '__pz__';
		var slice = Array.prototype.slice;
		var pointerEvents = !!window.PointerEvent;

		// Regex
		var rupper = /([A-Z])/g;
		var rsvg = /^http:[\w\.\/]+svg$/;
		var rinline = /^inline/;

		var floating = '(\\-?[\\d\\.e]+)';
		var commaSpace = '\\,?\\s*';
		var rmatrix = new RegExp(
			'^matrix\\(' +
			floating + commaSpace +
			floating + commaSpace +
			floating + commaSpace +
			floating + commaSpace +
			floating + commaSpace +
			floating + '\\)$'
		);

		/**
		 * Utility for determing transform matrix equality
		 * Checks backwards to test translation first
		 * @param {Array} first
		 * @param {Array} second
		 */
		function matrixEquals(first, second) {
			var i = first.length;
			while(--i) {
				if (+first[i] !== +second[i]) {
					return false;
				}
			}
			return true;
		}

		/**
		 * Creates the options object for reset functions
		 * @param {Boolean|Object} opts See reset methods
		 * @returns {Object} Returns the newly-created options object
		 */
		function createResetOptions(opts) {
			var options = { range: true, animate: true };
			if (typeof opts === 'boolean') {
				options.animate = opts;
			} else {
				$.extend(options, opts);
			}
			return options;
		}

		/**
		 * Represent a transformation matrix with a 3x3 matrix for calculations
		 * Matrix functions adapted from Louis Remi's jQuery.transform (https://github.com/louisremi/jquery.transform.js)
		 * @param {Array|Number} a An array of six values representing a 2d transformation matrix
		 */
		function Matrix(a, b, c, d, e, f, g, h, i) {
			if ($.type(a) === 'array') {
				this.elements = [
					+a[0], +a[2], +a[4],
					+a[1], +a[3], +a[5],
					    0,     0,     1
				];
			} else {
				this.elements = [
					a, b, c,
					d, e, f,
					g || 0, h || 0, i || 1
				];
			}
		}

		Matrix.prototype = {
			/**
			 * Multiply a 3x3 matrix by a similar matrix or a vector
			 * @param {Matrix|Vector} matrix
			 * @return {Matrix|Vector} Returns a vector if multiplying by a vector
			 */
			x: function(matrix) {
				var isVector = matrix instanceof Vector;

				var a = this.elements,
					b = matrix.elements;

				if (isVector && b.length === 3) {
					// b is actually a vector
					return new Vector(
						a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
						a[3] * b[0] + a[4] * b[1] + a[5] * b[2],
						a[6] * b[0] + a[7] * b[1] + a[8] * b[2]
					);
				} else if (b.length === a.length) {
					// b is a 3x3 matrix
					return new Matrix(
						a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
						a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
						a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

						a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
						a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
						a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

						a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
						a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
						a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
					);
				}
				return false; // fail
			},
			/**
			 * Generates an inverse of the current matrix
			 * @returns {Matrix}
			 */
			inverse: function() {
				var d = 1 / this.determinant(),
					a = this.elements;
				return new Matrix(
					d * ( a[8] * a[4] - a[7] * a[5]),
					d * (-(a[8] * a[1] - a[7] * a[2])),
					d * ( a[5] * a[1] - a[4] * a[2]),

					d * (-(a[8] * a[3] - a[6] * a[5])),
					d * ( a[8] * a[0] - a[6] * a[2]),
					d * (-(a[5] * a[0] - a[3] * a[2])),

					d * ( a[7] * a[3] - a[6] * a[4]),
					d * (-(a[7] * a[0] - a[6] * a[1])),
					d * ( a[4] * a[0] - a[3] * a[1])
				);
			},
			/**
			 * Calculates the determinant of the current matrix
			 * @returns {Number}
			 */
			determinant: function() {
				var a = this.elements;
				return a[0] * (a[8] * a[4] - a[7] * a[5]) - a[3] * (a[8] * a[1] - a[7] * a[2]) + a[6] * (a[5] * a[1] - a[4] * a[2]);
			}
		};

		/**
		 * Create a vector containing three values
		 */
		function Vector(x, y, z) {
			this.elements = [ x, y, z ];
		}

		/**
		 * Get the element at zero-indexed index i
		 * @param {Number} i
		 */
		Vector.prototype.e = Matrix.prototype.e = function(i) {
			return this.elements[ i ];
		};

		/**
		 * Create a Panzoom object for a given element
		 * @constructor
		 * @param {Element} elem - Element to use pan and zoom
		 * @param {Object} [options] - An object literal containing options to override default options
		 *  (See Panzoom.defaults for ones not listed below)
		 * @param {jQuery} [options.$zoomIn] - zoom in buttons/links collection (you can also bind these yourself
		 *  e.g. $button.on('click', function(e) { e.preventDefault(); $elem.panzooom('zoomIn'); });)
		 * @param {jQuery} [options.$zoomOut] - zoom out buttons/links collection on which to bind zoomOut
		 * @param {jQuery} [options.$zoomRange] - zoom in/out with this range control
		 * @param {jQuery} [options.$reset] - Reset buttons/links collection on which to bind the reset method
		 * @param {Function} [options.on[Start|Change|Zoom|Pan|End|Reset] - Optional callbacks for panzoom events
		 */
		function Panzoom(elem, options) {

			// Allow instantiation without `new` keyword
			if (!(this instanceof Panzoom)) {
				return new Panzoom(elem, options);
			}

			// Sanity checks
			if (elem.nodeType !== 1) {
				$.error('Panzoom called on non-Element node');
			}
			if (!$.contains(document, elem)) {
				$.error('Panzoom element must be attached to the document');
			}

			// Don't remake
			var d = $.data(elem, datakey);
			if (d) {
				return d;
			}

			// Extend default with given object literal
			// Each instance gets its own options
			this.options = options = $.extend({}, Panzoom.defaults, options);
			this.elem = elem;
			var $elem = this.$elem = $(elem);
			this.$set = options.$set && options.$set.length ? options.$set : $elem;
			this.$doc = $(elem.ownerDocument || document);
			this.$parent = $elem.parent();

			// This is SVG if the namespace is SVG
			// However, while <svg> elements are SVG, we want to treat those like other elements
			this.isSVG = rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== 'svg';

			this.panning = false;

			// Save the original transform value
			// Save the prefixed transform style key
			// Set the starting transform
			this._buildTransform();

			// Build the appropriately-prefixed transform style property name
			// De-camelcase
			this._transform = !this.isSVG && $.cssProps.transform.replace(rupper, '-$1').toLowerCase();

			// Build the transition value
			this._buildTransition();

			// Build containment dimensions
			this.resetDimensions();

			// Add zoom and reset buttons to `this`
			var $empty = $();
			var self = this;
			$.each([ '$zoomIn', '$zoomOut', '$zoomRange', '$reset' ], function(i, name) {
				self[ name ] = options[ name ] || $empty;
			});

			this.enable();

			// Save the instance
			$.data(elem, datakey, this);
		}

		// Attach regex for possible use (immutable)
		Panzoom.rmatrix = rmatrix;

		// Container for event names
		Panzoom.events = $.pointertouch;

		Panzoom.defaults = {
			// Should always be non-empty
			// Used to bind jQuery events without collisions
			// A guid is not added here as different instantiations/versions of panzoom
			// on the same element is not supported, so don't do it.
			eventNamespace: '.panzoom',

			// Whether or not to transition the scale
			transition: true,

			// Default cursor style for the element
			cursor: 'move',

			// There may be some use cases for zooming without panning or vice versa
			disablePan: false,
			disableZoom: false,

			// The increment at which to zoom
			// adds/subtracts to the scale each time zoomIn/Out is called
			increment: 0.3,

			minScale: 0.4,
			maxScale: 5,

			// The default step for the range input
			// Precendence: default < HTML attribute < option setting
			rangeStep: 0.05,

			// Animation duration (ms)
			duration: 200,
			// CSS easing used for scale transition
			easing: 'ease-in-out',

			// Indicate that the element should be contained within it's parent when panning
			// Note: this does not affect zooming outside of the parent
			// Set this value to 'invert' to only allow panning outside of the parent element (basically the opposite of the normal use of contain)
			// 'invert' is useful for a large panzoom element where you don't want to show anything behind it
			contain: false
		};

		Panzoom.prototype = {
			constructor: Panzoom,

			/**
			 * @returns {Panzoom} Returns the instance
			 */
			instance: function() {
				return this;
			},

			/**
			 * Enable or re-enable the panzoom instance
			 */
			enable: function() {
				// Unbind first
				this._initStyle();
				this._bind();
				this.disabled = false;
			},

			/**
			 * Disable panzoom
			 */
			disable: function() {
				this.disabled = true;
				this._resetStyle();
				this._unbind();
			},

			/**
			 * @returns {Boolean} Returns whether the current panzoom instance is disabled
			 */
			isDisabled: function() {
				return this.disabled;
			},

			/**
			 * Destroy the panzoom instance
			 */
			destroy: function() {
				this.disable();
				$.removeData(this.elem, datakey);
			},

			/**
			 * Builds the restricing dimensions from the containment element
			 * Also used with focal points
			 * Call this method whenever the dimensions of the element or parent are changed
			 */
			resetDimensions: function() {
				// Reset container properties
				var $parent = this.$parent;
				this.container = {
					width: $parent.innerWidth(),
					height: $parent.innerHeight()
				};
				var po = $parent.offset();
				var elem = this.elem;
				var $elem = this.$elem;
				var dims;
				if (this.isSVG) {
					dims = elem.getBoundingClientRect();
					dims = {
						left: dims.left - po.left,
						top: dims.top - po.top,
						width: dims.width,
						height: dims.height,
						margin: { left: 0, top: 0 }
					};
				} else {
					dims = {
						left: $.css(elem, 'left', true) || 0,
						top: $.css(elem, 'top', true) || 0,
						width: $elem.innerWidth(),
						height: $elem.innerHeight(),
						margin: {
							top: $.css(elem, 'marginTop', true) || 0,
							left: $.css(elem, 'marginLeft', true) || 0
						}
					};
				}
				dims.widthBorder = ($.css(elem, 'borderLeftWidth', true) + $.css(elem, 'borderRightWidth', true)) || 0;
				dims.heightBorder = ($.css(elem, 'borderTopWidth', true) + $.css(elem, 'borderBottomWidth', true)) || 0;
				this.dimensions = dims;
			},

			/**
			 * Return the element to it's original transform matrix
			 * @param {Boolean} [options] If a boolean is passed, animate the reset (default: true). If an options object is passed, simply pass that along to setMatrix.
			 * @param {Boolean} [options.silent] Silence the reset event
			 */
			reset: function(options) {
				options = createResetOptions(options);
				// Reset the transform to its original value
				var matrix = this.setMatrix(this._origTransform, options);
				if (!options.silent) {
					this._trigger('reset', matrix);
				}
			},

			/**
			 * Only resets zoom level
			 * @param {Boolean|Object} [options] Whether to animate the reset (default: true) or an object of options to pass to zoom()
			 */
			resetZoom: function(options) {
				options = createResetOptions(options);
				var origMatrix = this.getMatrix(this._origTransform);
				options.dValue = origMatrix[ 3 ];
				this.zoom(origMatrix[0], options);
			},

			/**
			 * Only reset panning
			 * @param {Boolean|Object} [options] Whether to animate the reset (default: true) or an object of options to pass to pan()
			 */
			resetPan: function(options) {
				var origMatrix = this.getMatrix(this._origTransform);
				this.pan(origMatrix[4], origMatrix[5], createResetOptions(options));
			},

			/**
			 * Sets a transform on the $set
			 * @param {String} transform
			 */
			setTransform: function(transform) {
				var method = this.isSVG ? 'attr' : 'style';
				var $set = this.$set;
				var i = $set.length;
				while(i--) {
					$[method]($set[i], 'transform', transform);
				}
			},

			/**
			 * Retrieving the transform is different for SVG
			 *  (unless a style transform is already present)
			 * Uses the $set collection for retrieving the transform
			 * @param {String} [transform] Pass in an transform value (like 'scale(1.1)')
			 *  to have it formatted into matrix format for use by Panzoom
			 * @returns {String} Returns the current transform value of the element
			 */
			getTransform: function(transform) {
				var $set = this.$set;
				var transformElem = $set[0];
				if (transform) {
					this.setTransform(transform);
				} else {
					// Retrieve the transform
					transform = $[this.isSVG ? 'attr' : 'style'](transformElem, 'transform');
				}

				// Convert any transforms set by the user to matrix format
				// by setting to computed
				if (transform !== 'none' && !rmatrix.test(transform)) {
					// Get computed and set for next time
					this.setTransform(transform = $.css(transformElem, 'transform'));
				}

				return transform || 'none';
			},

			/**
			 * Retrieve the current transform matrix for $elem (or turn a transform into it's array values)
			 * @param {String} [transform] matrix-formatted transform value
			 * @returns {Array} Returns the current transform matrix split up into it's parts, or a default matrix
			 */
			getMatrix: function(transform) {
				var matrix = rmatrix.exec(transform || this.getTransform());
				if (matrix) {
					matrix.shift();
				}
				return matrix || [ 1, 0, 0, 1, 0, 0 ];
			},

			/**
			 * Given a matrix object, quickly set the current matrix of the element
			 * @param {Array|String} matrix
			 * @param {Boolean} [animate] Whether to animate the transform change
			 * @param {Object} [options]
			 * @param {Boolean|String} [options.animate] Whether to animate the transform change, or 'skip' indicating that it is unnecessary to set
			 * @param {Boolean} [options.contain] Override the global contain option
			 * @param {Boolean} [options.range] If true, $zoomRange's value will be updated.
			 * @param {Boolean} [options.silent] If true, the change event will not be triggered
			 * @returns {Array} Returns the newly-set matrix
			 */
			setMatrix: function(matrix, options) {
				if (this.disabled) { return; }
				if (!options) { options = {}; }
				// Convert to array
				if (typeof matrix === 'string') {
					matrix = this.getMatrix(matrix);
				}
				var dims, container, marginW, marginH, diffW, diffH, left, top, width, height;
				var scale = +matrix[0];
				var $parent = this.$parent;
				var contain = typeof options.contain !== 'undefined' ? options.contain : this.options.contain;

				// Apply containment
				if (contain) {
					dims = this._checkDims();
					container = this.container;
					width = dims.width + dims.widthBorder;
					height = dims.height + dims.heightBorder;
					// Use absolute value of scale here as negative scale doesn't mean even smaller
					marginW = ((width * Math.abs(scale)) - container.width) / 2;
					marginH = ((height * Math.abs(scale)) - container.height) / 2;
					left = dims.left + dims.margin.left;
					top = dims.top + dims.margin.top;
					if (contain === 'invert') {
						diffW = width > container.width ? width - container.width : 0;
						diffH = height > container.height ? height - container.height : 0;
						marginW += (container.width - width) / 2;
						marginH += (container.height - height) / 2;
						matrix[4] = Math.max(Math.min(matrix[4], marginW - left), -marginW - left - diffW);
						matrix[5] = Math.max(Math.min(matrix[5], marginH - top), -marginH - top - diffH + dims.heightBorder);
					} else {
						// marginW += dims.widthBorder / 2;
						marginH += dims.heightBorder / 2;
						diffW = container.width > width ? container.width - width : 0;
						diffH = container.height > height ? container.height - height : 0;
						// If the element is not naturally centered, assume full margin right
						if ($parent.css('textAlign') !== 'center' || !rinline.test($.css(this.elem, 'display'))) {
							marginW = marginH = 0;
						} else {
							diffW = 0;
						}
						matrix[4] = Math.min(
							Math.max(matrix[4], marginW - left),
							-marginW - left + diffW
						);
						matrix[5] = Math.min(
							Math.max(matrix[5], marginH - top),
							-marginH - top + diffH
						);
					}
				}
				if (options.animate !== 'skip') {
					// Set transition
					this.transition(!options.animate);
				}
				// Update range
				if (options.range) {
					this.$zoomRange.val(scale);
				}

				// Set the matrix on this.$set
				this.setTransform('matrix(' + matrix.join(',') + ')');

				if (!options.silent) {
					this._trigger('change', matrix);
				}

				return matrix;
			},

			/**
			 * @returns {Boolean} Returns whether the panzoom element is currently being dragged
			 */
			isPanning: function() {
				return this.panning;
			},

			/**
			 * Apply the current transition to the element, if allowed
			 * @param {Boolean} [off] Indicates that the transition should be turned off
			 */
			transition: function(off) {
				if (!this._transition) { return; }
				var transition = off || !this.options.transition ? 'none' : this._transition;
				var $set = this.$set;
				var i = $set.length;
				while(i--) {
					// Avoid reflows when zooming
					if ($.style($set[i], 'transition') !== transition) {
						$.style($set[i], 'transition', transition);
					}
				}
			},

			/**
			 * Pan the element to the specified translation X and Y
			 * Note: this is not the same as setting jQuery#offset() or jQuery#position()
			 * @param {Number} x
			 * @param {Number} y
			 * @param {Object} [options] These options are passed along to setMatrix
			 * @param {Array} [options.matrix] The matrix being manipulated (if already known so it doesn't have to be retrieved again)
			 * @param {Boolean} [options.silent] Silence the pan event. Note that this will also silence the setMatrix change event.
			 * @param {Boolean} [options.relative] Make the x and y values relative to the existing matrix
			 */
			pan: function(x, y, options) {
				if (this.options.disablePan) { return; }
				if (!options) { options = {}; }
				var matrix = options.matrix;
				if (!matrix) {
					matrix = this.getMatrix();
				}
				// Cast existing matrix values to numbers
				if (options.relative) {
					x += +matrix[4];
					y += +matrix[5];
				}
				matrix[4] = x;
				matrix[5] = y;
				this.setMatrix(matrix, options);
				if (!options.silent) {
					this._trigger('pan', matrix[4], matrix[5]);
				}
			},

			/**
			 * Zoom in/out the element using the scale properties of a transform matrix
			 * @param {Number|Boolean} [scale] The scale to which to zoom or a boolean indicating to transition a zoom out
			 * @param {Object} [opts] All global options can be overwritten by this options object. For example, override the default increment.
			 * @param {Boolean} [opts.noSetRange] Specify that the method should not set the $zoomRange value (as is the case when $zoomRange is calling zoom on change)
			 * @param {jQuery.Event|Object} [opts.focal] A focal point on the panzoom element on which to zoom.
			 *  If an object, set the clientX and clientY properties to the position relative to the parent
			 * @param {Boolean} [opts.animate] Whether to animate the zoom (defaults to true if scale is not a number, false otherwise)
			 * @param {Boolean} [opts.silent] Silence the zoom event
			 * @param {Array} [opts.matrix] Optionally pass the current matrix so it doesn't need to be retrieved
			 * @param {Number} [opts.dValue] Think of a transform matrix as four values a, b, c, d
			 *  where a/d are the horizontal/vertical scale values and b/c are the skew values
			 *  (5 and 6 of matrix array are the tx/ty transform values).
			 *  Normally, the scale is set to both the a and d values of the matrix.
			 *  This option allows you to specify a different d value for the zoom.
			 *  For instance, to flip vertically, you could set -1 as the dValue.
			 */
			zoom: function(scale, opts) {
				// Shuffle arguments
				if (typeof scale === 'object') {
					opts = scale;
					scale = null;
				} else if (!opts) {
					opts = {};
				}
				var options = $.extend({}, this.options, opts);
				// Check if disabled
				if (options.disableZoom) { return; }
				var animate = false;
				var matrix = options.matrix || this.getMatrix();

				// Calculate zoom based on increment
				if (typeof scale !== 'number') {
					scale = +matrix[0] + (options.increment * (scale ? -1 : 1));
					animate = true;
				}

				// Constrain scale
				if (scale > options.maxScale) {
					scale = options.maxScale;
				} else if (scale < options.minScale) {
					scale = options.minScale;
				}

				// Calculate focal point based on scale
				var focal = options.focal;
				if (focal && !options.disablePan) {
					// Adapted from code by Florian Günther
					// https://github.com/florianguenther/zui53
					var dims = this._checkDims();
					var clientX = focal.clientX;
					var clientY = focal.clientY;
					// Adjust the focal point for default transform-origin => 50% 50%
					if (!this.isSVG) {
						clientX -= (dims.width + dims.widthBorder) / 2;
						clientY -= (dims.height + dims.heightBorder) / 2;
					}
					var clientV = new Vector(clientX, clientY, 1);
					var surfaceM = new Matrix(matrix);
					// Supply an offset manually if necessary
					var o = this.parentOffset || this.$parent.offset();
					var offsetM = new Matrix(1, 0, o.left - this.$doc.scrollLeft(), 0, 1, o.top - this.$doc.scrollTop());
					var surfaceV = surfaceM.inverse().x(offsetM.inverse().x(clientV));
					var scaleBy = scale / matrix[0];
					surfaceM = surfaceM.x(new Matrix([ scaleBy, 0, 0, scaleBy, 0, 0 ]));
					clientV = offsetM.x(surfaceM.x(surfaceV));
					matrix[4] = +matrix[4] + (clientX - clientV.e(0));
					matrix[5] = +matrix[5] + (clientY - clientV.e(1));
				}

				// Set the scale
				matrix[0] = scale;
				matrix[3] = typeof options.dValue === 'number' ? options.dValue : scale;

				// Calling zoom may still pan the element
				this.setMatrix(matrix, {
					animate: typeof options.animate === 'boolean' ? options.animate : animate,
					// Set the zoomRange value
					range: !options.noSetRange
				});

				// Trigger zoom event
				if (!options.silent) {
					this._trigger('zoom', matrix[0], options);
				}
			},

			/**
			 * Get/set option on an existing instance
			 * @returns {Array|undefined} If getting, returns an array of all values
			 *   on each instance for a given key. If setting, continue chaining by returning undefined.
			 */
			option: function(key, value) {
				var options;
				if (!key) {
					// Avoids returning direct reference
					return $.extend({}, this.options);
				}

				if (typeof key === 'string') {
					if (arguments.length === 1) {
						return this.options[ key ] !== undefined ?
							this.options[ key ] :
							null;
					}
					options = {};
					options[ key ] = value;
				} else {
					options = key;
				}

				this._setOptions(options);
			},

			/**
			 * Internally sets options
			 * @param {Object} options - An object literal of options to set
			 */
			_setOptions: function(options) {
				$.each(options, $.proxy(function(key, value) {
					switch(key) {
						case 'disablePan':
							this._resetStyle();
							/* falls through */
						case '$zoomIn':
						case '$zoomOut':
						case '$zoomRange':
						case '$reset':
						case 'disableZoom':
						case 'onStart':
						case 'onChange':
						case 'onZoom':
						case 'onPan':
						case 'onEnd':
						case 'onReset':
						case 'eventNamespace':
							this._unbind();
					}
					this.options[ key ] = value;
					switch(key) {
						case 'disablePan':
							this._initStyle();
							/* falls through */
						case '$zoomIn':
						case '$zoomOut':
						case '$zoomRange':
						case '$reset':
							// Set these on the instance
							this[ key ] = value;
							/* falls through */
						case 'disableZoom':
						case 'onStart':
						case 'onChange':
						case 'onZoom':
						case 'onPan':
						case 'onEnd':
						case 'onReset':
						case 'eventNamespace':
							this._bind();
							break;
						case 'cursor':
							$.style(this.elem, 'cursor', value);
							break;
						case 'minScale':
							this.$zoomRange.attr('min', value);
							break;
						case 'maxScale':
							this.$zoomRange.attr('max', value);
							break;
						case 'rangeStep':
							this.$zoomRange.attr('step', value);
							break;
						case 'startTransform':
							this._buildTransform();
							break;
						case 'duration':
						case 'easing':
							this._buildTransition();
							/* falls through */
						case 'transition':
							this.transition();
							break;
						case '$set':
							if (value instanceof $ && value.length) {
								this.$set = value;
								// Reset styles
								this._initStyle();
								this._buildTransform();
							}
					}
				}, this));
			},

			/**
			 * Initialize base styles for the element and its parent
			 */
			_initStyle: function() {
				var styles = {
					// Promote the element to it's own compositor layer
					'backface-visibility': 'hidden',
					// Set to defaults for the namespace
					'transform-origin': this.isSVG ? '0 0' : '50% 50%'
				};
				// Set elem styles
				if (!this.options.disablePan) {
					styles.cursor = this.options.cursor;
				}
				this.$set.css(styles);

				// Set parent to relative if set to static
				var $parent = this.$parent;
				// No need to add styles to the body
				if ($parent.length && !$.nodeName($parent[0], 'body')) {
					styles = {
						overflow: 'hidden'
					};
					if ($parent.css('position') === 'static') {
						styles.position = 'relative';
					}
					$parent.css(styles);
				}
			},

			/**
			 * Undo any styles attached in this plugin
			 */
			_resetStyle: function() {
				this.$elem.css({
					'cursor': '',
					'transition': ''
				});
				this.$parent.css({
					'overflow': '',
					'position': ''
				});
			},

			/**
			 * Binds all necessary events
			 */
			_bind: function() {
				var self = this;
				var options = this.options;
				var ns = options.eventNamespace;
				var str_start = pointerEvents ? 'pointerdown' + ns : ('touchstart' + ns + ' mousedown' + ns);
				var str_click = pointerEvents ? 'pointerup' + ns : ('touchend' + ns + ' click' + ns);
				var events = {};
				var $reset = this.$reset;
				var $zoomRange = this.$zoomRange;

				// Bind panzoom events from options
				$.each([ 'Start', 'Change', 'Zoom', 'Pan', 'End', 'Reset' ], function() {
					var m = options[ 'on' + this ];
					if ($.isFunction(m)) {
						events[ 'panzoom' + this.toLowerCase() + ns ] = m;
					}
				});

				// Bind $elem drag and click/touchdown events
				// Bind touchstart if either panning or zooming is enabled
				if (!options.disablePan || !options.disableZoom) {
					events[ str_start ] = function(e) {
						var touches;
						if (e.type === 'touchstart' ?
							// Touch
							(touches = e.touches) &&
								((touches.length === 1 && !options.disablePan) || touches.length === 2) :
							// Mouse/Pointer: Ignore right click
							!options.disablePan && e.which === 1) {

							e.preventDefault();
							e.stopPropagation();
							self._startMove(e, touches);
						}
					};
				}
				this.$elem.on(events);

				// Bind reset
				if ($reset.length) {
					$reset.on(str_click, function(e) {
						e.preventDefault();
						self.reset();
					});
				}

				// Set default attributes for the range input
				if ($zoomRange.length) {
					$zoomRange.attr({
						// Only set the range step if explicit or
						// set the default if there is no attribute present
						step: options.rangeStep === Panzoom.defaults.rangeStep &&
							$zoomRange.attr('step') ||
							options.rangeStep,
						min: options.minScale,
						max: options.maxScale
					}).prop({
						value: this.getMatrix()[0]
					});
				}

				// No bindings if zooming is disabled
				if (options.disableZoom) {
					return;
				}

				var $zoomIn = this.$zoomIn;
				var $zoomOut = this.$zoomOut;

				// Bind zoom in/out
				// Don't bind one without the other
				if ($zoomIn.length && $zoomOut.length) {
					// preventDefault cancels future mouse events on touch events
					$zoomIn.on(str_click, function(e) {
						e.preventDefault();
						self.zoom();
					});
					$zoomOut.on(str_click, function(e) {
						e.preventDefault();
						self.zoom(true);
					});
				}

				if ($zoomRange.length) {
					events = {};
					// Cannot prevent default action here, just use pointerdown/mousedown
					events[ (pointerEvents ? 'pointerdown' : 'mousedown') + ns ] = function() {
						self.transition(true);
					};
					events[ 'change' + ns ] = function() {
						self.zoom(+this.value, { noSetRange: true });
					};
					$zoomRange.on(events);
				}
			},

			/**
			 * Unbind all events
			 */
			_unbind: function() {
				this.$elem
					.add(this.$zoomIn)
					.add(this.$zoomOut)
					.add(this.$reset)
					.off(this.options.eventNamespace);
			},

			/**
			 * Builds the original transform value
			 */
			_buildTransform: function() {
				// Save the original transform
				// Retrieving this also adds the correct prefixed style name
				// to jQuery's internal $.cssProps
				return this._origTransform = this.getTransform(this.options.startTransform);
			},

			/**
			 * Set transition property for later use when zooming
			 * If SVG, create necessary animations elements for translations and scaling
			 */
			_buildTransition: function() {
				if (this._transform) {
					var options = this.options;
					this._transition = this._transform + ' ' + options.duration + 'ms ' + options.easing;
				}
			},

			/**
			 * Checks dimensions to make sure they don't need to be re-calculated
			 */
			_checkDims: function() {
				var dims = this.dimensions;
				// Rebuild if width or height is still 0
				if (!dims.width || !dims.height) {
					this.resetDimensions();
				}
				return this.dimensions;
			},

			/**
			 * Calculates the distance between two touch points
			 * Remember pythagorean?
			 * @param {Array} touches
			 * @returns {Number} Returns the distance
			 */
			_getDistance: function(touches) {
				var touch1 = touches[0];
				var touch2 = touches[1];
				return Math.sqrt(Math.pow(Math.abs(touch2.clientX - touch1.clientX), 2) + Math.pow(Math.abs(touch2.clientY - touch1.clientY), 2));
			},

			/**
			 * Constructs an approximated point in the middle of two touch points
			 * @returns {Object} Returns an object containing pageX and pageY
			 */
			_getMiddle: function(touches) {
				var touch1 = touches[0];
				var touch2 = touches[1];
				return {
					clientX: ((touch2.clientX - touch1.clientX) / 2) + touch1.clientX,
					clientY: ((touch2.clientY - touch1.clientY) / 2) + touch1.clientY
				};
			},

			/**
			 * Trigger a panzoom event on our element
			 * The event is passed the Panzoom instance
			 * @param {String|jQuery.Event} event
			 * @param {Mixed} arg1[, arg2, arg3, ...] Arguments to append to the trigger
			 */
			_trigger: function (event) {
				if (typeof event === 'string') {
					event = 'panzoom' + event;
				}
				this.$elem.triggerHandler(event, [this].concat(slice.call(arguments, 1)));
			},

			/**
			 * Starts the pan
			 * This is bound to mouse/touchmove on the element
			 * @param {jQuery.Event} event An event with pageX, pageY, and possibly the touches list
			 * @param {TouchList} [touches] The touches list if present
			 */
			_startMove: function(event, touches) {
				var move, moveEvent, endEvent,
					startDistance, startScale, startMiddle,
					startPageX, startPageY;
				var self = this;
				var options = this.options;
				var ns = options.eventNamespace;
				var matrix = this.getMatrix();
				var original = matrix.slice(0);
				var origPageX = +original[4];
				var origPageY = +original[5];
				var panOptions = { matrix: matrix, animate: 'skip' };

				// Use proper events
				if (pointerEvents) {
					moveEvent = 'pointermove';
					endEvent = 'pointerup';
				} else if (event.type === 'touchstart') {
					moveEvent = 'touchmove';
					endEvent = 'touchend';
				} else {
					moveEvent = 'mousemove';
					endEvent = 'mouseup';
				}

				// Add namespace
				moveEvent += ns;
				endEvent += ns;

				// Remove any transitions happening
				this.transition(true);

				// Indicate that we are currently panning
				this.panning = true;

				// Trigger start event
				this._trigger('start', event, touches);

				if (touches && touches.length === 2) {
					startDistance = this._getDistance(touches);
					startScale = +matrix[0];
					startMiddle = this._getMiddle(touches);
					move = function(e) {
						e.preventDefault();

						// Calculate move on middle point
						var middle = self._getMiddle(touches = e.touches);
						var diff = self._getDistance(touches) - startDistance;

						// Set zoom
						self.zoom(diff * (options.increment / 100) + startScale, {
							focal: middle,
							matrix: matrix,
							animate: false
						});

						// Set pan
						self.pan(
							+matrix[4] + middle.clientX - startMiddle.clientX,
							+matrix[5] + middle.clientY - startMiddle.clientY,
							panOptions
						);
						startMiddle = middle;
					};
				} else {
					startPageX = event.pageX;
					startPageY = event.pageY;

					/**
					 * Mousemove/touchmove function to pan the element
					 * @param {Object} e Event object
					 */
					move = function(e) {
						e.preventDefault();
						self.pan(
							origPageX + e.pageX - startPageX,
							origPageY + e.pageY - startPageY,
							panOptions
						);
					};
				}

				// Bind the handlers
				$(document)
					.off(ns)
					.on(moveEvent, move)
					.on(endEvent, function(e) {
						e.preventDefault();
						// Unbind all document events
						$(this).off(ns);
						self.panning = false;
						// Trigger our end event
						// Simply set the type to "panzoomend" to pass through all end properties
						// jQuery's `not` is used here to compare Array equality
						e.type = 'panzoomend';
						self._trigger(e, matrix, !matrixEquals(matrix, original));
					});
			}
		};

		// Add Panzoom as a static property
		$.Panzoom = Panzoom;

		/**
		 * Extend jQuery
		 * @param {Object|String} options - The name of a method to call on the prototype
		 *  or an object literal of options
		 * @returns {jQuery|Mixed} jQuery instance for regular chaining or the return value(s) of a panzoom method call
		 */
		$.fn.panzoom = function(options) {
			var instance, args, m, ret;

			// Call methods widget-style
			if (typeof options === 'string') {
				ret = [];
				args = slice.call(arguments, 1);
				this.each(function() {
					instance = $.data(this, datakey);

					if (!instance) {
						ret.push(undefined);

					// Ignore methods beginning with `_`
					} else if (options.charAt(0) !== '_' &&
						typeof (m = instance[ options ]) === 'function' &&
						// If nothing is returned, do not add to return values
						(m = m.apply(instance, args)) !== undefined) {

						ret.push(m);
					}
				});

				// Return an array of values for the jQuery instances
				// Or the value itself if there is only one
				// Or keep chaining
				return ret.length ?
					(ret.length === 1 ? ret[0] : ret) :
					this;
			}

			return this.each(function() { new Panzoom(this, options); });
		};

		return Panzoom;
	}));


/***/ },
/* 4 */
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var PLUGIN_KEY = 'cropit';

	exports.PLUGIN_KEY = PLUGIN_KEY;
	var CLASS_NAMES = {
	  PREVIEW: 'cropit-image-preview',
	  PREVIEW_CONTAINER: 'cropit-image-preview-container',
	  FILE_INPUT: 'cropit-image-input',
	  ZOOM_SLIDER: 'cropit-image-zoom-input',
	  IMAGE_BACKGROUND: 'cropit-image-background',
	  IMAGE_BACKGROUND_CONTAINER: 'cropit-image-background-container',
	  PREVIEW_HOVERED: 'cropit-preview-hovered',
	  DRAG_HOVERED: 'cropit-drag-hovered',
	  IMAGE_LOADING: 'cropit-image-loading',
	  IMAGE_LOADED: 'cropit-image-loaded',
	  DISABLED: 'cropit-disabled'
	};

	exports.CLASS_NAMES = CLASS_NAMES;
	var ERRORS = {
	  IMAGE_FAILED_TO_LOAD: { code: 0, message: 'Image failed to load.' },
	  SMALL_IMAGE: { code: 1, message: 'Image is too small.' }
	};

	exports.ERRORS = ERRORS;
	var eventName = function eventName(events) {
	  return events.map(function (e) {
	    return '' + e + '.cropit';
	  }).join(' ');
	};
	var EVENTS = {
	  PREVIEW: eventName(['mousedown', 'mouseup', 'mouseleave', 'touchstart', 'touchend', 'touchcancel', 'touchleave']),
	  PREVIEW_MOVE: eventName(['mousemove', 'touchmove']),
	  ZOOM_INPUT: eventName(['mousemove', 'touchmove', 'change'])
	};
	exports.EVENTS = EVENTS;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _constants = __webpack_require__(4);

	var options = {
	  elements: [{
	    name: '$preview',
	    description: 'The HTML element that displays image preview.',
	    defaultSelector: '.' + _constants.CLASS_NAMES.PREVIEW
	  }, {
	    name: '$fileInput',
	    description: 'File input element.',
	    defaultSelector: 'input.' + _constants.CLASS_NAMES.FILE_INPUT
	  }, {
	    name: '$zoomSlider',
	    description: 'Range input element that controls image zoom.',
	    defaultSelector: 'input.' + _constants.CLASS_NAMES.ZOOM_SLIDER
	  }, {
	    name: '$previewContainer',
	    description: 'Preview container. Only needed when `imageBackground` is true.',
	    defaultSelector: '.' + _constants.CLASS_NAMES.PREVIEW_CONTAINER
	  }].map(function (o) {
	    o.type = 'jQuery element';
	    o['default'] = '$imageCropper.find(\'' + o.defaultSelector + '\')';
	    return o;
	  }),

	  values: [{
	    name: 'width',
	    type: 'number',
	    description: 'Width of image preview in pixels. If set, it will override the CSS property.',
	    'default': null
	  }, {
	    name: 'height',
	    type: 'number',
	    description: 'Height of image preview in pixels. If set, it will override the CSS property.',
	    'default': null
	  }, {
	    name: 'imageBackground',
	    type: 'boolean',
	    description: 'Whether or not to display the background image beyond the preview area.',
	    'default': false
	  }, {
	    name: 'imageBackgroundBorderWidth',
	    type: 'array or number',
	    description: 'Width of background image border in pixels.\n        The four array elements specify the width of background image width on the top, right, bottom, left side respectively.\n        The background image beyond the width will be hidden.\n        If specified as a number, border with uniform width on all sides will be applied.',
	    'default': [0, 0, 0, 0]
	  }, {
	    name: 'exportZoom',
	    type: 'number',
	    description: 'The ratio between the desired image size to export and the preview size.\n        For example, if the preview size is `300px * 200px`, and `exportZoom = 2`, then\n        the exported image size will be `600px * 400px`.\n        This also affects the maximum zoom level, since the exported image cannot be zoomed to larger than its original size.',
	    'default': 1
	  }, {
	    name: 'allowDragNDrop',
	    type: 'boolean',
	    description: 'When set to true, you can load an image by dragging it from local file browser onto the preview area.',
	    'default': true
	  }, {
	    name: 'minZoom',
	    type: 'string',
	    description: 'This options decides the minimal zoom level of the image.\n        If set to `\'fill\'`, the image has to fill the preview area, i.e. both width and height must not go smaller than the preview area.\n        If set to `\'fit\'`, the image can shrink further to fit the preview area, i.e. at least one of its edges must not go smaller than the preview area.',
	    'default': 'fill'
	  }, {
	    name: 'maxZoom',
	    type: 'number',
	    description: 'Determines how big the image can be zoomed. E.g. if set to 1.5, the image can be zoomed to 150% of its original size.',
	    'default': 1
	  }, {
	    name: 'initialZoom',
	    type: 'string',
	    description: 'Determines the zoom when an image is loaded.\n        When set to `\'min\'`, image is zoomed to the smallest when loaded.\n        When set to `\'image\'`, image is zoomed to 100% when loaded.',
	    'default': 'min'
	  }, {
	    name: 'freeMove',
	    type: 'boolean',
	    description: 'When set to true, you can freely move the image instead of being bound to the container borders',
	    'default': false
	  }, {
	    name: 'smallImage',
	    type: 'string',
	    description: 'When set to `\'reject\'`, `onImageError` would be called when cropit loads an image that is smaller than the container.\n        When set to `\'allow\'`, images smaller than the container can be zoomed down to its original size, overiding `minZoom` option.\n        When set to `\'stretch\'`, the minimum zoom of small images would follow `minZoom` option.',
	    'default': 'reject'
	  }, {
	    name: 'allowCrossOrigin',
	    type: 'boolean',
	    description: 'Set to true if you need to crop image served from other domains.',
	    'default': false
	  }],

	  callbacks: [{
	    name: 'onFileChange',
	    description: 'Called when user selects a file in the select file input.',
	    params: [{
	      name: 'event',
	      type: 'object',
	      description: 'File change event object'
	    }]
	  }, {
	    name: 'onFileReaderError',
	    description: 'Called when `FileReader` encounters an error while loading the image file.'
	  }, {
	    name: 'onImageLoading',
	    description: 'Called when image starts to be loaded.'
	  }, {
	    name: 'onImageLoaded',
	    description: 'Called when image is loaded.'
	  }, {
	    name: 'onImageError',
	    description: 'Called when image cannot be loaded.',
	    params: [{
	      name: 'error',
	      type: 'object',
	      description: 'Error object.'
	    }, {
	      name: 'error.code',
	      type: 'number',
	      description: 'Error code. `0` means generic image loading failure. `1` means image is too small.'
	    }, {
	      name: 'error.message',
	      type: 'string',
	      description: 'A message explaining the error.'
	    }]
	  }, {
	    name: 'onZoomEnabled',
	    description: 'Called when image the zoom slider is enabled.'
	  }, {
	    name: 'onZoomDisabled',
	    description: 'Called when image the zoom slider is disabled.'
	  }, {
	    name: 'onZoomChange',
	    description: 'Called when zoom changes.',
	    params: [{
	      name: 'zoom',
	      type: 'number',
	      description: 'New zoom.'
	    }]
	  }, {
	    name: 'onOffsetChange',
	    description: 'Called when image offset changes.',
	    params: [{
	      name: 'offset',
	      type: 'object',
	      description: 'New offset, with `x` and `y` values.'
	    }]
	  }].map(function (o) {
	    o.type = 'function';return o;
	  })
	};

	var loadDefaults = function loadDefaults($el) {
	  var defaults = {};
	  if ($el) {
	    options.elements.forEach(function (o) {
	      defaults[o.name] = $el.find(o.defaultSelector);
	    });
	  }
	  options.values.forEach(function (o) {
	    defaults[o.name] = o['default'];
	  });
	  options.callbacks.forEach(function (o) {
	    defaults[o.name] = function () {};
	  });

	  return defaults;
	};

	exports.loadDefaults = loadDefaults;
	exports['default'] = options;

/***/ },
/* 6 */
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var exists = function exists(v) {
	  return typeof v !== 'undefined';
	};

	exports.exists = exists;
	var round = function round(x) {
	  return +(Math.round(x * 100) + 'e-2');
	};

	exports.round = round;
	var capitalize = function capitalize(s) {
	  return s.charAt(0).toUpperCase() + s.slice(1);
	};
	exports.capitalize = capitalize;

/***/ }
/******/ ])
});
;