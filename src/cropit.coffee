defaults =
  exportZoom: 1
  imageBackground: false
  imageBackgroundBorderWidth: 0
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
      .attr
        accept: 'image/*'
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

    @previewSize =
      w: @options.width or @$preview.width()
      h: @options.height or @$preview.height()
    @$preview.width @previewSize.w if @options.width
    @$preview.height @previewSize.h if @options.height

    if @options.imageBackground
      imageBgBorderWidth = @options.imageBackgroundBorderWidth
      $previewContainer = @options.$previewContainer
      @$imageBg = $ '<img />'
        .addClass 'cropit-image-background'
        .attr 'alt', ''
        .css 'position', 'absolute'
      @$imageBgContainer = $ '<div />'
        .addClass 'cropit-image-background-container'
        .css
          position: 'absolute'
          zIndex: 0
          left: -imageBgBorderWidth + window.parseInt @$preview.css 'border-left-width'
          top: -imageBgBorderWidth + window.parseInt @$preview.css 'border-top-width'
          width: @previewSize.w + imageBgBorderWidth * 2
          height: @previewSize.h + imageBgBorderWidth * 2
        .append @$imageBg
      @$imageBgContainer.css overflow: 'hidden' if imageBgBorderWidth > 0
      $previewContainer
        .css 'position', 'relative'
        .prepend @$imageBgContainer
      @$preview.css 'position', 'relative'

    @initialOffset = x: 0, y: 0
    @initialZoom = 0
    @initialSliderPos = 0
    @imageLoaded = false

    @imageSrc = @options.imageState?.src or null
    @setOffset @options.imageState?.offset or @initialOffset
    @zoom = @options.imageState?.zoom or @initialZoom

    @$imageZoomInput.val @initialSliderPos

    @moveContinue = false

    @zoomer = new Zoomer

    @$preview.on 'mousedown mouseup mouseleave', @handlePreviewEvent.bind @
    @$fileInput.on 'change', @onFileChange.bind @
    @$imageZoomInput.on 'mousedown mouseup mousemove', @updateSliderPos.bind @

    @loadImage() if @options.imageState?.src

  onFileChange: ->
    @options.onFileChange?()

    fileReader = new FileReader()
    file = @$fileInput.get(0).files[0]
    if file?.type.match 'image'
      @setImageLoadingClass()

      fileReader.readAsDataURL file
      fileReader.onload = @onFileReaderLoaded.bind @
      fileReader.onerror = @onFileReaderError.bind @

  onFileReaderLoaded: (e) ->
    @imageSrc = e.target.result
    @zoom = @initialZoom
    @offset = @initialOffset
    @loadImage()

  onFileReaderError: ->
    @options.onFileReaderError?()

  loadImage: ->
    @$hiddenImage.attr 'src', @imageSrc

    @options.onImageLoading?()
    @setImageLoadingClass()

    @$hiddenImage.one 'load', @onImageLoaded.bind @
    @$hiddenImage.one 'error', @onImageError.bind @

  onImageLoaded: ->
    @setImageLoadedClass()

    @setOffset @offset
    @$preview.css 'background-image', "url(#{@imageSrc})"
    @$imageBg.attr 'src', @imageSrc if @options.imageBackground

    @imageSize =
      w: @$hiddenImage.width()
      h: @$hiddenImage.height()

    @setupZoomer()

    @imageLoaded = true

    @options.onImageLoaded?()

  onImageError: ->
    @options.onImageError?()

  setImageLoadingClass: ->
    @$preview
      .removeClass 'cropit-image-loaded'
      .addClass 'cropit-image-loading'

  setImageLoadedClass: ->
    @$preview
      .removeClass 'cropit-image-loading'
      .addClass 'cropit-image-loaded'

  handlePreviewEvent: (e) ->
    return unless @imageLoaded
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
      @setOffset
        x: @offset.x + e.clientX - @origin.x
        y: @offset.y + e.clientY - @origin.y

    @origin =
      x: e.clientX
      y: e.clientY

    e.stopPropagation()
    false

  setOffset: (position) ->
    @offset = @fixOffset position
    @$preview.css 'background-position', "#{@offset.x}px #{@offset.y}px"
    if @options.imageBackground
      @$imageBg.css
        left: @offset.x + @options.imageBackgroundBorderWidth
        top: @offset.y + @options.imageBackgroundBorderWidth

  fixOffset: (offset) ->
    return offset unless @imageLoaded

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

  updateSliderPos: ->
    return unless @imageLoaded

    @sliderPos = Number @$imageZoomInput.val()
    newZoom = @zoomer.getZoom @sliderPos
    @setZoom newZoom

  setupZoomer: ->
    @zoomer.setup @imageSize, @previewSize, @options.exportZoom, @options
    @zoom = @fixZoom @zoom
    @setZoom @zoom

    if @isZoomable()
      @$imageZoomInput.removeAttr 'disabled'
      @options.onZoomEnabled?()
    else
      @$imageZoomInput.attr 'disabled', true
      @options.onZoomDisabled?()

  setZoom: (newZoom) ->
    newZoom = @fixZoom newZoom

    updatedWidth = Math.round @imageSize.w * newZoom
    updatedHeight = Math.round @imageSize.h * newZoom

    oldZoom = @zoom

    newX = @previewSize.w / 2 - (@previewSize.w / 2 - @offset.x) * newZoom / oldZoom
    newY = @previewSize.h / 2 - (@previewSize.h / 2 - @offset.y) * newZoom / oldZoom

    @zoom = newZoom
    @setOffset x: newX, y: newY

    @sliderPos = @zoomer.getSliderPos @zoom
    @$imageZoomInput.val @sliderPos

    @$preview.css 'background-size', "#{updatedWidth}px #{updatedHeight}px"
    if @options.imageBackground
      @$imageBg.css
        width: updatedWidth
        height: updatedHeight

  fixZoom: (zoom) ->
    @zoomer.fixZoom zoom

  isZoomable: ->
    @zoomer.isZoomable()

  getCroppedImageData: (options) ->
    return null unless @imageSrc

    exportDefaults =
      type: 'image/png'
      quality: .75
      originalSize: false
    options = $.extend {}, exportDefaults, options

    croppedSize =
      w: @previewSize.w
      h: @previewSize.h

    if @options.fitHeight and not @options.fitWidth and
        @imageSize.w * @zoom < @previewSize.w
      croppedSize.w = @imageSize.w * @zoom
    else if @options.fitWidth and not @options.fitHeight and
        @imageSize.h * @zoom < @previewSize.h
      croppedSize.h = @imageSize.h * @zoom

    exportZoom = if options.originalSize then 1 / @zoom else @options.exportZoom

    $canvas = $ '<canvas />'
      .attr
        style: 'display: none;'
        width: croppedSize.w * exportZoom
        height: croppedSize.h * exportZoom
      .appendTo @$el
    canvasContext = $canvas[0].getContext '2d'

    canvasContext.drawImage @$hiddenImage[0],
      @offset.x * exportZoom,
      @offset.y * exportZoom,
      @zoom * exportZoom * @imageSize.w,
      @zoom * exportZoom * @imageSize.h

    $canvas[0].toDataURL options.type, options.quality

  getImageState: ->
    src: @imageSrc
    offset: @offset
    zoom: @zoom

  getImageSrc: ->
    @imageSrc

  getOffset: ->
    @offset

  getZoom: ->
    @zoom

  getImageSize: ->
    return null unless @imageSize
    width: @imageSize.w
    height: @imageSize.h

  getPreviewSize: ->
    width: @previewSize.w
    height: @previewSize.h

  setPreviewSize: (size) ->
    return unless size?.width > 0 and size?.height > 0

    @previewSize =
      w: size.width
      h: size.height
    @$preview.css
      width: @previewSize.w
      height: @previewSize.h

    if @options.imageBackground
      @$imageBgContainer.css
        width: @previewSize.w + @options.imageBackgroundBorderWidth * 2
        height: @previewSize.h + @options.imageBackgroundBorderWidth * 2

    if @imageLoaded
      @setupZoomer()

  $: (selector) ->
    return null unless @$el
    @$el.find selector
