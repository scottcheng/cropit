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
};

const delegate = ($el, fnName) => {
  return applyOnEach($el, (cropit) => {
    cropit[fnName]();
  });
};

const prop = ($el, name, value) => {
  if (exists(value)) {
    return applyOnEach($el, (cropit) => {
      cropit[name] = value;
    });
  }
  else {
    const cropit = $el.first().data(PLUGIN_KEY);
    return cropit[name];
  }
};

$.fn.cropit = function(method) {
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  }
  else if (['imageState', 'imageSrc', 'offset', 'previewSize', 'imageSize', 'zoom',
            'initialZoom', 'exportZoom', 'minZoom', 'maxZoom'].indexOf(method) >= 0) {
    return prop(this, ...arguments);
  }
  else if (['rotateCW', 'rotateCCW', 'disable', 'reenable'].indexOf(method) >= 0) {
    return delegate(this, ...arguments);
  }
  else {
    return methods.init.apply(this, arguments);
  }
};
