## 0.5.1 (February 27, 2016)

### Bug fixes

* Fixed wrong image offset when rotation is negative.
* Fixed bug where image background can be dragged and moved.


## 0.5.0 (February 27, 2016)

### Breaking changes

* Markup structure and class name changes. Importantly, changed `.cropit-image-preview` to `.cropit-preview`, `.cropit-image-background-container` to `.cropit-preview-background-container`, and `.cropit-image-background` to `.cropit-preview-background`. `.cropit-image-preview-container` element is no longer needed, and all you need is a `.cropit-preview` (previously `.cropit-image-preview`) whether or not you want image background beyond the preview. New markup structure (after cropit is initialized) is as follows:

```jade
.cropit-preview
  .cropit-preview-background-container
    img.cropit-preview-background
  .cropit-preview-image-container
    img.cropit-preview-image
```

### New features

* Added rotation APIs `rotateCW` and `rotateCCW`, which rotates the image by 90 degrees clockwise/counterclockwise. If, after rotated by 90 degrees, the dimension of the image no longer meets the requirements, it would be rotated by 180 degrees.
* Render image using CSS transformation, which drastically improved performance.

### Bug fixes

* Now remote images are loaded through AJAX and rendered as data URI strings, which addresses CORS issues. `allowCrossOrigin` option is no longer necessary and therefore removed.


## 0.4.5 (September 27, 2015)

### Bug fixes

* Fixed an issue where cropit exports blank images on Safari. Removed progressive resizing, which may degrade cropped image quality. For high quality resizing, using a server-side tool is recommended.


## 0.4.4 (September 12, 2015)

### New features

* Added getters and setters for `initialZoom`, `exportZoom`, `minZoom` and `maxZoom`
* Added `onOffsetChange` and `onZoomChange` callback
* onFileChange now passes back the event object

### Bug fixes

* Fixed bug where `image-loaded` class is removed if a small image is loaded and rejected


## 0.4.1 (August 2, 2015)

### Bug fixes

* Fixed crossOrigin preventing image from loading in Safari and Firefox.


## 0.4.0 (July 7, 2015)

### New features

* Added option to allow small image to be either zoomed down its original size or stretch to fill/fit container

### Breaking changes

* Replaced `rejectSmallImage` option with `smallImage`. `rejectSmallImage: true` is now `smallImage: 'reject'`, and `rejectSmallImage: false` is now `smallImage: 'allow'`.


## 0.3.2 (July 3, 2015)

### New features

* Added back `allowCrossOrigin` option


## 0.3.1 (June 30, 2015)

### Bug fixes

* Fixed jQuery import in AMD and CommonJS.


## 0.3.0 (June 21, 2015)

### New features

* Center image when uploaded
* Added `maxZoom`, `minZoom`, `initialZoom` options
* Added `rejectSmallImage` option
  * By default if image is smaller than preview, it won't be loaded and the old image would be preserved
* Added `onFileReaderError` callback

### Breaking changes

* Removed `allowCrossOrigin` option

### Development

* Major refactor -- rewrote in ES6! No more CoffeeScript.
* Now build with Webpack and removed Grunt


## 0.2.0 (December 16, 2014)

### New features

* Added drag & drop support via `allowDragNDrop` option, default to true
* Added free move support via `freeMove` option, default to false
* Added CommonJS support

### Breaking changes

* Renamed option `freeImageMove` -> `freeMove`


## 0.1.9 (October 19, 2014)

### New features

* Added touch support
* Added disable and reenable APIs
* Support varying backgroung image border size
* Added white background in jpeg format exports
