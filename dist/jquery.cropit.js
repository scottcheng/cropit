/*
 *  cropit - v0.0.1
 *  Easy crop and zoom
 *  https://github.com/scottcheng/cropit
 *
 *  Made by Scott Cheng
 *  Based on https://github.com/yufeiliu/simple_image_uploader
 *  Under MIT License
 */
(function() {
  (function($, window, document) {
    var Cropit, Zoomer, defaults, pluginName;
    pluginName = 'cropit';
    defaults = {
      exportZoom: 1,
      imageBackground: false,
      imageBackgroundBorderSize: 0,
      imageState: null
    };
    Cropit = (function() {
      function Cropit(element, options) {
        var dynamicDefaults;
        this.element = element;
        this.$el = $(this.element);
        dynamicDefaults = {
          $fileInput: this.$('input[name="image"]'),
          $preview: this.$('.image-preview'),
          $imageZoomInput: this.$('.image-zoom-level'),
          $previewContainer: this.$('.image-preview-container')
        };
        this.options = $.extend({}, defaults, dynamicDefaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Cropit.prototype.init = function() {
        var $imageBgContainer, $previewContainer, imageBgBorderSize, _ref, _ref1, _ref2, _ref3, _ref4;
        this.$fileInput = this.options.$fileInput;
        this.$preview = this.options.$preview;
        this.$imageZoomInput = this.options.$imageZoomInput;
        this.$hiddenImage = $('<img class="image-hidden-preview" alt="" style="display: none" />').appendTo(this.$el);
        if (this.options.width) {
          this.$preview.width(this.options.width);
        }
        if (this.options.height) {
          this.$preview.height(this.options.height);
        }
        this.previewSize = {
          w: this.options.width || this.$preview.width(),
          h: this.options.height || this.$preview.height()
        };
        if (this.options.imageBackground) {
          imageBgBorderSize = this.options.imageBackgroundBorderSize;
          $previewContainer = this.options.$previewContainer;
          this.$imageBg = $('<img />').addClass('image-background').attr('alt', '').css('position', 'absolute');
          $imageBgContainer = $('<div />').addClass('image-background-container').css({
            position: 'absolute',
            zIndex: 0,
            top: -imageBgBorderSize,
            left: -imageBgBorderSize,
            width: this.previewSize.w + imageBgBorderSize * 2,
            height: this.previewSize.h + imageBgBorderSize * 2
          }).append(this.$imageBg);
          $previewContainer.css('position', 'relative').prepend($imageBgContainer);
          this.$preview.css('position', 'relative');
          this.imageBgPreviewOffset = {
            x: imageBgBorderSize + window.parseInt(this.$preview.css('border-left-width')),
            y: imageBgBorderSize + window.parseInt(this.$preview.css('border-top-width'))
          };
        }
        this.initialZoomSliderPos = 0;
        this.disabled = true;
        this.imageSrc = ((_ref = this.options.imageState) != null ? _ref.src : void 0) || null;
        this.sliderPos = ((_ref1 = this.options.imageState) != null ? _ref1.sliderPos : void 0) || this.initialZoomSliderPos;
        this.zoom = ((_ref2 = this.options.imageState) != null ? _ref2.zoom : void 0) || null;
        this.offset = ((_ref3 = this.options.imageState) != null ? _ref3.offset : void 0) || {
          x: 0,
          y: 0
        };
        this.moveContinue = false;
        this.zoomer = new Zoomer;
        this.$preview.on('mousedown mouseup mouseleave', this.handlePreviewEvent.bind(this));
        this.$fileInput.on('change', this.onFileChange.bind(this));
        this.$imageZoomInput.on('change mousemove', this.updateImageZoom.bind(this));
        if ((_ref4 = this.options.imageState) != null ? _ref4.src : void 0) {
          return this.loadImage();
        }
      };

      Cropit.prototype.onFileChange = function() {
        var file, oFReader, _base;
        if (typeof (_base = this.options).onFileChange === "function") {
          _base.onFileChange();
        }
        oFReader = new FileReader();
        file = this.$fileInput.get(0).files[0];
        oFReader.readAsDataURL(file);
        return oFReader.onload = (function(_this) {
          return function(oFREvent) {
            _this.imageSrc = oFREvent.target.result;
            _this.sliderPos = _this.initialZoomSliderPos;
            _this.offset = {
              x: 0,
              y: 0
            };
            return _this.loadImage();
          };
        })(this);
      };

      Cropit.prototype.loadImage = function() {
        var _base;
        this.$hiddenImage.attr('src', this.imageSrc);
        this.$preview.css('background-image', "url(" + this.imageSrc + ")");
        if (typeof (_base = this.options).onImageLoading === "function") {
          _base.onImageLoading();
        }
        return this.$hiddenImage.load((function(_this) {
          return function() {
            var _base1;
            if (_this.options.imageBackground) {
              _this.$imageBg.attr('src', _this.imageSrc);
            }
            _this.imageSize = {
              w: _this.$hiddenImage.width(),
              h: _this.$hiddenImage.height()
            };
            _this.zoomer.setup(_this.imageSize, _this.previewSize, _this.options.exportZoom, _this.options);
            _this.$imageZoomInput.val(_this.sliderPos);
            _this.zoom = _this.zoomer.getZoom(_this.sliderPos);
            _this.updateImageZoom();
            _this.disabled = false;
            return typeof (_base1 = _this.options).onImageLoaded === "function" ? _base1.onImageLoaded() : void 0;
          };
        })(this));
      };

      Cropit.prototype.handlePreviewEvent = function(e) {
        if (this.disabled) {
          return;
        }
        this.moveContinue = false;
        this.$preview.off('mousemove');
        if (e.type === 'mousedown') {
          this.origin = {
            x: e.clientX,
            y: e.clientY
          };
          this.moveContinue = true;
          this.$preview.on('mousemove', this.onMove.bind(this));
        } else {
          $(document.body).focus();
        }
        e.stopPropagation();
        return false;
      };

      Cropit.prototype.onMove = function(e) {
        if (this.moveContinue) {
          this.updateImageOffset({
            x: this.offset.x + e.clientX - this.origin.x,
            y: this.offset.y + e.clientY - this.origin.y
          });
        }
        this.origin = {
          x: e.clientX,
          y: e.clientY
        };
        e.stopPropagation();
        return false;
      };

      Cropit.prototype.updateImageOffset = function(position) {
        this.offset = this.fixOffset(position);
        this.$preview.css('background-position', "" + position.x + "px " + position.y + "px");
        if (this.options.imageBackground) {
          return this.$imageBg.css({
            left: this.offset.x + this.imageBgPreviewOffset.x,
            top: this.offset.y + this.imageBgPreviewOffset.y
          });
        }
      };

      Cropit.prototype.fixOffset = function(offset) {
        if (this.imageSize.w * this.zoom <= this.previewSize.w) {
          offset.x = 0;
        } else if (offset.x > 0) {
          offset.x = 0;
        } else if (offset.x + this.imageSize.w * this.zoom < this.previewSize.w) {
          offset.x = this.previewSize.w - this.imageSize.w * this.zoom;
        }
        if (this.imageSize.h * this.zoom <= this.previewSize.h) {
          offset.y = 0;
        } else if (offset.y > 0) {
          offset.y = 0;
        } else if (offset.y + this.imageSize.h * this.zoom < this.previewSize.h) {
          offset.y = this.previewSize.h - this.imageSize.h * this.zoom;
        }
        offset.x = Math.round(offset.x);
        offset.y = Math.round(offset.y);
        return offset;
      };

      Cropit.prototype.updateImageZoom = function() {
        var newX, newY, newZoom, oldZoom, updatedHeight, updatedWidth, _ref, _ref1;
        if (!(((_ref = this.imageSize) != null ? _ref.w : void 0) && ((_ref1 = this.imageSize) != null ? _ref1.h : void 0))) {
          return;
        }
        this.sliderPos = Number(this.$imageZoomInput.val());
        newZoom = this.zoomer.getZoom(this.sliderPos);
        updatedWidth = Math.round(this.imageSize.w * newZoom);
        updatedHeight = Math.round(this.imageSize.h * newZoom);
        oldZoom = this.zoom;
        newX = (this.offset.x / oldZoom * newZoom + this.previewSize.w / 2) - this.previewSize.w / 2 / oldZoom * newZoom;
        newY = (this.offset.y / oldZoom * newZoom + this.previewSize.h / 2) - this.previewSize.h / 2 / oldZoom * newZoom;
        this.updateImageOffset({
          x: newX,
          y: newY
        });
        this.$preview.css('background-size', "" + updatedWidth + "px " + updatedHeight + "px");
        if (this.options.imageBackground) {
          this.$imageBg.css({
            width: updatedWidth,
            height: updatedHeight
          });
        }
        return this.zoom = newZoom;
      };

      Cropit.prototype.isZoomable = function() {
        return this.zoomer.isZoomable();
      };

      Cropit.prototype.getCroppedImage = function() {
        var $canvas, canvasContext, croppedSize;
        if (!this.imageSrc) {
          return null;
        }
        croppedSize = {
          w: this.previewSize.w,
          h: this.previewSize.h
        };
        if (this.options.fitHeight && !this.options.fitWidth && this.imageSize.w * this.zoom < this.previewSize.w) {
          croppedSize.w = this.imageSize.w * this.zoom;
        } else if (this.options.fitWidth && !this.options.fitHeight && this.imageSize.h * this.zoom < this.previewSize.h) {
          croppedSize.h = this.imageSize.h * this.zoom;
        }
        $canvas = $('<canvas />').attr({
          style: 'display: none;',
          width: croppedSize.w * this.options.exportZoom,
          height: croppedSize.h * this.options.exportZoom
        }).appendTo(this.$el);
        canvasContext = $canvas[0].getContext('2d');
        canvasContext.drawImage(this.$hiddenImage[0], this.offset.x * this.options.exportZoom, this.offset.y * this.options.exportZoom, this.zoom * this.options.exportZoom * this.imageSize.w, this.zoom * this.options.exportZoom * this.imageSize.h);
        return $canvas[0].toDataURL();
      };

      Cropit.prototype.getImageState = function() {
        return {
          src: this.imageSrc,
          offset: this.offset,
          zoom: this.zoom,
          sliderPos: this.sliderPos
        };
      };

      Cropit.prototype.getImageSize = function() {
        if (!this.imageSize) {
          return null;
        }
        return {
          width: this.imageSize.w,
          height: this.imageSize.h
        };
      };

      Cropit.prototype.$ = function(selector) {
        if (!this.$el) {
          return null;
        }
        return this.$el.find(selector);
      };

      return Cropit;

    })();
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Cropit(this, options));
        }
      });
    };
    return Zoomer = (function() {
      function Zoomer() {}

      Zoomer.prototype.setup = function(imageSize, previewSize, exportZoom, options) {
        var heightRatio, widthRatio;
        widthRatio = previewSize.w / imageSize.w;
        heightRatio = previewSize.h / imageSize.h;
        if (options.fitWidth && !options.fitHeight) {
          this.minZoom = widthRatio;
        } else if (options.fitHeight && !options.fitWidth) {
          this.minZoom = heightRatio;
        } else if (options.fitWidth && options.fitHeight) {
          this.minZoom = widthRatio < heightRatio ? widthRatio : heightRatio;
        } else {
          this.minZoom = widthRatio < heightRatio ? heightRatio : widthRatio;
        }
        return this.maxZoom = this.minZoom < 1 / exportZoom ? 1 / exportZoom : this.minZoom;
      };

      Zoomer.prototype.getZoom = function(sliderPos) {
        if (!(this.minZoom && this.maxZoom)) {
          return null;
        }
        return sliderPos * (this.maxZoom - this.minZoom) + this.minZoom;
      };

      Zoomer.prototype.isZoomable = function() {
        if (!(this.minZoom && this.maxZoom)) {
          return null;
        }
        return this.minZoom !== this.maxZoom;
      };

      return Zoomer;

    })();
  })(jQuery, window, document);

}).call(this);
