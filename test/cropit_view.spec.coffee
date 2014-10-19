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
        $zoomSlider = $el.find 'input.cropit-image-zoom-input'
        $zoomSlider.attr
          min: 2
          max: 3
          step: .5
        expect($zoomSlider.attr 'min').not.toBe '0'
        expect($zoomSlider.attr 'max').not.toBe '1'
        expect($zoomSlider.attr 'step').not.toBe '0.01'

        $el.cropit()
        expect($zoomSlider.attr 'min').toBe '0'
        expect($zoomSlider.attr 'max').toBe '1'
        expect($zoomSlider.attr 'step').toBe '0.01'

      it 'sets zoom slider to 0', ->
        $zoomSlider = $el.find 'input.cropit-image-zoom-input'
        $zoomSlider.val 1
        expect($zoomSlider.val()).not.toBe 0

        $el.cropit()
        expect(Number($zoomSlider.val())).toBe 0

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

      it 'calls options.onImageLoading()', ->
        onImageLoadingCallback = jasmine.createSpy 'onImageLoading callback'
        $el.cropit
          onImageLoading: onImageLoadingCallback
        cropit = $el.data dataKey

        cropit.loadImage imageData
        expect(onImageLoadingCallback).toHaveBeenCalled()

    describe 'onImageLoaded()', ->

      describe 'with imageSrc', ->

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
          $zoomSlider = $el.find 'input.cropit-image-zoom-input'
          $zoomSlider.val 1
          cropit.zoomer.getSliderPos = -> .5
          expect(Number($zoomSlider.val())).not.toBe .5

          cropit.onImageLoaded()
          expect(Number($zoomSlider.val())).toBe .5

      it 'calls options.onImageLoaded()', ->
        onImageLoadedCallback = jasmine.createSpy 'onImageLoaded callback'
        $el.cropit
          onImageLoaded: onImageLoadedCallback
        cropit = $el.data dataKey

        cropit.onImageLoaded()
        expect(onImageLoadedCallback).toHaveBeenCalled()

    describe 'onImageError()', ->

      it 'calls options.onImageError()', ->
        onImageError = jasmine.createSpy 'onImageLoaded callback'
        $el.cropit
          onImageError: onImageError
        cropit = $el.data dataKey

        cropit.onImageError()
        expect(onImageError).toHaveBeenCalled()

    describe 'onPreviewEvent()', ->

      describe 'mouse event', ->

        it 'is invoked on mousedown on preview', ->
          spyOn Cropit.prototype, 'onPreviewEvent'
          $el.cropit()
          $preview = $el.find '.cropit-image-preview'

          $preview.trigger 'mousedown'
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled()

        it 'is invoked on mouseup on preview', ->
          spyOn Cropit.prototype, 'onPreviewEvent'
          $el.cropit()
          $preview = $el.find '.cropit-image-preview'

          $preview.trigger 'mouseup'
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled()

        it 'is invoked on mouseleave on preview', ->
          spyOn Cropit.prototype, 'onPreviewEvent'
          $el.cropit()
          $preview = $el.find '.cropit-image-preview'

          $preview.trigger 'mouseleave'
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled()

        it 'binds onMove() on mousedown', ->
          $el.cropit()
          cropit = $el.data dataKey
          cropit.imageLoaded = true
          cropit.imageSize = w: 8, h: 6
          cropit.previewSize = w: 2, h: 2

          $preview = $el.find '.cropit-image-preview'

          spyOn Cropit.prototype, 'onMove'
          cropit.onPreviewEvent
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

          cropit.onPreviewEvent
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

      describe 'touch event', ->

        it 'is invoked on touchstart on preview', ->
          spyOn Cropit.prototype, 'onPreviewEvent'
          $el.cropit()
          $preview = $el.find '.cropit-image-preview'

          $preview.trigger 'touchstart'
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled()

        it 'is invoked on touchend on preview', ->
          spyOn Cropit.prototype, 'onPreviewEvent'
          $el.cropit()
          $preview = $el.find '.cropit-image-preview'

          $preview.trigger 'touchend'
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled()

        it 'is invoked on touchcancel on preview', ->
          spyOn Cropit.prototype, 'onPreviewEvent'
          $el.cropit()
          $preview = $el.find '.cropit-image-preview'

          $preview.trigger 'touchcancel'
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled()

        it 'is invoked on touchleave on preview', ->
          spyOn Cropit.prototype, 'onPreviewEvent'
          $el.cropit()
          $preview = $el.find '.cropit-image-preview'

          $preview.trigger 'touchleave'
          expect(Cropit.prototype.onPreviewEvent).toHaveBeenCalled()

        it 'binds onMove() on touchstart', ->
          $el.cropit()
          cropit = $el.data dataKey
          cropit.imageLoaded = true
          cropit.imageSize = w: 8, h: 6
          cropit.previewSize = w: 2, h: 2

          $preview = $el.find '.cropit-image-preview'

          spyOn Cropit.prototype, 'onMove'
          cropit.onPreviewEvent
            type: 'touchstart'
            stopPropagation: ->

          $preview.trigger 'touchmove'
          expect(Cropit.prototype.onMove).toHaveBeenCalled()

        it 'moves image by dragging', ->
          $el.cropit()
          cropit = $el.data dataKey
          cropit.imageLoaded = true
          cropit.imageSize = w: 8, h: 6
          cropit.previewSize = w: 2, h: 2
          cropit.setOffset x: 0, y: 0
          spyOn cropit, 'setOffset'

          cropit.onPreviewEvent
            type: 'touchstart'
            clientX: -1
            clientY: -1
            stopPropagation: ->
          expect(cropit.setOffset).not.toHaveBeenCalled()

          cropit.onMove
            type: 'touchmove'
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

    describe 'onZoomSliderChange()', ->

      it 'is invoked mousemove on zoom slider', ->
        spyOn Cropit.prototype, 'onZoomSliderChange'
        $el.cropit()
        $zoomSlider = $el.find 'input.cropit-image-zoom-input'

        $zoomSlider.trigger 'mousemove'
        expect(Cropit.prototype.onZoomSliderChange).toHaveBeenCalled()

      it 'is invoked touchmove on zoom slider', ->
        spyOn Cropit.prototype, 'onZoomSliderChange'
        $el.cropit()
        $zoomSlider = $el.find 'input.cropit-image-zoom-input'

        $zoomSlider.trigger 'touchmove'
        expect(Cropit.prototype.onZoomSliderChange).toHaveBeenCalled()

      it 'is invoked change on zoom slider', ->
        spyOn Cropit.prototype, 'onZoomSliderChange'
        $el.cropit()
        $zoomSlider = $el.find 'input.cropit-image-zoom-input'

        $zoomSlider.trigger 'change'
        expect(Cropit.prototype.onZoomSliderChange).toHaveBeenCalled()

      describe 'when invoked', ->

        beforeEach ->
          $el.cropit()
          cropit = $el.data dataKey
          cropit.imageSize = w: 8, h: 6
          cropit.previewSize = w: 2, h: 2
          cropit.zoom = 1
          cropit.imageLoaded = true
          cropit.setZoom = ->

        it 'updates zoomSliderPos', ->
          cropit.zoomSliderPos = 0
          expect(cropit.zoomSliderPos).not.toBe 1

          $zoomSlider = $el.find 'input.cropit-image-zoom-input'
          $zoomSlider.val 1
          cropit.onZoomSliderChange()
          expect(cropit.zoomSliderPos).toBe 1

        it 'calls setZoom', ->
          spyOn cropit, 'setZoom'
          cropit.onZoomSliderChange()
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
        expect(cropit.offset).not.toEqual x: -1, y: -1
        expect($preview).not.toHaveCss backgroundPosition: '-1px -1px'
        expect($preview).not.toHaveCss backgroundSize: '8px 12px'

        cropit.setZoom 1
        expect(cropit.zoom).toBe 1
        expect(cropit.offset).toEqual x: -1, y: -1
        expect($preview).toHaveCss backgroundPosition: '-1px -1px'
        expect($preview).toHaveCss backgroundSize: '8px 12px'

      it 'keeps zoom in proper range', ->
        expect(cropit.zoom).not.toBe 1
        expect(cropit.offset).not.toEqual x: -1, y: -1
        expect($preview).not.toHaveCss backgroundPosition: '-1px -1px'
        expect($preview).not.toHaveCss backgroundSize: '8px 12px'

        cropit.setZoom 1.5
        expect(cropit.zoom).toBe 1
        expect(cropit.offset).toEqual x: -1, y: -1
        expect($preview).toHaveCss backgroundPosition: '-1px -1px'
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

      it 'offsets background image when border is specified', ->
        $el.cropit
          imageBackground: true
          imageBackgroundBorderWidth: [1, 2, 3, 4]
        $preview = $el.find '.cropit-image-preview'
        $imageBgContainer = $el.find '.cropit-image-background-container'
        expect($imageBgContainer).toHaveCss
          left: '-4px'
          top: '-1px'
          width: "#{$preview.width() + 2 + 4}px"
          height: "#{$preview.height() + 1 + 3}px"

      it 'takes numeric background image border size to make uniform border size', ->
        $el.cropit
          imageBackground: true
          imageBackgroundBorderWidth: 3
        $preview = $el.find '.cropit-image-preview'
        $imageBgContainer = $el.find '.cropit-image-background-container'
        expect($imageBgContainer).toHaveCss
          left: '-3px'
          top: '-3px'
          width: "#{$preview.width() + 2 * 3}px"
          height: "#{$preview.height() + 2 * 3}px"

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
