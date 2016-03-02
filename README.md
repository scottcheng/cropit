# cropit

Customizable crop and zoom.

See demos and docs [here](http://scottcheng.github.io/cropit/).

Built on top of [Yufei Liu's Image Editor](https://github.com/yufeiliu/simple_image_uploader).


## Installation

```bash
# Install cropit with bower
$ bower install cropit

# or with npm
$ npm install cropit
```


## Migrating to v0.5

v0.5 [introduced](https://github.com/scottcheng/cropit/blob/master/CHANGELOG.md#user-content-050-february-27-2016) rotation feature and improved performance, as well as a breaking changes in markup structure and class names.

Markup in v0.4:

```html
<div class="image-editor">
  <!-- .cropit-image-preview-container is needed for background image to work -->
  <div class="cropit-image-preview-container">
    <div class="cropit-image-preview"></div>
  </div>
  <!-- Other stuff -->
</div>
```

New markup in v0.5:

```html
<div class="image-editor">
  <div class="cropit-preview"></div>
  <!-- Other stuff -->
</div>
```

Note that `.cropit-image-preview-container` element is no longer needed, and all you need is a `.cropit-preview` (previously `.cropit-image-preview`) whether or not you want image background that goes beyond the preview area. New markup structure (after cropit is initialized) is as follows:

```jade
.cropit-preview
  .cropit-preview-background-container
    img.cropit-preview-background
  .cropit-preview-image-container
    img.cropit-preview-image
```

Note the class name changes:

```
.cropit-image-preview              => .cropit-preview
.cropit-image-background-container => .cropit-preview-background-container
.cropit-image-background           => .cropit-preview-background
```

Make sure to update class names in your selectors.


## Development

* Build: `webpack`
  * Watch for changes and rebuild: `webpack -w`
* Test: `npm test`
  * Test specific file: `jest <filename>`
* Lint: `npm run jshint -s`


## License

MIT
