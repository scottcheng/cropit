dataKey = 'cropit'

methods =

  init: (options) ->
    @each ->
      # Only instantiate once per element
      unless $.data @, dataKey
        cropit = new Cropit @, options
        $.data @, dataKey, cropit

  destroy: ->
    @each ->
      $.removeData @, dataKey

  isZoomable: ->
    cropit = @first().data dataKey
    cropit?.isZoomable()

  export: (options) ->
    cropit = @first().data dataKey
    cropit?.getCroppedImageData options

  imageState: ->
    cropit = @first().data dataKey
    cropit?.getImageState()

  imageSrc: (newImageSrc) ->
    if newImageSrc?
      @each ->
        cropit = $.data @, dataKey
        cropit?.reset()
        cropit?.loadImage newImageSrc
    else
      cropit = @first().data dataKey
      cropit?.getImageSrc()

  offset: (newOffset) ->
    if newOffset? and newOffset.x? and newOffset.y?
      @each ->
        cropit = $.data @, dataKey
        cropit?.setOffset newOffset
    else
      cropit = @first().data dataKey
      cropit?.getOffset()

  zoom: (newZoom) ->
    if newZoom?
      @each ->
        cropit = $.data @, dataKey
        cropit?.setZoom newZoom
    else
      cropit = @first().data dataKey
      cropit?.getZoom()

  imageSize: ->
    cropit = @first().data dataKey
    cropit?.getImageSize()

  previewSize: (newSize) ->
    if newSize?
      @each ->
        cropit = $.data @, dataKey
        cropit?.setPreviewSize newSize
    else
      cropit = @first().data dataKey
      cropit?.getPreviewSize()

  disable: ->
    @each ->
      cropit = $.data @, dataKey
      cropit.disable()

  reenable: ->
    @each ->
      cropit = $.data @, dataKey
      cropit.reenable()

$.fn.cropit = (method) ->
  if methods[method]
    methods[method].apply @, [].slice.call arguments, 1
  else
    methods.init.apply @, arguments
