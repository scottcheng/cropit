dataKey = 'cropit'

methods =

  init: (options) ->
    @each ->
      cropit = new Cropit @, options
      $.data @, dataKey, cropit

  isZoomable: ->
    cropit = @first().data dataKey
    cropit?.isZoomable()

  croppedImageData: ->
    cropit = @first().data dataKey
    cropit?.getCroppedImageData()

  imageState: ->
    cropit = @first().data dataKey
    cropit?.getImageState()

  imageSrc: ->
    cropit = @first().data dataKey
    cropit?.getImageSrc()

  offset: ->
    cropit = @first().data dataKey
    cropit?.getOffset()

  zoom: (newZoom) ->
    if arguments.length
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
    if arguments.length
      @each ->
        cropit = $.data @, dataKey
        cropit?.setPreviewSize newSize
    else
      cropit = @first().data dataKey
      cropit?.getPreviewSize()

$.fn.cropit = (method) ->
  if methods[method]
    methods[method].apply @, [].slice.call arguments, 1
  else
    methods.init.apply @, arguments
