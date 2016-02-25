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

	var _constants = __webpack_require__(3);

	var _utils = __webpack_require__(7);

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

	__webpack_require__(4);

	var _Zoomer = __webpack_require__(5);

	var _Zoomer2 = _interopRequireDefault(_Zoomer);

	var _constants = __webpack_require__(3);

	var _options = __webpack_require__(6);

	var _utils = __webpack_require__(7);

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
	        this.$imageBg = (0, _jquery2['default'])('<img />').addClass(_constants.CLASS_NAMES.IMAGE_BACKGROUND).attr('alt', '').css('position', 'absolute');
	        this.$imageBgContainer = (0, _jquery2['default'])('<div />').addClass(_constants.CLASS_NAMES.IMAGE_BACKGROUND_CONTAINER).css({
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
	          _this.$imageBg.addClass(_constants.CLASS_NAMES.PREVIEW_HOVERED);
	        }, function () {
	          _this.$imageBg.removeClass(_constants.CLASS_NAMES.PREVIEW_HOVERED);
	        });
	      }

	      this.setInitialZoom(this.options.initialZoom);

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

	      function _base64ToArrayBuffer(base64) {
	        var binary_string = window.atob(base64.split(',')[1]);
	        var len = binary_string.length;
	        var bytes = new Uint8Array(len);
	        for (var i = 0; i < len; i++) {
	          bytes[i] = binary_string.charCodeAt(i);
	        }
	        return bytes.buffer;
	      }

	      var exif = EXIF.readFromBinaryFile(_base64ToArrayBuffer(this.preImage.src));

	      var canvas = document.createElement('canvas');
	      canvas.width = this.preImage.width;
	      canvas.height = this.preImage.height;
	      var ctx = canvas.getContext('2d');
	      var x = 0;
	      var y = 0;
	      ctx.save();

	      if (exif.Oriendation != 'undefined') {

	        switch (exif.Orientation) {
	          case 2:
	            // horizontal flip
	            ctx.translate(canvas.width, 0);
	            ctx.scale(-1, 1);
	            break;
	          case 3:
	            // 180° rotate left
	            ctx.translate(canvas.width, canvas.height);
	            ctx.rotate(Math.PI);
	            break;
	          case 4:
	            // vertical flip
	            ctx.translate(0, canvas.height);
	            ctx.scale(1, -1);
	            break;
	          case 5:
	            // vertical flip + 90 rotate right
	            ctx.rotate(0.5 * Math.PI);
	            ctx.scale(1, -1);
	            break;
	          case 6:
	            // 90° rotate right
	            ctx.rotate(0.5 * Math.PI);
	            ctx.translate(0, -canvas.height);
	            break;
	          case 7:
	            // horizontal flip + 90 rotate right
	            ctx.rotate(0.5 * Math.PI);
	            ctx.translate(canvas.width, -canvas.height);
	            ctx.scale(-1, 1);
	            break;
	          case 8:
	            // 90° rotate left
	            ctx.rotate(-0.5 * Math.PI);
	            ctx.translate(-canvas.width, 0);
	            break;
	        }

	        ctx.drawImage(this.preImage, x, y);
	        ctx.restore();
	        var finalImage = canvas.toDataURL('image/*', 1);

	        this.image.src = this.imageSrc = finalImage;
	      } else {
	        this.image.src = this.imageSrc = this.preImage.src;
	      }
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
	        this.centerImage();
	      }

	      this.options.imageState = {};

	      this.$preview.css('background-image', 'url(' + this.imageSrc + ')');
	      if (this.options.imageBackground) {
	        this.$imageBg.attr('src', this.imageSrc);
	      }

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
	      if (!position || !(0, _utils.exists)(position.x) || !(0, _utils.exists)(position.y)) {
	        return;
	      }

	      this.offset = this.fixOffset(position);
	      this.$preview.css('background-position', '' + this.offset.x + 'px ' + this.offset.y + 'px');
	      if (this.options.imageBackground) {
	        this.$imageBg.css({
	          left: this.offset.x + this.imageBgBorderWidthArray[3],
	          top: this.offset.y + this.imageBgBorderWidthArray[0]
	        });
	      }

	      this.options.onOffsetChange(position);
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

	      ret.x = (0, _utils.round)(ret.x);
	      ret.y = (0, _utils.round)(ret.y);

	      return ret;
	    }
	  }, {
	    key: 'centerImage',
	    value: function centerImage() {
	      if (!this.imageSize || !this.zoom) {
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
	      if (newZoom === this.zoom) {
	        return;
	      }
	      this.setZoom(newZoom);
	    }
	  }, {
	    key: 'enableZoomSlider',
	    value: function enableZoomSlider() {
	      this.$zoomSlider.removeAttr('disabled');
	      this.options.onZoomEnabled();
	    }
	  }, {
	    key: 'disableZoomSlider',
	    value: function disableZoomSlider() {
	      this.$zoomSlider.attr('disabled', true);
	      this.options.onZoomDisabled();
	    }
	  }, {
	    key: 'setupZoomer',
	    value: function setupZoomer(zoom) {
	      this.zoomer.setup({
	        imageSize: this.imageSize,
	        previewSize: this.previewSize,
	        exportZoom: this.options.exportZoom,
	        maxZoom: this.options.maxZoom,
	        minZoom: this.options.minZoom,
	        smallImage: this.options.smallImage
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

	      var updatedWidth = (0, _utils.round)(this.imageSize.w * newZoom);
	      var updatedHeight = (0, _utils.round)(this.imageSize.h * newZoom);

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

	      this.options.onZoomChange(newZoom);
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

	      var exportZoom = exportOptions.originalSize ? 1 / this.zoom : this.options.exportZoom;

	      var zoomedSize = {
	        w: this.zoom * exportZoom * this.imageSize.w,
	        h: this.zoom * exportZoom * this.imageSize.h
	      };

	      var canvas = (0, _jquery2['default'])('<canvas />').attr({
	        width: this.previewSize.w * exportZoom,
	        height: this.previewSize.h * exportZoom
	      }).get(0);
	      var canvasContext = canvas.getContext('2d');

	      if (exportOptions.type === 'image/jpeg') {
	        canvasContext.fillStyle = exportOptions.fillBg;
	        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	      }

	      canvasContext.drawImage(this.image, this.offset.x * exportZoom, this.offset.y * exportZoom, zoomedSize.w, zoomedSize.h);

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
	      this.setupZoomer();
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
	      this.setupZoomer();
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
	      this.setupZoomer();
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
	      this.$el.addClass(_constants.CLASS_NAMES.DISABLED);
	    }
	  }, {
	    key: 'reenable',
	    value: function reenable() {
	      this.bindListeners();
	      this.enableZoomSlider();
	      this.$el.removeClass(_constants.CLASS_NAMES.DISABLED);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {

	    var debug = false;

	    var root = this;

	    var EXIF = function(obj) {
	        if (obj instanceof EXIF) return obj;
	        if (!(this instanceof EXIF)) return new EXIF(obj);
	        this.EXIFwrapped = obj;
	    };

	    if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = EXIF;
	        }
	        exports.EXIF = EXIF;
	    } else {
	        root.EXIF = EXIF;
	    }

	    var ExifTags = EXIF.Tags = {

	        // version tags
	        0x9000 : "ExifVersion",             // EXIF version
	        0xA000 : "FlashpixVersion",         // Flashpix format version

	        // colorspace tags
	        0xA001 : "ColorSpace",              // Color space information tag

	        // image configuration
	        0xA002 : "PixelXDimension",         // Valid width of meaningful image
	        0xA003 : "PixelYDimension",         // Valid height of meaningful image
	        0x9101 : "ComponentsConfiguration", // Information about channels
	        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

	        // user information
	        0x927C : "MakerNote",               // Any desired information written by the manufacturer
	        0x9286 : "UserComment",             // Comments by user

	        // related file
	        0xA004 : "RelatedSoundFile",        // Name of related sound file

	        // date and time
	        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
	        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
	        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
	        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
	        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

	        // picture-taking conditions
	        0x829A : "ExposureTime",            // Exposure time (in seconds)
	        0x829D : "FNumber",                 // F number
	        0x8822 : "ExposureProgram",         // Exposure program
	        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
	        0x8827 : "ISOSpeedRatings",         // ISO speed rating
	        0x8828 : "OECF",                    // Optoelectric conversion factor
	        0x9201 : "ShutterSpeedValue",       // Shutter speed
	        0x9202 : "ApertureValue",           // Lens aperture
	        0x9203 : "BrightnessValue",         // Value of brightness
	        0x9204 : "ExposureBias",            // Exposure bias
	        0x9205 : "MaxApertureValue",        // Smallest F number of lens
	        0x9206 : "SubjectDistance",         // Distance to subject in meters
	        0x9207 : "MeteringMode",            // Metering mode
	        0x9208 : "LightSource",             // Kind of light source
	        0x9209 : "Flash",                   // Flash status
	        0x9214 : "SubjectArea",             // Location and area of main subject
	        0x920A : "FocalLength",             // Focal length of the lens in mm
	        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
	        0xA20C : "SpatialFrequencyResponse",    //
	        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
	        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
	        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
	        0xA214 : "SubjectLocation",         // Location of subject in image
	        0xA215 : "ExposureIndex",           // Exposure index selected on camera
	        0xA217 : "SensingMethod",           // Image sensor type
	        0xA300 : "FileSource",              // Image source (3 == DSC)
	        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
	        0xA302 : "CFAPattern",              // Color filter array geometric pattern
	        0xA401 : "CustomRendered",          // Special processing
	        0xA402 : "ExposureMode",            // Exposure mode
	        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
	        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
	        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
	        0xA406 : "SceneCaptureType",        // Type of scene
	        0xA407 : "GainControl",             // Degree of overall image gain adjustment
	        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
	        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
	        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
	        0xA40B : "DeviceSettingDescription",    //
	        0xA40C : "SubjectDistanceRange",    // Distance to subject

	        // other tags
	        0xA005 : "InteroperabilityIFDPointer",
	        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
	    };

	    var TiffTags = EXIF.TiffTags = {
	        0x0100 : "ImageWidth",
	        0x0101 : "ImageHeight",
	        0x8769 : "ExifIFDPointer",
	        0x8825 : "GPSInfoIFDPointer",
	        0xA005 : "InteroperabilityIFDPointer",
	        0x0102 : "BitsPerSample",
	        0x0103 : "Compression",
	        0x0106 : "PhotometricInterpretation",
	        0x0112 : "Orientation",
	        0x0115 : "SamplesPerPixel",
	        0x011C : "PlanarConfiguration",
	        0x0212 : "YCbCrSubSampling",
	        0x0213 : "YCbCrPositioning",
	        0x011A : "XResolution",
	        0x011B : "YResolution",
	        0x0128 : "ResolutionUnit",
	        0x0111 : "StripOffsets",
	        0x0116 : "RowsPerStrip",
	        0x0117 : "StripByteCounts",
	        0x0201 : "JPEGInterchangeFormat",
	        0x0202 : "JPEGInterchangeFormatLength",
	        0x012D : "TransferFunction",
	        0x013E : "WhitePoint",
	        0x013F : "PrimaryChromaticities",
	        0x0211 : "YCbCrCoefficients",
	        0x0214 : "ReferenceBlackWhite",
	        0x0132 : "DateTime",
	        0x010E : "ImageDescription",
	        0x010F : "Make",
	        0x0110 : "Model",
	        0x0131 : "Software",
	        0x013B : "Artist",
	        0x8298 : "Copyright"
	    };

	    var GPSTags = EXIF.GPSTags = {
	        0x0000 : "GPSVersionID",
	        0x0001 : "GPSLatitudeRef",
	        0x0002 : "GPSLatitude",
	        0x0003 : "GPSLongitudeRef",
	        0x0004 : "GPSLongitude",
	        0x0005 : "GPSAltitudeRef",
	        0x0006 : "GPSAltitude",
	        0x0007 : "GPSTimeStamp",
	        0x0008 : "GPSSatellites",
	        0x0009 : "GPSStatus",
	        0x000A : "GPSMeasureMode",
	        0x000B : "GPSDOP",
	        0x000C : "GPSSpeedRef",
	        0x000D : "GPSSpeed",
	        0x000E : "GPSTrackRef",
	        0x000F : "GPSTrack",
	        0x0010 : "GPSImgDirectionRef",
	        0x0011 : "GPSImgDirection",
	        0x0012 : "GPSMapDatum",
	        0x0013 : "GPSDestLatitudeRef",
	        0x0014 : "GPSDestLatitude",
	        0x0015 : "GPSDestLongitudeRef",
	        0x0016 : "GPSDestLongitude",
	        0x0017 : "GPSDestBearingRef",
	        0x0018 : "GPSDestBearing",
	        0x0019 : "GPSDestDistanceRef",
	        0x001A : "GPSDestDistance",
	        0x001B : "GPSProcessingMethod",
	        0x001C : "GPSAreaInformation",
	        0x001D : "GPSDateStamp",
	        0x001E : "GPSDifferential"
	    };

	    var StringValues = EXIF.StringValues = {
	        ExposureProgram : {
	            0 : "Not defined",
	            1 : "Manual",
	            2 : "Normal program",
	            3 : "Aperture priority",
	            4 : "Shutter priority",
	            5 : "Creative program",
	            6 : "Action program",
	            7 : "Portrait mode",
	            8 : "Landscape mode"
	        },
	        MeteringMode : {
	            0 : "Unknown",
	            1 : "Average",
	            2 : "CenterWeightedAverage",
	            3 : "Spot",
	            4 : "MultiSpot",
	            5 : "Pattern",
	            6 : "Partial",
	            255 : "Other"
	        },
	        LightSource : {
	            0 : "Unknown",
	            1 : "Daylight",
	            2 : "Fluorescent",
	            3 : "Tungsten (incandescent light)",
	            4 : "Flash",
	            9 : "Fine weather",
	            10 : "Cloudy weather",
	            11 : "Shade",
	            12 : "Daylight fluorescent (D 5700 - 7100K)",
	            13 : "Day white fluorescent (N 4600 - 5400K)",
	            14 : "Cool white fluorescent (W 3900 - 4500K)",
	            15 : "White fluorescent (WW 3200 - 3700K)",
	            17 : "Standard light A",
	            18 : "Standard light B",
	            19 : "Standard light C",
	            20 : "D55",
	            21 : "D65",
	            22 : "D75",
	            23 : "D50",
	            24 : "ISO studio tungsten",
	            255 : "Other"
	        },
	        Flash : {
	            0x0000 : "Flash did not fire",
	            0x0001 : "Flash fired",
	            0x0005 : "Strobe return light not detected",
	            0x0007 : "Strobe return light detected",
	            0x0009 : "Flash fired, compulsory flash mode",
	            0x000D : "Flash fired, compulsory flash mode, return light not detected",
	            0x000F : "Flash fired, compulsory flash mode, return light detected",
	            0x0010 : "Flash did not fire, compulsory flash mode",
	            0x0018 : "Flash did not fire, auto mode",
	            0x0019 : "Flash fired, auto mode",
	            0x001D : "Flash fired, auto mode, return light not detected",
	            0x001F : "Flash fired, auto mode, return light detected",
	            0x0020 : "No flash function",
	            0x0041 : "Flash fired, red-eye reduction mode",
	            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
	            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
	            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
	            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
	            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
	            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
	            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
	            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
	        },
	        SensingMethod : {
	            1 : "Not defined",
	            2 : "One-chip color area sensor",
	            3 : "Two-chip color area sensor",
	            4 : "Three-chip color area sensor",
	            5 : "Color sequential area sensor",
	            7 : "Trilinear sensor",
	            8 : "Color sequential linear sensor"
	        },
	        SceneCaptureType : {
	            0 : "Standard",
	            1 : "Landscape",
	            2 : "Portrait",
	            3 : "Night scene"
	        },
	        SceneType : {
	            1 : "Directly photographed"
	        },
	        CustomRendered : {
	            0 : "Normal process",
	            1 : "Custom process"
	        },
	        WhiteBalance : {
	            0 : "Auto white balance",
	            1 : "Manual white balance"
	        },
	        GainControl : {
	            0 : "None",
	            1 : "Low gain up",
	            2 : "High gain up",
	            3 : "Low gain down",
	            4 : "High gain down"
	        },
	        Contrast : {
	            0 : "Normal",
	            1 : "Soft",
	            2 : "Hard"
	        },
	        Saturation : {
	            0 : "Normal",
	            1 : "Low saturation",
	            2 : "High saturation"
	        },
	        Sharpness : {
	            0 : "Normal",
	            1 : "Soft",
	            2 : "Hard"
	        },
	        SubjectDistanceRange : {
	            0 : "Unknown",
	            1 : "Macro",
	            2 : "Close view",
	            3 : "Distant view"
	        },
	        FileSource : {
	            3 : "DSC"
	        },

	        Components : {
	            0 : "",
	            1 : "Y",
	            2 : "Cb",
	            3 : "Cr",
	            4 : "R",
	            5 : "G",
	            6 : "B"
	        }
	    };

	    function addEvent(element, event, handler) {
	        if (element.addEventListener) {
	            element.addEventListener(event, handler, false);
	        } else if (element.attachEvent) {
	            element.attachEvent("on" + event, handler);
	        }
	    }

	    function imageHasData(img) {
	        return !!(img.exifdata);
	    }


	    function base64ToArrayBuffer(base64, contentType) {
	        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
	        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
	        var binary = atob(base64);
	        var len = binary.length;
	        var buffer = new ArrayBuffer(len);
	        var view = new Uint8Array(buffer);
	        for (var i = 0; i < len; i++) {
	            view[i] = binary.charCodeAt(i);
	        }
	        return buffer;
	    }

	    function objectURLToBlob(url, callback) {
	        var http = new XMLHttpRequest();
	        http.open("GET", url, true);
	        http.responseType = "blob";
	        http.onload = function(e) {
	            if (this.status == 200 || this.status === 0) {
	                callback(this.response);
	            }
	        };
	        http.send();
	    }

	    function getImageData(img, callback) {
	        function handleBinaryFile(binFile) {
	            var data = findEXIFinJPEG(binFile);
	            var iptcdata = findIPTCinJPEG(binFile);
	            img.exifdata = data || {};
	            img.iptcdata = iptcdata || {};
	            if (callback) {
	                callback.call(img);
	            }
	        }

	        if (img.src) {
	            if (/^data\:/i.test(img.src)) { // Data URI
	                var arrayBuffer = base64ToArrayBuffer(img.src);
	                handleBinaryFile(arrayBuffer);

	            } else if (/^blob\:/i.test(img.src)) { // Object URL
	                var fileReader = new FileReader();
	                fileReader.onload = function(e) {
	                    handleBinaryFile(e.target.result);
	                };
	                objectURLToBlob(img.src, function (blob) {
	                    fileReader.readAsArrayBuffer(blob);
	                });
	            } else {
	                var http = new XMLHttpRequest();
	                http.onload = function() {
	                    if (this.status == 200 || this.status === 0) {
	                        handleBinaryFile(http.response);
	                    } else {
	                        throw "Could not load image";
	                    }
	                    http = null;
	                };
	                http.open("GET", img.src, true);
	                http.responseType = "arraybuffer";
	                http.send(null);
	            }
	        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
	            var fileReader = new FileReader();
	            fileReader.onload = function(e) {
	                if (debug) console.log("Got file of length " + e.target.result.byteLength);
	                handleBinaryFile(e.target.result);
	            };

	            fileReader.readAsArrayBuffer(img);
	        }
	    }

	    function findEXIFinJPEG(file) {
	        var dataView = new DataView(file);

	        if (debug) console.log("Got file of length " + file.byteLength);
	        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
	            if (debug) console.log("Not a valid JPEG");
	            return false; // not a valid jpeg
	        }

	        var offset = 2,
	            length = file.byteLength,
	            marker;

	        while (offset < length) {
	            if (dataView.getUint8(offset) != 0xFF) {
	                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
	                return false; // not a valid marker, something is wrong
	            }

	            marker = dataView.getUint8(offset + 1);
	            if (debug) console.log(marker);

	            // we could implement handling for other markers here,
	            // but we're only looking for 0xFFE1 for EXIF data

	            if (marker == 225) {
	                if (debug) console.log("Found 0xFFE1 marker");

	                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

	                // offset += 2 + file.getShortAt(offset+2, true);

	            } else {
	                offset += 2 + dataView.getUint16(offset+2);
	            }

	        }

	    }

	    function findIPTCinJPEG(file) {
	        var dataView = new DataView(file);

	        if (debug) console.log("Got file of length " + file.byteLength);
	        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
	            if (debug) console.log("Not a valid JPEG");
	            return false; // not a valid jpeg
	        }

	        var offset = 2,
	            length = file.byteLength;


	        var isFieldSegmentStart = function(dataView, offset){
	            return (
	                dataView.getUint8(offset) === 0x38 &&
	                dataView.getUint8(offset+1) === 0x42 &&
	                dataView.getUint8(offset+2) === 0x49 &&
	                dataView.getUint8(offset+3) === 0x4D &&
	                dataView.getUint8(offset+4) === 0x04 &&
	                dataView.getUint8(offset+5) === 0x04
	            );
	        };

	        while (offset < length) {

	            if ( isFieldSegmentStart(dataView, offset )){

	                // Get the length of the name header (which is padded to an even number of bytes)
	                var nameHeaderLength = dataView.getUint8(offset+7);
	                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
	                // Check for pre photoshop 6 format
	                if(nameHeaderLength === 0) {
	                    // Always 4
	                    nameHeaderLength = 4;
	                }

	                var startOffset = offset + 8 + nameHeaderLength;
	                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

	                return readIPTCData(file, startOffset, sectionLength);

	                break;

	            }


	            // Not the marker, continue searching
	            offset++;

	        }

	    }
	    var IptcFieldMap = {
	        0x78 : 'caption',
	        0x6E : 'credit',
	        0x19 : 'keywords',
	        0x37 : 'dateCreated',
	        0x50 : 'byline',
	        0x55 : 'bylineTitle',
	        0x7A : 'captionWriter',
	        0x69 : 'headline',
	        0x74 : 'copyright',
	        0x0F : 'category'
	    };
	    function readIPTCData(file, startOffset, sectionLength){
	        var dataView = new DataView(file);
	        var data = {};
	        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
	        var segmentStartPos = startOffset;
	        while(segmentStartPos < startOffset+sectionLength) {
	            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
	                segmentType = dataView.getUint8(segmentStartPos+2);
	                if(segmentType in IptcFieldMap) {
	                    dataSize = dataView.getInt16(segmentStartPos+3);
	                    segmentSize = dataSize + 5;
	                    fieldName = IptcFieldMap[segmentType];
	                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
	                    // Check if we already stored a value with this name
	                    if(data.hasOwnProperty(fieldName)) {
	                        // Value already stored with this name, create multivalue field
	                        if(data[fieldName] instanceof Array) {
	                            data[fieldName].push(fieldValue);
	                        }
	                        else {
	                            data[fieldName] = [data[fieldName], fieldValue];
	                        }
	                    }
	                    else {
	                        data[fieldName] = fieldValue;
	                    }
	                }

	            }
	            segmentStartPos++;
	        }
	        return data;
	    }



	    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
	        var entries = file.getUint16(dirStart, !bigEnd),
	            tags = {},
	            entryOffset, tag,
	            i;

	        for (i=0;i<entries;i++) {
	            entryOffset = dirStart + i*12 + 2;
	            tag = strings[file.getUint16(entryOffset, !bigEnd)];
	            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
	            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
	        }
	        return tags;
	    }


	    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
	        var type = file.getUint16(entryOffset+2, !bigEnd),
	            numValues = file.getUint32(entryOffset+4, !bigEnd),
	            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
	            offset,
	            vals, val, n,
	            numerator, denominator;

	        switch (type) {
	            case 1: // byte, 8-bit unsigned int
	            case 7: // undefined, 8-bit byte, value depending on field
	                if (numValues == 1) {
	                    return file.getUint8(entryOffset + 8, !bigEnd);
	                } else {
	                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getUint8(offset + n);
	                    }
	                    return vals;
	                }

	            case 2: // ascii, 8-bit byte
	                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
	                return getStringFromDB(file, offset, numValues-1);

	            case 3: // short, 16 bit int
	                if (numValues == 1) {
	                    return file.getUint16(entryOffset + 8, !bigEnd);
	                } else {
	                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 4: // long, 32 bit int
	                if (numValues == 1) {
	                    return file.getUint32(entryOffset + 8, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 5:    // rational = two long values, first is numerator, second is denominator
	                if (numValues == 1) {
	                    numerator = file.getUint32(valueOffset, !bigEnd);
	                    denominator = file.getUint32(valueOffset+4, !bigEnd);
	                    val = new Number(numerator / denominator);
	                    val.numerator = numerator;
	                    val.denominator = denominator;
	                    return val;
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
	                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
	                        vals[n] = new Number(numerator / denominator);
	                        vals[n].numerator = numerator;
	                        vals[n].denominator = denominator;
	                    }
	                    return vals;
	                }

	            case 9: // slong, 32 bit signed int
	                if (numValues == 1) {
	                    return file.getInt32(entryOffset + 8, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
	                    }
	                    return vals;
	                }

	            case 10: // signed rational, two slongs, first is numerator, second is denominator
	                if (numValues == 1) {
	                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
	                } else {
	                    vals = [];
	                    for (n=0;n<numValues;n++) {
	                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
	                    }
	                    return vals;
	                }
	        }
	    }

	    function getStringFromDB(buffer, start, length) {
	        var outstr = "";
	        for (n = start; n < start+length; n++) {
	            outstr += String.fromCharCode(buffer.getUint8(n));
	        }
	        return outstr;
	    }

	    function readEXIFData(file, start) {
	        if (getStringFromDB(file, start, 4) != "Exif") {
	            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
	            return false;
	        }

	        var bigEnd,
	            tags, tag,
	            exifData, gpsData,
	            tiffOffset = start + 6;

	        // test for TIFF validity and endianness
	        if (file.getUint16(tiffOffset) == 0x4949) {
	            bigEnd = false;
	        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
	            bigEnd = true;
	        } else {
	            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
	            return false;
	        }

	        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
	            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
	            return false;
	        }

	        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

	        if (firstIFDOffset < 0x00000008) {
	            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
	            return false;
	        }

	        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

	        if (tags.ExifIFDPointer) {
	            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
	            for (tag in exifData) {
	                switch (tag) {
	                    case "LightSource" :
	                    case "Flash" :
	                    case "MeteringMode" :
	                    case "ExposureProgram" :
	                    case "SensingMethod" :
	                    case "SceneCaptureType" :
	                    case "SceneType" :
	                    case "CustomRendered" :
	                    case "WhiteBalance" :
	                    case "GainControl" :
	                    case "Contrast" :
	                    case "Saturation" :
	                    case "Sharpness" :
	                    case "SubjectDistanceRange" :
	                    case "FileSource" :
	                        exifData[tag] = StringValues[tag][exifData[tag]];
	                        break;

	                    case "ExifVersion" :
	                    case "FlashpixVersion" :
	                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
	                        break;

	                    case "ComponentsConfiguration" :
	                        exifData[tag] =
	                            StringValues.Components[exifData[tag][0]] +
	                            StringValues.Components[exifData[tag][1]] +
	                            StringValues.Components[exifData[tag][2]] +
	                            StringValues.Components[exifData[tag][3]];
	                        break;
	                }
	                tags[tag] = exifData[tag];
	            }
	        }

	        if (tags.GPSInfoIFDPointer) {
	            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
	            for (tag in gpsData) {
	                switch (tag) {
	                    case "GPSVersionID" :
	                        gpsData[tag] = gpsData[tag][0] +
	                            "." + gpsData[tag][1] +
	                            "." + gpsData[tag][2] +
	                            "." + gpsData[tag][3];
	                        break;
	                }
	                tags[tag] = gpsData[tag];
	            }
	        }

	        return tags;
	    }

	    EXIF.getData = function(img, callback) {
	        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

	        if (!imageHasData(img)) {
	            getImageData(img, callback);
	        } else {
	            if (callback) {
	                callback.call(img);
	            }
	        }
	        return true;
	    }

	    EXIF.getTag = function(img, tag) {
	        if (!imageHasData(img)) return;
	        return img.exifdata[tag];
	    }

	    EXIF.getAllTags = function(img) {
	        if (!imageHasData(img)) return {};
	        var a,
	            data = img.exifdata,
	            tags = {};
	        for (a in data) {
	            if (data.hasOwnProperty(a)) {
	                tags[a] = data[a];
	            }
	        }
	        return tags;
	    }

	    EXIF.pretty = function(img) {
	        if (!imageHasData(img)) return "";
	        var a,
	            data = img.exifdata,
	            strPretty = "";
	        for (a in data) {
	            if (data.hasOwnProperty(a)) {
	                if (typeof data[a] == "object") {
	                    if (data[a] instanceof Number) {
	                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
	                    } else {
	                        strPretty += a + " : [" + data[a].length + " values]\r\n";
	                    }
	                } else {
	                    strPretty += a + " : " + data[a] + "\r\n";
	                }
	            }
	        }
	        return strPretty;
	    }

	    EXIF.readFromBinaryFile = function(file) {
	        return findEXIFinJPEG(file);
	    }

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return EXIF;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	}.call(this));



/***/ },
/* 5 */
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
	      var exportZoom = _ref.exportZoom;
	      var maxZoom = _ref.maxZoom;
	      var minZoom = _ref.minZoom;
	      var smallImage = _ref.smallImage;

	      var widthRatio = previewSize.w / imageSize.w;
	      var heightRatio = previewSize.h / imageSize.h;

	      if (minZoom === 'fit') {
	        this.minZoom = Math.min(widthRatio, heightRatio);
	      } else {
	        this.minZoom = Math.max(widthRatio, heightRatio);
	      }

	      if (smallImage === 'allow') {
	        this.minZoom = Math.min(this.minZoom, 1);
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _constants = __webpack_require__(3);

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
/* 7 */
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