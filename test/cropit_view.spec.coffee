jasmine.getFixtures().fixturesPath = 'test/fixtures'

dataKey = 'cropit'
imageUrl = 'http://example.com/image.jpg'
imageData = 'data:image/png;base64,image-data...'

describe 'Cropit View', ->

  $el = null
  cropit = null

  describe 'basic', ->

    beforeEach ->
      loadFixtures 'basic.html'
      $el = $ '.image-editor'

    describe 'init()', ->

      it 'inserts hidden image', ->
        $el.cropit()
        $hiddenImage = $el.find 'img.cropit-image-hidden-preview'
        expect($hiddenImage).toBeInDOM()
        expect($hiddenImage).not.toBeVisible()

      it 'sets preview size from options', ->
        $preview = $el.find '.cropit-image-preview'
        $preview.css width: 1, height: 1
        expect($preview.width()).not.toBe 2
        expect($preview.height()).not.toBe 2

        $el.cropit width: 2, height: 2
        expect($preview.width()).toBe 2
        expect($preview.height()).toBe 2

      it 'sets preview background-repeat to no-repeat', ->
        $preview = $el.find '.cropit-image-preview'
        $preview.css backgroundRepeat: 'repeat'
        expect($preview.css('background-repeat')).not.toBe 'no-repeat'

        $el.cropit()
        expect($preview.css('background-repeat')).toBe 'no-repeat'

      it 'sets min, max and step attributes on zoom slider', ->
        $imageZoomInput = $el.find 'input.cropit-image-zoom-input'
        $imageZoomInput.attr
          min: 2
          max: 3
          step: .5
        expect($imageZoomInput.attr 'min').not.toBe '0'
        expect($imageZoomInput.attr 'max').not.toBe '1'
        expect($imageZoomInput.attr 'step').not.toBe '0.01'

        $el.cropit()
        expect($imageZoomInput.attr 'min').toBe '0'
        expect($imageZoomInput.attr 'max').toBe '1'
        expect($imageZoomInput.attr 'step').toBe '0.01'

      it 'sets zoom slider to 0', ->
        $imageZoomInput = $el.find 'input.cropit-image-zoom-input'
        $imageZoomInput.val 1
        expect($imageZoomInput.val()).not.toBe 0

        $el.cropit()
        expect(Number($imageZoomInput.val())).toBe 0

    describe 'onFileChange()', ->

      it 'is invoked when file input changes', ->
        spyOn Cropit.prototype, 'onFileChange'
        $el.cropit()
        $fileInput = $el.find 'input.cropit-image-input'

        $fileInput.trigger 'change'
        expect(Cropit.prototype.onFileChange).toHaveBeenCalled()

      it 'calls options.onFileChange()', ->
        onFileChangeCallback = jasmine.createSpy 'onFileChange callback'
        $el.cropit
          onFileChange: onFileChangeCallback
        cropit = $el.data dataKey

        cropit.onFileChange()
        expect(onFileChangeCallback).toHaveBeenCalled()

    describe 'loadImage()', ->

      beforeEach ->
        $el.cropit()
        cropit = $el.data dataKey
        cropit.imageSrc = imageData

      it 'sets hidden image source', ->
        $hiddenImage = $el.find 'img.cropit-image-hidden-preview'
        expect($hiddenImage).not.toHaveAttr 'src', imageData

        cropit.loadImage()
        expect($hiddenImage).toHaveAttr 'src', imageData

      it 'calls options.onImageLoading()', ->
        onImageLoadingCallback = jasmine.createSpy 'onImageLoading callback'
        $el.cropit
          onImageLoading: onImageLoadingCallback
        cropit = $el.data dataKey

        cropit.loadImage()
        expect(onImageLoadingCallback).toHaveBeenCalled()

    describe 'onImageLoaded()', ->

      beforeEach ->
        $el.cropit()
        cropit = $el.data dataKey
        cropit.imageSrc = imageData

      it 'sets preview background', ->
        $preview = $el.find '.cropit-image-preview'
        expect($preview).not.toHaveCss backgroundImage: "url(#{imageData})"

        cropit.onImageLoaded()
        expect($preview).toHaveCss backgroundImage: "url(#{imageData})"

      it 'sets up zoomer', ->
        spyOn cropit.zoomer, 'setup'

        cropit.onImageLoaded()
        expect(cropit.zoomer.setup).toHaveBeenCalled()

      it 'updates zoom slider', ->
        $imageZoomInput = $el.find 'input.cropit-image-zoom-input'
        $imageZoomInput.val 1
        cropit.zoomer.getSliderPos = -> .5
        expect(Number($imageZoomInput.val())).not.toBe .5

        cropit.onImageLoaded()
        expect(Number($imageZoomInput.val())).toBe .5

      it 'calls options.onImageLoaded()', ->
        onImageLoadedCallback = jasmine.createSpy 'onImageLoaded callback'
        $el.cropit
          onImageLoaded: onImageLoadedCallback
        cropit = $el.data dataKey

        cropit.onImageLoaded()
        expect(onImageLoadedCallback).toHaveBeenCalled()

    describe 'handlePreviewEvent()', ->

      it 'is invoked on mousedown on preview', ->
        spyOn Cropit.prototype, 'handlePreviewEvent'
        $el.cropit()
        $preview = $el.find '.cropit-image-preview'

        $preview.trigger 'mousedown'
        expect(Cropit.prototype.handlePreviewEvent).toHaveBeenCalled()

      it 'is invoked on mouseup on preview', ->
        spyOn Cropit.prototype, 'handlePreviewEvent'
        $el.cropit()
        $preview = $el.find '.cropit-image-preview'

        $preview.trigger 'mouseup'
        expect(Cropit.prototype.handlePreviewEvent).toHaveBeenCalled()

      it 'is invoked on mouseleave on preview', ->
        spyOn Cropit.prototype, 'handlePreviewEvent'
        $el.cropit()
        $preview = $el.find '.cropit-image-preview'

        $preview.trigger 'mouseleave'
        expect(Cropit.prototype.handlePreviewEvent).toHaveBeenCalled()

      it 'binds onMove() on mousedown', ->
        $el.cropit()
        cropit = $el.data dataKey
        cropit.imageLoaded = true
        cropit.imageSize = w: 8, h: 6
        cropit.previewSize = w: 2, h: 2

        $preview = $el.find '.cropit-image-preview'

        spyOn Cropit.prototype, 'onMove'
        cropit.handlePreviewEvent
          type: 'mousedown'
          stopPropagation: ->

        $preview.trigger 'mousemove'
        expect(Cropit.prototype.onMove).toHaveBeenCalled()

      it 'moves image by dragging', ->
        $el.cropit()
        cropit = $el.data dataKey
        cropit.imageLoaded = true
        cropit.imageSize = w: 8, h: 6
        cropit.previewSize = w: 2, h: 2
        cropit.setOffset x: 0, y: 0
        spyOn cropit, 'setOffset'

        cropit.handlePreviewEvent
          type: 'mousedown'
          clientX: -1
          clientY: -1
          stopPropagation: ->
        expect(cropit.setOffset).not.toHaveBeenCalled()

        cropit.onMove
          type: 'mousemove'
          clientX: -3
          clientY: -2
          stopPropagation: ->
        expect(cropit.setOffset).toHaveBeenCalledWith x: -2, y: -1

    describe 'setOffset()', ->

      beforeEach ->
        $el.cropit()
        cropit = $el.data dataKey
        cropit.imageSize = w: 8, h: 6
        cropit.previewSize = w: 2, h: 2
        cropit.zoom = 1
        cropit.imageLoaded = true

      it 'moves preview image', ->
        $preview = $el.find '.cropit-image-preview'
        expect($preview).not.toHaveCss backgroundPosition: '-1px -1px'

        cropit.setOffset x: -1, y: -1
        expect($preview).toHaveCss backgroundPosition: '-1px -1px'

    describe 'updateSliderPos()', ->

      beforeEach ->
        $el.cropit()
        cropit = $el.data dataKey
        cropit.imageSize = w: 8, h: 6
        cropit.previewSize = w: 2, h: 2
        cropit.zoom = 1
        cropit.imageLoaded = true
        cropit.setZoom = ->

      it 'is invoked mousedown on zoom slider', ->
        spyOn Cropit.prototype, 'updateSliderPos'
        $el.cropit()
        $imageZoomInput = $el.find 'input.cropit-image-zoom-input'

        $imageZoomInput.trigger 'mousedown'
        expect(Cropit.prototype.updateSliderPos).toHaveBeenCalled()

      it 'is invoked mouseup on zoom slider', ->
        spyOn Cropit.prototype, 'updateSliderPos'
        $el.cropit()
        $imageZoomInput = $el.find 'input.cropit-image-zoom-input'

        $imageZoomInput.trigger 'mouseup'
        expect(Cropit.prototype.updateSliderPos).toHaveBeenCalled()

      it 'is invoked mousemove on zoom slider', ->
        spyOn Cropit.prototype, 'updateSliderPos'
        $el.cropit()
        $imageZoomInput = $el.find 'input.cropit-image-zoom-input'

        $imageZoomInput.trigger 'mousemove'
        expect(Cropit.prototype.updateSliderPos).toHaveBeenCalled()

      it 'updates sliderPos', ->
        cropit.sliderPos = 0
        expect(cropit.sliderPos).not.toBe 1

        $imageZoomInput = $el.find 'input.cropit-image-zoom-input'
        $imageZoomInput.val 1
        cropit.updateSliderPos()
        expect(cropit.sliderPos).toBe 1

      it 'calls setZoom', ->
        spyOn cropit, 'setZoom'
        cropit.updateSliderPos()
        expect(cropit.setZoom).toHaveBeenCalled()

    describe 'setZoom()', ->

      $preview = null

      beforeEach ->
        $el.cropit()
        cropit = $el.data dataKey
        cropit.imageSize = w: 8, h: 12
        cropit.previewSize = w: 2, h: 2
        cropit.offset = x: 0, y: 0
        cropit.zoom = .5
        cropit.imageLoaded = true
        cropit.zoomer.minZoom = .5
        cropit.zoomer.maxZoom = 1

        $preview = $el.find '.cropit-image-preview'

      it 'keeps attributes when set to original zoom', ->
        cropit.setZoom .5
        expect(cropit.zoom).toBe .5
        expect(cropit.offset).toEqual x: 0, y: 0
        expect($preview).toHaveCss backgroundPosition: '0px 0px'
        expect($preview).toHaveCss backgroundSize: '4px 6px'

      it 'zooms preview image', ->
        expect(cropit.zoom).not.toBe 1
        expect(cropit.offset).not.toEqual x: -2, y: -3
        expect($preview).not.toHaveCss backgroundPosition: '-2px -3px'
        expect($preview).not.toHaveCss backgroundSize: '8px 12px'

        cropit.setZoom 1
        expect(cropit.zoom).toBe 1
        expect(cropit.offset).toEqual x: -2, y: -3
        expect($preview).toHaveCss backgroundPosition: '-2px -3px'
        expect($preview).toHaveCss backgroundSize: '8px 12px'

      it 'keeps zoom in proper range', ->
        expect(cropit.zoom).not.toBe 1
        expect(cropit.offset).not.toEqual x: -2, y: -3
        expect($preview).not.toHaveCss backgroundPosition: '-2px -3px'
        expect($preview).not.toHaveCss backgroundSize: '8px 12px'

        cropit.setZoom 1.5
        expect(cropit.zoom).toBe 1
        expect(cropit.offset).toEqual x: -2, y: -3
        expect($preview).toHaveCss backgroundPosition: '-2px -3px'
        expect($preview).toHaveCss backgroundSize: '8px 12px'

  describe 'with background image', ->

    beforeEach ->
      loadFixtures 'image-background.html'
      $el = $ '.image-editor'

    describe 'init()', ->

      it 'inserts background image', ->
        $el.cropit imageBackground: true
        $imageBg = $el.find 'img.cropit-image-background'
        expect($imageBg).toBeInDOM()
        expect($imageBg).toHaveCss position: 'absolute'

      it 'inserts background image container', ->
        $el.cropit imageBackground: true
        $imageBgContainer = $el.find '.cropit-image-background-container'
        expect($imageBgContainer).toBeInDOM()
        expect($imageBgContainer).toHaveCss position: 'absolute'

    describe 'onImageLoaded()', ->

      it 'updates background image source', ->
        $el.cropit imageBackground: true
        cropit = $el.data dataKey
        cropit.imageSrc = imageData
        $imageBg = $el.find 'img.cropit-image-background'
        expect($imageBg).not.toHaveAttr 'src', imageData

        cropit.onImageLoaded()
        expect($imageBg).toHaveAttr 'src', imageData

    describe 'setOffset()', ->

      it 'updates background image position', ->
        $el.cropit imageBackground: true
        cropit = $el.data dataKey
        cropit.imageSize = w: 8, h: 6
        cropit.previewSize = w: 2, h: 2
        cropit.zoom = 1

        $imageBg = $el.find 'img.cropit-image-background'
        expect($imageBg).not.toHaveCss left: '-1px', top: '-1px'

        cropit.setOffset x: -1, y: -1
        expect($imageBg).toHaveCss left: '-1px', top: '-1px'

      it 'adds background image border size to background image offset', ->
        $el.cropit
          imageBackground: true
          imageBackgroundBorderWidth: 2
        cropit = $el.data dataKey
        cropit.imageSize = w: 8, h: 6
        cropit.previewSize = w: 2, h: 2
        cropit.zoom = 1

        $imageBg = $el.find 'img.cropit-image-background'
        expect($imageBg).not.toHaveCss left: '-1px', top: '-1px'

        cropit.setOffset x: -3, y: -3
        expect($imageBg).toHaveCss left: '-1px', top: '-1px'

    describe 'setZoom()', ->
      # TODO

      it 'zooms background image', ->
        $el.cropit imageBackground: true
        cropit = $el.data dataKey
        cropit.imageSize = w: 8, h: 12
        cropit.previewSize = w: 2, h: 2
        cropit.offset = x: 0, y: 0
        cropit.zoom = .5
        cropit.imageLoaded = true
        cropit.zoomer.minZoom = .5
        cropit.zoomer.maxZoom = 1

        $imageBg = $el.find 'img.cropit-image-background'
        expect($imageBg).not.toHaveCss width: '8px', height: '12px'

        cropit.setZoom 1
        expect($imageBg).toHaveCss width: '8px', height: '12px'
