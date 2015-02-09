imageUrl = 'http://example.com/image.jpg'
imageData = 'data:image/png;base64,image-data...'

describe 'Cropit', ->

  cropit = null

  it 'sets default options', ->
    cropit = new Cropit
    expect(cropit.options.exportZoom).toBe 1
    expect(cropit.options.imageBackground).toBe false
    expect(cropit.options.imageBackgroundBorderWidth).toBe 0
    expect(cropit.options.imageState).toBe null
    expect(cropit.options.allowCrossOrigin).toBe false
    expect(cropit.options.allowDragNDrop).toBe true
    expect(cropit.options.minZoom).toBe 'fill'
    expect(cropit.options.freeMove).toBe false

  describe 'init()', ->

    it 'enables cross origin image source if allowCrossOrigin is set in options', ->
      cropit = new Cropit null,
        allowCrossOrigin: true
      expect(cropit.image.crossOrigin).toBe 'Anonymous'

    it 'disables cross origin image source if allowCrossOrigin is not set in options', ->
      cropit = new Cropit
      expect(cropit.image.crossOrigin).not.toBe 'Anonymous'

    it 'sets default zoom', ->
      cropit = new Cropit
      expect(cropit.zoom).toBe 0

    it 'sets default offset', ->
      cropit = new Cropit
      expect(cropit.offset).toEqual x: 0, y: 0

    it 'restores imageState', ->
      cropit = new Cropit null,
        imageState:
          src: imageUrl
          offset: x: -1, y: -1
          zoom: .5
      expect(cropit.imageSrc).toBe imageUrl
      expect(cropit.zoom).toBe .5
      expect(cropit.offset).toEqual x: -1, y: -1

    it 'calls loadImage() if image source is present', ->
      cropit = new Cropit null,
        imageState:
          src: imageUrl
      spyOn cropit, 'loadImage'

      cropit.init()
      expect(cropit.loadImage).toHaveBeenCalled()

  describe 'onFileReaderLoaded()', ->

    beforeEach ->
      cropit = new Cropit

    it 'calls loadImage()', ->
      spyOn cropit, 'loadImage'

      cropit.onFileReaderLoaded target: result: imageData
      expect(cropit.loadImage).toHaveBeenCalled()

    it 'sets imageSrc', ->
      cropit.imageSrc = imageUrl
      expect(cropit.imageSrc).not.toBe imageData

      cropit.onFileReaderLoaded target: result: imageData
      expect(cropit.imageSrc).toBe imageData

    it 'resets zoom', ->
      cropit.zoom = 1
      expect(cropit.zoom).not.toBe 0

      cropit.onFileReaderLoaded target: result: imageData
      expect(cropit.zoom).toBe 0

    it 'resets offset', ->
      cropit.offset = x: 1, y: 1
      expect(cropit.offset).not.toEqual x: 0, y: 0

      cropit.onFileReaderLoaded target: result: imageData
      expect(cropit.offset).toEqual x: 0, y: 0

  describe 'loadImage()', ->

    beforeEach ->
      cropit = new Cropit

    it 'sets image source', ->
      expect(cropit.image.src).not.toBe imageData

      cropit.loadImage imageData
      expect(cropit.image.src).toBe imageData

  describe 'onPreviewEvent()', ->

    describe 'mouse event', ->

      previewEvent =
        type: 'mousedown'
        clientX: 1
        clientY: 1
        stopPropagation: ->

      beforeEach ->
        cropit = new Cropit

      it 'sets origin coordinates on mousedown', ->
        expect(cropit.origin).not.toEqual x: 1, y: 1

        cropit.imageLoaded = true
        cropit.onPreviewEvent previewEvent
        expect(cropit.origin).toEqual x: 1, y: 1

      it 'calls stopPropagation()', ->
        spyOn previewEvent, 'stopPropagation'
        cropit.imageLoaded = true
        cropit.onPreviewEvent previewEvent
        expect(previewEvent.stopPropagation).toHaveBeenCalled()

      it 'does nothing before loading image', ->
        spyOn previewEvent, 'stopPropagation'
        cropit.onPreviewEvent previewEvent
        expect(cropit.origin).not.toEqual x: 1, y: 1
        expect(previewEvent.stopPropagation).not.toHaveBeenCalled()

    describe 'touch event', ->

      previewEvent =
        type: 'touchstart'
        originalEvent:
          touches: [
            clientX: 1
            clientY: 1
          ]
        stopPropagation: ->

      beforeEach ->
        cropit = new Cropit

      it 'sets origin coordinates on mousedown', ->
        expect(cropit.origin).not.toEqual x: 1, y: 1

        cropit.imageLoaded = true
        cropit.onPreviewEvent previewEvent
        expect(cropit.origin).toEqual x: 1, y: 1

      it 'calls stopPropagation()', ->
        spyOn previewEvent, 'stopPropagation'
        cropit.imageLoaded = true
        cropit.onPreviewEvent previewEvent
        expect(previewEvent.stopPropagation).toHaveBeenCalled()

      it 'does nothing before loading image', ->
        spyOn previewEvent, 'stopPropagation'
        cropit.onPreviewEvent previewEvent
        expect(cropit.origin).not.toEqual x: 1, y: 1
        expect(previewEvent.stopPropagation).not.toHaveBeenCalled()

  describe 'fixOffset()', ->

    beforeEach ->
      cropit = new Cropit
      cropit.imageLoaded = true

    describe 'fixes x', ->

      it 'fits image to left if image width is less than preview', ->
        cropit.imageSize = w: 1
        cropit.zoom = .5
        cropit.previewSize = w: 1
        offset = cropit.fixOffset x: -1
        expect(offset.x).toBe 0

      it 'fits image to left', ->
        cropit.imageSize = w: 4
        cropit.zoom = .5
        cropit.previewSize = w: 1
        offset = cropit.fixOffset x: 1
        expect(offset.x).toBe 0

      it 'fits image to right', ->
        cropit.imageSize = w: 4
        cropit.zoom = .5
        cropit.previewSize = w: 1
        offset = cropit.fixOffset x: -2
        expect(offset.x).toBe -1

      it 'rounds x', ->
        cropit.imageSize = w: 4
        cropit.zoom = .5
        cropit.previewSize = w: 1
        offset = cropit.fixOffset x: -.12121
        expect(offset.x).toBe -.12

    describe 'fixes y', ->

      it 'fits image to top if image height is less than preview', ->
        cropit.imageSize = h: 1
        cropit.zoom = .5
        cropit.previewSize = h: 1
        offset = cropit.fixOffset y: -1
        expect(offset.y).toBe 0

      it 'fits image to top', ->
        cropit.imageSize = h: 4
        cropit.zoom = .5
        cropit.previewSize = h: 1
        offset = cropit.fixOffset y: 1
        expect(offset.y).toBe 0

      it 'fits image to bottom', ->
        cropit.imageSize = h: 4
        cropit.zoom = .5
        cropit.previewSize = h: 1
        offset = cropit.fixOffset y: -2
        expect(offset.y).toBe -1

      it 'rounds y', ->
        cropit.imageSize = h: 4
        cropit.zoom = .5
        cropit.previewSize = h: 1
        offset = cropit.fixOffset y: -.12121
        expect(offset.y).toBe -.12

  describe 'fixZoom()', ->

    it 'returns zoomer.fixZoom()', ->
      cropit = new Cropit

      cropit.zoomer = fixZoom: -> .1
      expect(cropit.fixZoom()).toBe .1

      cropit.zoomer = fixZoom: -> .5
      expect(cropit.fixZoom()).toBe .5

      cropit.zoomer = fixZoom: -> 1
      expect(cropit.fixZoom()).toBe 1

  describe 'isZoomable()', ->

    it 'returns zoomer.isZoomable', ->
      cropit = new Cropit

      cropit.zoomer = isZoomable: -> true
      expect(cropit.isZoomable()).toBe true

      cropit.zoomer = isZoomable: -> false
      expect(cropit.isZoomable()).toBe false

  describe 'getImageState()', ->

    it 'returns image state', ->
      cropit = new Cropit
      cropit.imageSrc = imageData
      cropit.offset = x: -1, y: -1
      cropit.zoom = .5
      imageState = cropit.getImageState()
      expect(imageState.src).toBe imageData
      expect(imageState.offset).toEqual x: -1, y: -1
      expect(imageState.zoom).toBe .5

  describe 'getImageSrc()', ->

    it 'returns image source', ->
      cropit = new Cropit
      cropit.imageSrc = imageUrl
      expect(cropit.getImageSrc()).toBe imageUrl

  describe 'getOffset()', ->

    it 'returns offset', ->
      cropit = new Cropit
      cropit.offset = x: -2, y: -2
      expect(cropit.getOffset()).toEqual x: -2, y: -2

  describe 'getZoom()', ->

    it 'returns zoom', ->
      cropit = new Cropit
      cropit.zoom = .75
      expect(cropit.getZoom()).toBe .75

  describe 'getImageSize()', ->

    beforeEach ->
      cropit = new Cropit

    it 'returns image size', ->
      cropit.imageSize = w: 1, h: 1
      expect(cropit.getImageSize()).toEqual width: 1, height: 1

    it 'returns null when imageSize is absent', ->
      expect(cropit.getImageSize()).toBe null

  describe 'getPreviewSize()', ->

    beforeEach ->
      cropit = new Cropit

    it 'returns preview size', ->
      cropit.previewSize = w: 1, h: 1
      expect(cropit.getPreviewSize()).toEqual width: 1, height: 1

  describe 'setPreviewSize()', ->

    beforeEach ->
      cropit = new Cropit

    it 'sets preview size', ->
      cropit.previewSize = w: 1, h: 1
      expect(cropit.previewSize).not.toEqual w: 2, h: 2

      cropit.setPreviewSize width: 2, height: 2
      expect(cropit.previewSize).toEqual w: 2, h: 2

    it 'updates zoomer if image is loaded', ->
      cropit.imageLoaded = true
      cropit.imageSize = w: 2, h: 2
      spyOn cropit.zoomer, 'setup'
      cropit.setPreviewSize width: 1, height: 1
      expect(cropit.zoomer.setup).toHaveBeenCalled()
