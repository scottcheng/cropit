class Cropit

  @_DEFAULTS:
    exportZoom: 1
    imageBackground: false
    imageBackgroundBorderWidth: 0
    imageState: null
    allowCrossOrigin: false
    allowDragNDrop: true
    freeMove: false
    minZoom: 'fill'

  @PREVIEW_EVENTS: do ->
    [
      'mousedown', 'mouseup', 'mouseleave'
      'touchstart', 'touchend', 'touchcancel', 'touchleave'
    ]
      .map (type) -> "#{type}.cropit"
      .join ' '
  @PREVIEW_MOVE_EVENTS: 'mousemove.cropit touchmove.cropit'
  @ZOOM_INPUT_EVENTS: do ->
    [
      'mousemove', 'touchmove', 'change'
    ]
      .map (type) -> "#{type}.cropit"
      .join ' '

  constructor: (@element, options) ->
    @$el = $ @element

    dynamicDefaults =
      $fileInput: @$ 'input.cropit-image-input'
      $preview: @$ '.cropit-image-preview'
      $zoomSlider: @$ 'input.cropit-image-zoom-input'
      $previewContainer: @$ '.cropit-image-preview-container'

    @options = $.extend {}, Cropit._DEFAULTS, dynamicDefaults, options
    @init()

  init: ->
    @image = new Image
    @image.crossOrigin = 'Anonymous' if @options.allowCrossOrigin

    @$fileInput = @options.$fileInput
      .attr
        accept: 'image/*'
    @$preview = @options.$preview
      .css
        backgroundRepeat: 'no-repeat'
    @$zoomSlider = @options.$zoomSlider
      .attr
        min: 0
        max: 1
        step: .01

    @previewSize =
      w: @options.width or @$preview.width()
      h: @options.height or @$preview.height()
    @$preview.width @previewSize.w if @options.width
    @$preview.height @previewSize.h if @options.height

    if @options.imageBackground
      if $.isArray @options.imageBackgroundBorderWidth
        @imageBgBorderWidthArray = @options.imageBackgroundBorderWidth
      else
        @imageBgBorderWidthArray = []
        [0..3].forEach (i) =>
          @imageBgBorderWidthArray[i] = @options.imageBackgroundBorderWidth

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
          left: -@imageBgBorderWidthArray[3] + window.parseInt @$preview.css 'border-left-width'
          top: -@imageBgBorderWidthArray[0] + window.parseInt @$preview.css 'border-top-width'
          width: @previewSize.w + @imageBgBorderWidthArray[1] + @imageBgBorderWidthArray[3]
          height: @previewSize.h + @imageBgBorderWidthArray[0] + @imageBgBorderWidthArray[2]
        .append @$imageBg
      @$imageBgContainer.css overflow: 'hidden' if @imageBgBorderWidthArray[0] > 0
      $previewContainer
        .css 'position', 'relative'
        .prepend @$imageBgContainer
      @$preview.css 'position', 'relative'

      @$preview.hover =>
        @$imageBg.addClass 'cropit-preview-hovered'
      , =>
        @$imageBg.removeClass 'cropit-preview-hovered'

    @initialOffset = x: 0, y: 0
    @initialZoom = 0
    @initialZoomSliderPos = 0
    @imageLoaded = false

    @moveContinue = false

    @zoomer = new Zoomer

    jQuery.event.props.push 'dataTransfer' if @options.allowDragNDrop
    @bindListeners()

    @$zoomSlider.val @initialZoomSliderPos
    @setOffset @options.imageState?.offset or @initialOffset
    @zoom = @options.imageState?.zoom or @initialZoom
    @loadImage @options.imageState?.src or null

  bindListeners: ->
    @$fileInput.on 'change.cropit', @onFileChange.bind @
    @$preview.on Cropit.PREVIEW_EVENTS, @onPreviewEvent.bind @
    @$zoomSlider.on Cropit.ZOOM_INPUT_EVENTS, @onZoomSliderChange.bind @

    if @options.allowDragNDrop
      @$preview.on 'dragover.cropit dragleave.cropit', @onDragOver.bind @
      @$preview.on 'drop.cropit', @onDrop.bind @

  unbindListeners: ->
    @$fileInput.off 'change.cropit'
    @$preview.off Cropit.PREVIEW_EVENTS
    @$preview.off 'dragover.cropit dragleave.cropit drop.cropit'
    @$zoomSlider.off Cropit.ZOOM_INPUT_EVENTS

  reset: ->
    @zoom = @initialZoom
    @offset = @initialOffset

  onFileChange: ->
    @options.onFileChange?()

    @loadFileReader @$fileInput.get(0).files[0]

  loadFileReader: (file) ->
    fileReader = new FileReader()
    if file?.type.match 'image'
      @setImageLoadingClass()

      fileReader.readAsDataURL file
      fileReader.onload = @onFileReaderLoaded.bind @
      fileReader.onerror = @onFileReaderError.bind @
    else if file?
      @onFileReaderError()

  onFileReaderLoaded: (e) ->
    @reset()
    @loadImage e.target.result

  onFileReaderError: ->
    @options.onFileReaderError?()

  onDragOver: (e) ->
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    @$preview.toggleClass 'cropit-drag-hovered', e.type is 'dragover'

  onDrop: (e) ->
    e.preventDefault()
    e.stopPropagation()

    files = Array.prototype.slice.call e.dataTransfer.files, 0
    files.some (file) =>
      if file.type.match 'image'
        @loadFileReader file
        return true

    @$preview.removeClass 'cropit-drag-hovered'

  loadImage: (imageSrc) ->
    @imageSrc = imageSrc
    return unless @imageSrc

    @options.onImageLoading?()
    @setImageLoadingClass()

    @image.onload = @onImageLoaded.bind @
    @image.onerror = @onImageError.bind @

    @image.src = @imageSrc

  onImageLoaded: ->
    @setImageLoadedClass()

    @setOffset @offset
    @$preview.css 'background-image', "url(#{@imageSrc})"
    @$imageBg.attr 'src', @imageSrc if @options.imageBackground

    @imageSize =
      w: @image.width
      h: @image.height

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

  getEventPosition: (e) ->
    e = e.originalEvent?.touches?[0] if e.originalEvent?.touches?[0]
    return x: e.clientX, y: e.clientY if e.clientX and e.clientY

  onPreviewEvent: (e) ->
    return unless @imageLoaded
    @moveContinue = false
    @$preview.off Cropit.PREVIEW_MOVE_EVENTS

    if e.type is 'mousedown' or e.type is 'touchstart'
      @origin = @getEventPosition e
      @moveContinue = true
      @$preview.on Cropit.PREVIEW_MOVE_EVENTS, @onMove.bind @
    else
      $(document.body).focus()
    e.stopPropagation()
    false

  onMove: (e) ->
    eventPosition = @getEventPosition e

    if @moveContinue and eventPosition
      @setOffset
        x: @offset.x + eventPosition.x - @origin.x
        y: @offset.y + eventPosition.y - @origin.y

    @origin = eventPosition

    e.stopPropagation()
    false

  setOffset: (position) ->
    @offset = @fixOffset position
    @$preview.css 'background-position', "#{@offset.x}px #{@offset.y}px"
    if @options.imageBackground
      @$imageBg.css
        left: @offset.x + @imageBgBorderWidthArray[3]
        top: @offset.y + @imageBgBorderWidthArray[0]

  fixOffset: (offset) ->
    return offset unless @imageLoaded

    ret = x: offset.x, y: offset.y

    unless @options.freeMove
      if @imageSize.w * @zoom >= @previewSize.w
        ret.x = Math.min 0, Math.max ret.x, @previewSize.w - @imageSize.w * @zoom
      else
        ret.x = Math.max 0, Math.min ret.x, @previewSize.w - @imageSize.w * @zoom

      if @imageSize.h * @zoom >= @previewSize.h
        ret.y = Math.min 0, Math.max ret.y, @previewSize.h - @imageSize.h * @zoom
      else
        ret.y = Math.max 0, Math.min ret.y, @previewSize.h - @imageSize.h * @zoom

    ret.x = @round ret.x
    ret.y = @round ret.y

    ret

  onZoomSliderChange: ->
    return unless @imageLoaded

    @zoomSliderPos = Number @$zoomSlider.val()
    newZoom = @zoomer.getZoom @zoomSliderPos
    @setZoom newZoom

  enableZoomSlider: ->
    @$zoomSlider.removeAttr 'disabled'
    @options.onZoomEnabled?()

  disableZoomSlider: ->
    @$zoomSlider.attr 'disabled', true
    @options.onZoomDisabled?()

  setupZoomer: ->
    @zoomer.setup @imageSize, @previewSize, @options.exportZoom, @options
    @zoom = @fixZoom @zoom
    @setZoom @zoom

    if @isZoomable() then @enableZoomSlider() else @disableZoomSlider()

  setZoom: (newZoom) ->
    newZoom = @fixZoom newZoom

    updatedWidth = @round @imageSize.w * newZoom
    updatedHeight = @round @imageSize.h * newZoom

    oldZoom = @zoom

    newX = @previewSize.w / 2 - (@previewSize.w / 2 - @offset.x) * newZoom / oldZoom
    newY = @previewSize.h / 2 - (@previewSize.h / 2 - @offset.y) * newZoom / oldZoom

    @zoom = newZoom
    @setOffset x: newX, y: newY

    @zoomSliderPos = @zoomer.getSliderPos @zoom
    @$zoomSlider.val @zoomSliderPos

    @$preview.css 'background-size', "#{updatedWidth}px #{updatedHeight}px"
    if @options.imageBackground
      @$imageBg.css
        width: updatedWidth
        height: updatedHeight

  fixZoom: (zoom) ->
    @zoomer.fixZoom zoom

  isZoomable: ->
    @zoomer.isZoomable()

  getCroppedImageData: (exportOptions) ->
    return null unless @imageSrc

    exportDefaults =
      type: 'image/png'
      quality: .75
      originalSize: false
      fillBg: '#fff'
    exportOptions = $.extend {}, exportDefaults, exportOptions

    croppedSize =
      w: @previewSize.w
      h: @previewSize.h

    exportZoom = if exportOptions.originalSize then 1 / @zoom else @options.exportZoom

    canvas = $ '<canvas />'
      .attr
        width: croppedSize.w * exportZoom
        height: croppedSize.h * exportZoom
      .get 0
    canvasContext = canvas.getContext '2d'

    if exportOptions.type is 'image/jpeg'
      canvasContext.fillStyle = exportOptions.fillBg
      canvasContext.fillRect 0, 0, canvas.width, canvas.height

    canvasContext.drawImage @image,
      @offset.x * exportZoom,
      @offset.y * exportZoom,
      @zoom * exportZoom * @imageSize.w,
      @zoom * exportZoom * @imageSize.h

    canvas.toDataURL exportOptions.type, exportOptions.quality

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
        width: @previewSize.w + @imageBgBorderWidthArray[1] + @imageBgBorderWidthArray[3]
        height: @previewSize.h + @imageBgBorderWidthArray[0] + @imageBgBorderWidthArray[2]

    if @imageLoaded
      @setupZoomer()

  disable: ->
    @unbindListeners()
    @disableZoomSlider()
    @$el.addClass 'cropit-disabled'

  reenable: ->
    @bindListeners()
    @enableZoomSlider()
    @$el.removeClass 'cropit-disabled'

  round: (x) -> +(Math.round(x * 1e2)  + 'e-2')

  $: (selector) ->
    return null unless @$el
    @$el.find selector
