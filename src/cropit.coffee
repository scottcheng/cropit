defaults =
  exportZoom: 1
  imageBackground: false
  imageBackgroundBorderSize: 0
  imageState: null

class Cropit
  constructor: (@element, options) ->
    @$el = $ @element

    dynamicDefaults =
      $fileInput: @$ 'input.cropit-image-input'
      $preview: @$ '.cropit-image-preview'
      $imageZoomInput: @$ 'input.cropit-image-zoom-input'
      $previewContainer: @$ '.cropit-image-preview-container'

    @options = $.extend {}, defaults, dynamicDefaults, options
    @_defaults = defaults
    @init()

  init: ->
    @$fileInput = @options.$fileInput
    @$preview = @options.$preview
      .css
        backgroundRepeat: 'no-repeat'
    @$imageZoomInput = @options.$imageZoomInput
      .attr
        min: 0
        max: 1
        step: .01
    @$hiddenImage = $ '<img />'
      .addClass 'cropit-image-hidden-preview'
      .attr
        alt: ''
        style: 'display: none;'
      .appendTo @$el

    @$preview.width @options.width if @options.width
    @$preview.height @options.height if @options.height
    @previewSize =
      w: @options.width or @$preview.width()
      h: @options.height or @$preview.height()

    if @options.imageBackground
      imageBgBorderSize = @options.imageBackgroundBorderSize
      $previewContainer = @options.$previewContainer
      @$imageBg = $ '<img />'
        .addClass 'cropit-image-background'
        .attr 'alt', ''
        .css 'position', 'absolute'
      $imageBgContainer = $ '<div />'
        .addClass 'cropit-image-background-container'
        .css
          position: 'absolute'
          zIndex: 0
          top: -imageBgBorderSize
          left: -imageBgBorderSize
          width: @previewSize.w + imageBgBorderSize * 2
          height: @previewSize.h + imageBgBorderSize * 2
        .append @$imageBg
      $previewContainer
        .css 'position', 'relative'
        .prepend $imageBgContainer
      @$preview.css 'position', 'relative'
      @imageBgPreviewOffset =
        x: imageBgBorderSize + window.parseInt @$preview.css 'border-left-width'
        y: imageBgBorderSize + window.parseInt @$preview.css 'border-top-width'

    @initialZoomSliderPos = 0
    @disabled = true

    @imageSrc = @options.imageState?.src or null
    @offset = @options.imageState?.offset or x: 0, y: 0
    @zoom = @options.imageState?.zoom or null
    @sliderPos = @options.imageState?.sliderPos or @initialZoomSliderPos

    @$imageZoomInput.val @sliderPos

    @moveContinue = false

    @zoomer = new Zoomer

    @$preview.on 'mousedown mouseup mouseleave', @handlePreviewEvent.bind @
    @$fileInput.on 'change', @onFileChange.bind @
    @$imageZoomInput.on 'change mousemove', @updateImageZoom.bind @

    @loadImage() if @options.imageState?.src

  onFileChange: ->
    @options.onFileChange?()

    oFReader = new FileReader()
    file = @$fileInput.get(0).files[0]
    oFReader.readAsDataURL file
    oFReader.onload = @onFileReaderLoaded.bind @

  onFileReaderLoaded: (e) ->
    @imageSrc = e.target.result
    @sliderPos = @initialZoomSliderPos
    @offset = x: 0, y: 0
    @loadImage()

  loadImage: ->
    @$hiddenImage.attr 'src', @imageSrc

    @$preview.css 'background-image', "url(#{@imageSrc})"

    @options.onImageLoading?()

    @$hiddenImage.load @onImageLoaded.bind @

  onImageLoaded: ->
    @$imageBg.attr 'src', @imageSrc if @options.imageBackground

    @imageSize =
      w: @$hiddenImage.width()
      h: @$hiddenImage.height()

    @zoomer.setup @imageSize, @previewSize, @options.exportZoom, @options

    @$imageZoomInput.val @sliderPos
    @zoom = @zoomer.getZoom @sliderPos
    @updateImageZoom()

    @disabled = false

    @options.onImageLoaded?()

  handlePreviewEvent: (e) ->
    return if @disabled
    @moveContinue = false
    @$preview.off 'mousemove'

    if e.type is 'mousedown'
      @origin =
        x: e.clientX
        y: e.clientY
      @moveContinue = true
      @$preview.on 'mousemove', @onMove.bind @
    else
      $(document.body).focus()
    e.stopPropagation()
    false

  onMove: (e) ->
    if @moveContinue
      @updateImageOffset
        x: @offset.x + e.clientX - @origin.x
        y: @offset.y + e.clientY - @origin.y

    @origin =
      x: e.clientX
      y: e.clientY

    e.stopPropagation()
    false

  updateImageOffset: (position) ->
    return unless @imageSize?.w and @imageSize?.h

    @offset = @fixOffset position
    @$preview.css 'background-position', "#{@offset.x}px #{@offset.y}px"
    if @options.imageBackground
      @$imageBg.css
        left: @offset.x + @imageBgPreviewOffset.x
        top: @offset.y + @imageBgPreviewOffset.y

  fixOffset: (offset) ->
    ret = x: offset.x, y: offset.y

    if @imageSize.w * @zoom <= @previewSize.w
      ret.x = 0
    else if ret.x > 0
      ret.x = 0
    else if ret.x + @imageSize.w * @zoom < @previewSize.w
      ret.x = @previewSize.w - @imageSize.w * @zoom

    if @imageSize.h * @zoom <= @previewSize.h
      ret.y = 0
    else if ret.y > 0
      ret.y = 0
    else if ret.y + @imageSize.h * @zoom < @previewSize.h
      ret.y = @previewSize.h - @imageSize.h * @zoom

    ret.x = Math.round(ret.x)
    ret.y = Math.round(ret.y)

    ret

  updateImageZoom: ->
    return unless @imageSize?.w and @imageSize?.h

    @sliderPos = Number @$imageZoomInput.val()
    newZoom = @zoomer.getZoom @sliderPos
    updatedWidth = Math.round @imageSize.w * newZoom
    updatedHeight = Math.round @imageSize.h * newZoom

    oldZoom = @zoom

    newX = @imageSize.w * oldZoom / 2 + @offset.x - updatedWidth / 2
    newY = @imageSize.h * oldZoom / 2 + @offset.y - updatedHeight / 2

    @zoom = newZoom
    @updateImageOffset x: newX, y: newY

    @$preview.css 'background-size', "#{updatedWidth}px #{updatedHeight}px"
    if @options.imageBackground
      @$imageBg.css
        width: updatedWidth
        height: updatedHeight

  isZoomable: ->
    @zoomer.isZoomable()

  getCroppedImageData: ->
    return null unless @imageSrc

    croppedSize =
      w: @previewSize.w
      h: @previewSize.h

    if @options.fitHeight and not @options.fitWidth and
        @imageSize.w * @zoom < @previewSize.w
      croppedSize.w = @imageSize.w * @zoom
    else if @options.fitWidth and not @options.fitHeight and
        @imageSize.h * @zoom < @previewSize.h
      croppedSize.h = @imageSize.h * @zoom

    $canvas = $ '<canvas />'
      .attr
        style: 'display: none;'
        width: croppedSize.w * @options.exportZoom
        height: croppedSize.h * @options.exportZoom
      .appendTo @$el
    canvasContext = $canvas[0].getContext '2d'

    canvasContext.drawImage @$hiddenImage[0],
      @offset.x * @options.exportZoom,
      @offset.y * @options.exportZoom,
      @zoom * @options.exportZoom * @imageSize.w,
      @zoom * @options.exportZoom * @imageSize.h

    $canvas[0].toDataURL()

  getImageState: ->
    src: @imageSrc
    offset: @offset
    zoom: @zoom
    sliderPos: @sliderPos

  getImageSize: ->
    return null unless @imageSize
    width: @imageSize.w
    height: @imageSize.h

  $: (selector) ->
    return null unless @$el
    @$el.find selector
