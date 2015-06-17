(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jQuery"));
	else if(typeof define === 'function' && define.amd)
		define(["jQuery"], factory);
	else if(typeof exports === 'object')
		exports["cropit"] = factory(require("jQuery"));
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

	var _utils = __webpack_require__(5);

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

	  imageSrc: function imageSrc(newImageSrc) {
	    if ((0, _utils.exists)(newImageSrc)) {
	      return applyOnEach(this, function (cropit) {
	        cropit.loadImage(newImageSrc);
	      });
	    } else {
	      return callOnFirst(this, 'getImageSrc');
	    }
	  },

	  offset: function offset(newOffset) {
	    if (newOffset && (0, _utils.exists)(newOffset.x) && (0, _utils.exists)(newOffset.y)) {
	      return applyOnEach(this, function (cropit) {
	        cropit.setOffset(newOffset);
	      });
	    } else {
	      return callOnFirst(this, 'getOffset');
	    }
	  },

	  zoom: function zoom(newZoom) {
	    if ((0, _utils.exists)(newZoom)) {
	      return applyOnEach(this, function (cropit) {
	        cropit.setZoom(newZoom);
	      });
	    } else {
	      return callOnFirst(this, 'getZoom');
	    }
	  },

	  imageSize: function imageSize() {
	    return callOnFirst(this, 'getImageSize');
	  },

	  previewSize: function previewSize(newSize) {
	    if (newSize) {
	      return applyOnEach(this, function (cropit) {
	        cropit.setPreviewSize(newSize);
	      });
	    } else {
	      return callOnFirst(this, 'getPreviewSize');
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

	var _Zoomer = __webpack_require__(3);

	var _Zoomer2 = _interopRequireDefault(_Zoomer);

	var _constants = __webpack_require__(4);

	var _utils = __webpack_require__(5);

	var Cropit = (function () {
	  function Cropit(jQuery, element, options) {
	    _classCallCheck(this, Cropit);

	    this.$el = (0, _jquery2['default'])(element);

	    var dynamicDefaults = {
	      $fileInput: this.$('input.cropit-image-input'),
	      $preview: this.$('.cropit-image-preview'),
	      $zoomSlider: this.$('input.cropit-image-zoom-input'),
	      $previewContainer: this.$('.cropit-image-preview-container')
	    };

	    this.options = _jquery2['default'].extend({}, _constants.DEFAULTS, dynamicDefaults, options);
	    this.init();
	  }

	  _createClass(Cropit, [{
	    key: 'init',
	    value: function init() {
	      var _this = this;

	      this.image = new Image();

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

	      if (this.options.imageBackground) {
	        if (_jquery2['default'].isArray(this.options.imageBackgroundBorderWidth)) {
	          this.imageBgBorderWidthArray = this.options.imageBackgroundBorderWidth;
	        } else {
	          this.imageBgBorderWidthArray = [];
	          [0, 1, 2, 3].forEach(function (i) {
	            _this.imageBgBorderWidthArray[i] = _this.options.imageBackgroundBorderWidth;
	          });
	        }

	        var $previewContainer = this.options.$previewContainer;
	        this.$imageBg = (0, _jquery2['default'])('<img />').addClass('cropit-image-background').attr('alt', '').css('position', 'absolute');
	        this.$imageBgContainer = (0, _jquery2['default'])('<div />').addClass('cropit-image-background-container').css({
	          position: 'absolute',
	          zIndex: 0,
	          left: -this.imageBgBorderWidthArray[3] + window.parseInt(this.$preview.css('border-left-width') || 0),
	          top: -this.imageBgBorderWidthArray[0] + window.parseInt(this.$preview.css('border-top-width') || 0),
	          width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
	          height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2]
	        }).append(this.$imageBg);
	        if (this.imageBgBorderWidthArray[0] > 0) {
	          this.$imageBgContainer.css('overflow', 'hidden');
	        }
	        $previewContainer.css('position', 'relative').prepend(this.$imageBgContainer);
	        this.$preview.css('position', 'relative');

	        this.$preview.hover(function () {
	          _this.$imageBg.addClass('cropit-preview-hovered');
	        }, function () {
	          _this.$imageBg.removeClass('cropit-preview-hovered');
	        });
	      }

	      this.initialZoom = 0;
	      this.imageLoaded = false;

	      this.moveContinue = false;

	      this.zoomer = new _Zoomer2['default']();

	      if (this.options.allowDragNDrop) {
	        _jquery2['default'].event.props.push('dataTransfer');
	      }

	      this.bindListeners();

	      if (this.options.imageState && this.options.imageState.src) {
	        this.loadImage(this.options.imageState.src);
	      }
	    }
	  }, {
	    key: 'bindListeners',
	    value: function bindListeners() {
	      this.$fileInput.on('change.cropit', this.onFileChange.bind(this));
	      this.$preview.on(_constants.EVENTS.PREVIEW, this.onPreviewEvent.bind(this));
	      this.$zoomSlider.on(_constants.EVENTS.ZOOM_INPUT, this.onZoomSliderChange.bind(this));

	      if (this.options.allowDragNDrop) {
	        this.$preview.on('dragover.cropit dragleave.cropit', this.onDragOver.bind(this));
	        this.$preview.on('drop.cropit', this.onDrop.bind(this));
	      }
	    }
	  }, {
	    key: 'unbindListeners',
	    value: function unbindListeners() {
	      this.$fileInput.off('change.cropit');
	      this.$preview.off(_constants.EVENTS.PREVIEW);
	      this.$preview.off('dragover.cropit dragleave.cropit drop.cropit');
	      this.$zoomSlider.off(_constants.EVENTS.ZOOM_INPUT);
	    }
	  }, {
	    key: 'onFileChange',
	    value: function onFileChange() {
	      if (this.options.onFileChange) {
	        this.options.onFileChange();
	      }

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
	      if (this.options.onFileReaderError) {
	        this.options.onFileReaderError();
	      }
	    }
	  }, {
	    key: 'onDragOver',
	    value: function onDragOver(e) {
	      e.preventDefault();
	      e.dataTransfer.dropEffect = 'copy';
	      this.$preview.toggleClass('cropit-drag-hovered', e.type === 'dragover');
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

	      this.$preview.removeClass('cropit-drag-hovered');
	    }
	  }, {
	    key: 'loadImage',
	    value: function loadImage(imageSrc) {
	      var _this3 = this;

	      this.imageSrc = imageSrc;
	      if (!this.imageSrc) {
	        return;
	      }

	      if (this.options.onImageLoading) {
	        this.options.onImageLoading();
	      }
	      this.setImageLoadingClass();

	      this.image.onload = this.onImageLoaded.bind(this);
	      this.image.onerror = function () {
	        _this3.onImageError.call(_this3, _constants.ERRORS.IMAGE_FAILED_TO_LOAD);
	      };

	      this.image.src = this.imageSrc;
	    }
	  }, {
	    key: 'onImageLoaded',
	    value: function onImageLoaded() {
	      this.imageSize = {
	        w: this.image.width,
	        h: this.image.height
	      };

	      this.setupZoomer(this.options.imageState && this.options.imageState.zoom || this.initialZoom);
	      if (this.options.imageState && this.options.imageState.offset) {
	        this.setOffset(this.options.imageState.offset);
	      } else {
	        this.setOffset({ x: 0, y: 0 });
	      }

	      this.options.imageState = {};

	      this.$preview.css('background-image', 'url(' + this.imageSrc + ')');
	      if (this.options.imageBackground) {
	        this.$imageBg.attr('src', this.imageSrc);
	      }

	      if (this.options.rejectSmallImage && (this.imageSize.w * this.options.maxZoom < this.previewSize.w * this.options.exportZoom || this.imageSize.h * this.options.maxZoom < this.previewSize.h * this.options.exportZoom)) {
	        this.onImageError(_constants.ERRORS.SMALL_IMAGE);
	        return;
	      }

	      this.setImageLoadedClass();

	      this.imageLoaded = true;

	      if (this.options.onImageLoaded) {
	        this.options.onImageLoaded();
	      }
	    }
	  }, {
	    key: 'onImageError',
	    value: function onImageError() {
	      if (this.options.onImageError) {
	        this.options.onImageError.apply(this, arguments);
	      }
	      this.removeImageLoadingClass();
	    }
	  }, {
	    key: 'setImageLoadingClass',
	    value: function setImageLoadingClass() {
	      this.$preview.removeClass('cropit-image-loaded').addClass('cropit-image-loading');
	    }
	  }, {
	    key: 'setImageLoadedClass',
	    value: function setImageLoadedClass() {
	      this.$preview.removeClass('cropit-image-loading').addClass('cropit-image-loaded');
	    }
	  }, {
	    key: 'removeImageLoadingClass',
	    value: function removeImageLoadingClass() {
	      this.$preview.removeClass('cropit-image-loading');
	    }
	  }, {
	    key: 'getEventPosition',
	    value: function getEventPosition(e) {
	      if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0]) {
	        e = e.originalEvent.touches[0];
	      }
	      if (e.clientX && e.clientY) {
	        return { x: e.clientX, y: e.clientY };
	      }
	    }
	  }, {
	    key: 'onPreviewEvent',
	    value: function onPreviewEvent(e) {
	      if (!this.imageLoaded) {
	        return;
	      }

	      this.moveContinue = false;
	      this.$preview.off(_constants.EVENTS.PREVIEW_MOVE);

	      if (e.type === 'mousedown' || e.type === 'touchstart') {
	        this.origin = this.getEventPosition(e);
	        this.moveContinue = true;
	        this.$preview.on(_constants.EVENTS.PREVIEW_MOVE, this.onMove.bind(this));
	      } else {
	        (0, _jquery2['default'])(document.body).focus();
	      }

	      e.stopPropagation();
	      return false;
	    }
	  }, {
	    key: 'onMove',
	    value: function onMove(e) {
	      var eventPosition = this.getEventPosition(e);

	      if (this.moveContinue && eventPosition) {
	        this.setOffset({
	          x: this.offset.x + eventPosition.x - this.origin.x,
	          y: this.offset.y + eventPosition.y - this.origin.y
	        });
	      }

	      this.origin = eventPosition;

	      e.stopPropagation();
	      return false;
	    }
	  }, {
	    key: 'setOffset',
	    value: function setOffset(position) {
	      this.offset = this.fixOffset(position);
	      this.$preview.css('background-position', '' + this.offset.x + 'px ' + this.offset.y + 'px');
	      if (this.options.imageBackground) {
	        this.$imageBg.css({
	          left: this.offset.x + this.imageBgBorderWidthArray[3],
	          top: this.offset.y + this.imageBgBorderWidthArray[0]
	        });
	      }
	    }
	  }, {
	    key: 'fixOffset',
	    value: function fixOffset(offset) {
	      if (!this.imageLoaded) {
	        return offset;
	      }

	      var ret = { x: offset.x, y: offset.y };

	      if (!this.options.freeMove) {
	        if (this.imageSize.w * this.zoom >= this.previewSize.w) {
	          ret.x = Math.min(0, Math.max(ret.x, this.previewSize.w - this.imageSize.w * this.zoom));
	        } else {
	          ret.x = Math.max(0, Math.min(ret.x, this.previewSize.w - this.imageSize.w * this.zoom));
	        }

	        if (this.imageSize.h * this.zoom >= this.previewSize.h) {
	          ret.y = Math.min(0, Math.max(ret.y, this.previewSize.h - this.imageSize.h * this.zoom));
	        } else {
	          ret.y = Math.max(0, Math.min(ret.y, this.previewSize.h - this.imageSize.h * this.zoom));
	        }
	      }

	      ret.x = this.round(ret.x);
	      ret.y = this.round(ret.y);

	      return ret;
	    }
	  }, {
	    key: 'centerImage',
	    value: function centerImage() {
	      if (!this.imageLoaded) {
	        return;
	      }

	      this.setOffset({
	        x: (this.previewSize.w - this.imageSize.w * this.zoom) / 2,
	        y: (this.previewSize.h - this.imageSize.h * this.zoom) / 2
	      });
	    }
	  }, {
	    key: 'onZoomSliderChange',
	    value: function onZoomSliderChange() {
	      if (!this.imageLoaded) {
	        return;
	      }

	      this.zoomSliderPos = Number(this.$zoomSlider.val());
	      var newZoom = this.zoomer.getZoom(this.zoomSliderPos);
	      this.setZoom(newZoom);
	    }
	  }, {
	    key: 'enableZoomSlider',
	    value: function enableZoomSlider() {
	      this.$zoomSlider.removeAttr('disabled');
	      if (this.options.onZoomEnabled) {
	        this.options.onZoomEnabled();
	      }
	    }
	  }, {
	    key: 'disableZoomSlider',
	    value: function disableZoomSlider() {
	      this.$zoomSlider.attr('disabled', true);
	      if (this.options.onZoomDisabled) {
	        this.options.onZoomDisabled();
	      }
	    }
	  }, {
	    key: 'setupZoomer',
	    value: function setupZoomer(zoom) {
	      this.zoomer.setup({
	        imageSize: this.imageSize,
	        previewSize: this.previewSize,
	        exportZoom: this.options.exportZoom,
	        maxZoom: this.options.maxZoom,
	        minZoom: this.options.minZoom
	      });
	      this.setZoom((0, _utils.exists)(zoom) ? zoom : this.zoom);

	      if (this.isZoomable()) {
	        this.enableZoomSlider();
	      } else {
	        this.disableZoomSlider();
	      }
	    }
	  }, {
	    key: 'setZoom',
	    value: function setZoom(newZoom) {
	      newZoom = this.fixZoom(newZoom);

	      var updatedWidth = this.round(this.imageSize.w * newZoom);
	      var updatedHeight = this.round(this.imageSize.h * newZoom);

	      if (this.imageLoaded) {
	        var oldZoom = this.zoom;

	        var newX = this.previewSize.w / 2 - (this.previewSize.w / 2 - this.offset.x) * newZoom / oldZoom;
	        var newY = this.previewSize.h / 2 - (this.previewSize.h / 2 - this.offset.y) * newZoom / oldZoom;

	        this.zoom = newZoom;
	        this.setOffset({ x: newX, y: newY });
	      } else {
	        this.zoom = newZoom;
	      }

	      this.zoomSliderPos = this.zoomer.getSliderPos(this.zoom);
	      this.$zoomSlider.val(this.zoomSliderPos);

	      this.$preview.css('background-size', '' + updatedWidth + 'px ' + updatedHeight + 'px');
	      if (this.options.imageBackground) {
	        this.$imageBg.css({
	          width: updatedWidth,
	          height: updatedHeight
	        });
	      }
	    }
	  }, {
	    key: 'fixZoom',
	    value: function fixZoom(zoom) {
	      return this.zoomer.fixZoom(zoom);
	    }
	  }, {
	    key: 'isZoomable',
	    value: function isZoomable() {
	      return this.zoomer.isZoomable();
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

	      var croppedSize = {
	        w: this.previewSize.w,
	        h: this.previewSize.h
	      };

	      var exportZoom = exportOptions.originalSize ? 1 / this.zoom : this.options.exportZoom;

	      var canvas = (0, _jquery2['default'])('<canvas />').attr({
	        width: croppedSize.w * exportZoom,
	        height: croppedSize.h * exportZoom
	      }).get(0);
	      var canvasContext = canvas.getContext('2d');

	      if (exportOptions.type === 'image/jpeg') {
	        canvasContext.fillStyle = exportOptions.fillBg;
	        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	      }

	      canvasContext.drawImage(this.image, this.offset.x * exportZoom, this.offset.y * exportZoom, this.zoom * exportZoom * this.imageSize.w, this.zoom * exportZoom * this.imageSize.h);

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
	      if (!size || size.width <= 0 || size.height <= 0) {}

	      this.previewSize = {
	        w: size.width,
	        h: size.height
	      };
	      this.$preview.css({
	        width: this.previewSize.w,
	        height: this.previewSize.h
	      });

	      if (this.options.imageBackground) {
	        this.$imageBgContainer.css({
	          width: this.previewSize.w + this.imageBgBorderWidthArray[1] + this.imageBgBorderWidthArray[3],
	          height: this.previewSize.h + this.imageBgBorderWidthArray[0] + this.imageBgBorderWidthArray[2]
	        });
	      }

	      if (this.imageLoaded) {
	        this.setupZoomer();
	      }
	    }
	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.unbindListeners();
	      this.disableZoomSlider();
	      this.$el.addClass('cropit-disabled');
	    }
	  }, {
	    key: 'reenable',
	    value: function reenable() {
	      this.bindListeners();
	      this.enableZoomSlider();
	      this.$el.removeClass('cropit-disabled');
	    }
	  }, {
	    key: 'round',
	    value: function round(x) {
	      return +(Math.round(x * 100) + 'e-2');
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
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Zoomer = (function () {
	  function Zoomer() {
	    _classCallCheck(this, Zoomer);

	    this.minZoom = this.maxZoom = 1;
	  }

	  _createClass(Zoomer, [{
	    key: 'setup',
	    value: function setup(_ref) {
	      var imageSize = _ref.imageSize;
	      var previewSize = _ref.previewSize;
	      var _ref$exportZoom = _ref.exportZoom;
	      var exportZoom = _ref$exportZoom === undefined ? 1 : _ref$exportZoom;
	      var _ref$maxZoom = _ref.maxZoom;
	      var maxZoom = _ref$maxZoom === undefined ? 1 : _ref$maxZoom;
	      var _ref$minZoom = _ref.minZoom;
	      var minZoom = _ref$minZoom === undefined ? 'fill' : _ref$minZoom;

	      var widthRatio = previewSize.w / imageSize.w;
	      var heightRatio = previewSize.h / imageSize.h;

	      if (minZoom === 'fit') {
	        this.minZoom = Math.min(widthRatio, heightRatio);
	      } else {
	        this.minZoom = Math.max(widthRatio, heightRatio);
	      }

	      this.maxZoom = Math.max(this.minZoom, maxZoom / exportZoom);
	    }
	  }, {
	    key: 'getZoom',
	    value: function getZoom(sliderPos) {
	      if (!this.minZoom || !this.maxZoom) {
	        return null;
	      }

	      return sliderPos * (this.maxZoom - this.minZoom) + this.minZoom;
	    }
	  }, {
	    key: 'getSliderPos',
	    value: function getSliderPos(zoom) {
	      if (!this.minZoom || !this.maxZoom) {
	        return null;
	      }

	      if (this.minZoom === this.maxZoom) {
	        return 0;
	      } else {
	        return (zoom - this.minZoom) / (this.maxZoom - this.minZoom);
	      }
	    }
	  }, {
	    key: 'isZoomable',
	    value: function isZoomable() {
	      if (!this.minZoom || !this.maxZoom) {
	        return null;
	      }

	      return this.minZoom !== this.maxZoom;
	    }
	  }, {
	    key: 'fixZoom',
	    value: function fixZoom(zoom) {
	      return Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
	    }
	  }]);

	  return Zoomer;
	})();

	exports['default'] = Zoomer;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var PLUGIN_KEY = 'cropit';

	exports.PLUGIN_KEY = PLUGIN_KEY;
	var DEFAULTS = {
	  exportZoom: 1,
	  imageBackground: false,
	  imageBackgroundBorderWidth: 0,
	  imageState: null,
	  allowDragNDrop: true,
	  freeMove: false,
	  minZoom: 'fill',
	  maxZoom: 1,
	  rejectSmallImage: false
	};

	exports.DEFAULTS = DEFAULTS;
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
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var exists = function exists(v) {
	  return typeof v !== 'undefined';
	};
	exports.exists = exists;

/***/ }
/******/ ])
});
;