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
    var Plugin, defaults, pluginName;
    pluginName = "defaultPluginName";
    defaults = {
      property: "value"
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Plugin.prototype.init = function() {
        return console.log("xD");
      };

      Plugin.prototype.yourOtherFunction = function() {};

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
