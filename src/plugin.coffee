dataKey = 'cropit'

methods =

  init: (options) ->
    @each ->
      cropit = new Cropit @, options
      $.data @, dataKey, cropit

  isZoomable: ->
    cropit = @first().data dataKey
    cropit?.isZoomable()

  getCroppedImageData: ->
    cropit = @first().data dataKey
    cropit?.getCroppedImageData()

  getImageState: ->
    cropit = @first().data dataKey
    cropit?.getImageState()

  getImageSize: ->
    cropit = @first().data dataKey
    cropit?.getImageSize()

$.fn.cropit = (method) ->
  if methods[method]
    methods[method].apply @, [].slice.call arguments, 1
  else
    methods.init.apply @, arguments
