import $ from 'jquery';

import Cropit from './cropit';
import { PLUGIN_KEY } from './constants';
import { exists } from './utils';

const applyOnEach = ($el, callback) => {
  return $el.each(function() {
    const cropit = $.data(this, PLUGIN_KEY);

    if (!cropit) { return; }
    callback(cropit);
  });
};

const callOnFirst = ($el, method, options) => {
  const cropit = $el.first().data(PLUGIN_KEY);

  if (!cropit || !$.isFunction(cropit[method])) { return null; }
  return cropit[method](options);
};

const methods = {
  init(options) {
    return this.each(function() {
      // Only instantiate once per element
      if ($.data(this, PLUGIN_KEY)) { return; }

      const cropit = new Cropit($, this, options);
      $.data(this, PLUGIN_KEY, cropit);
    });
  },

  destroy() {
    return this.each(function() {
      $.removeData(this, PLUGIN_KEY);
    });
  },

  isZoomable() {
    return callOnFirst(this, 'isZoomable');
  },

  export(options) {
    return callOnFirst(this, 'getCroppedImageData', options);
  },

  imageState() {
    return callOnFirst(this, 'getImageState');
  },

  imageSrc(newImageSrc) {
    if (exists(newImageSrc)) {
      return applyOnEach(this, (cropit) => {
        cropit.loadImage(newImageSrc);
      });
    }
    else {
      return callOnFirst(this, 'getImageSrc');
    }
  },

  offset(newOffset) {
    if (newOffset && exists(newOffset.x) && exists(newOffset.y)) {
      return applyOnEach(this, (cropit) => {
        cropit.setOffset(newOffset);
      });
    }
    else {
      return callOnFirst(this, 'getOffset');
    }
  },

  zoom(newZoom) {
    if (exists(newZoom)) {
      return applyOnEach(this, (cropit) => {
        cropit.setZoom(newZoom);
      });
    }
    else {
      return callOnFirst(this, 'getZoom');
    }
  },

  imageSize() {
    return callOnFirst(this, 'getImageSize');
  },

  previewSize(newSize) {
    if (newSize) {
      return applyOnEach(this, (cropit) => {
        cropit.setPreviewSize(newSize);
      });
    }
    else {
      return callOnFirst(this, 'getPreviewSize');
    }
  },

  disable() {
    return applyOnEach(this, (cropit) => {
      cropit.disable();
    });
  },

  reenable() {
    return applyOnEach(this, (cropit) => {
      cropit.reenable();
    });
  },
};

$.fn.cropit = function(method) {
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  }
  else {
    return methods.init.apply(this, arguments);
  }
};
