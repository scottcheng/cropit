describe 'Zoomer', ->

  zoomer = null

  beforeEach ->
    zoomer = new Zoomer

  describe 'setup()', ->

    it 'sets minZoom to the larger of widthRatio and heightRatio', ->
      zoomer.setup
        w: 4, h: 2
      , w: 1, h: 1
      expect(zoomer.minZoom).toBe .5

      zoomer.setup
        w: 2, h: 4
      , w: 1, h: 1
      expect(zoomer.minZoom).toBe .5

      zoomer.setup
        w: 2, h: 2
      , w: 1, h: 1
      expect(zoomer.minZoom).toBe .5

    it 'sets minZoom to widthRatio when fitWidth is true', ->
      zoomer.setup
        w: 4, h: 2
      , w: 1, h: 1
      , 1
      , fitWidth: true
      expect(zoomer.minZoom).toBe .25

    it 'sets minZoom to heightRatio when fitHeight is true', ->
      zoomer.setup
        w: 2, h: 4
      , w: 1, h: 1
      , 1
      , fitHeight: true
      expect(zoomer.minZoom).toBe .25

    it 'sets minZoom to the smaller of widthRatio and heightRatio when fitWidth and fitHeight are both true', ->
      zoomer.setup
        w: 4, h: 2
      , w: 1, h: 1
      , 1
      , fitWidth: true, fitHeight: true
      expect(zoomer.minZoom).toBe .25

      zoomer.setup
        w: 2, h: 4
      , w: 1, h: 1
      , 1
      , fitWidth: true, fitHeight: true
      expect(zoomer.minZoom).toBe .25

      zoomer.setup
        w: 2, h: 2
      , w: 1, h: 1
      , 1
      , fitWidth: true, fitHeight: true
      expect(zoomer.minZoom).toBe .5

    it 'sets maxZoom to minZoom if image is smaller than preview', ->
      zoomer.setup
        w: 4, h: 2
      , w: 5, h: 5
      expect(zoomer.maxZoom).toBe zoomer.minZoom

    it 'sets maxZoom to 1 if image is larger than preview', ->
      zoomer.setup
        w: 4, h: 2
      , w: 1, h: 1
      expect(zoomer.maxZoom).toBe 1

    it 'scales maxZoom in inverse proportion to exportZoom', ->
      zoomer.setup
        w: 8, h: 4
      , w: 1, h: 1
      , 2
      expect(zoomer.maxZoom).toBe .5

  describe 'getZoom()', ->

    it 'returns null when before set up', ->
      expect(zoomer.getZoom()).toBe null

    it 'returns proper zoom level', ->
      zoomer.minZoom = .5
      zoomer.maxZoom = 1

      expect(zoomer.getZoom(0)).toBe .5
      expect(zoomer.getZoom(.5)).toBe .75
      expect(zoomer.getZoom(1)).toBe 1

  describe 'isZoomable()', ->

    it 'returns null when before set up', ->
      expect(zoomer.isZoomable()).toBe null

    it 'returns true when image is bigger than preview', ->
      zoomer.setup
        w: 2, h: 2
      , w: 1, h: 1
      expect(zoomer.isZoomable()).toBe true

    it 'returns false when image is the same size as preview', ->
      zoomer.setup
        w: 1, h: 1
      , w: 1, h: 1
      expect(zoomer.isZoomable()).toBe false

    it 'returns false when image has the same width as preview', ->
      zoomer.setup
        w: 1, h: 2
      , w: 1, h: 1
      expect(zoomer.isZoomable()).toBe false

    it 'returns false when image has the same height as preview', ->
      zoomer.setup
        w: 2, h: 1
      , w: 1, h: 1
      expect(zoomer.isZoomable()).toBe false

    it 'returns false when image is smaller than preview', ->
      zoomer.setup
        w: 1, h: 1
      , w: 2, h: 2
      expect(zoomer.isZoomable()).toBe false
