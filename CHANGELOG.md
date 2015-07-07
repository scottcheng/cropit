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
