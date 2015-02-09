class Zoomer
  setup: (imageSize, previewSize, exportZoom = 1, options) ->
    widthRatio = previewSize.w / imageSize.w
    heightRatio = previewSize.h / imageSize.h

    if options?.minZoom is 'fit'
      @minZoom = if widthRatio < heightRatio then widthRatio else heightRatio
    else
      @minZoom = if widthRatio < heightRatio then heightRatio else widthRatio

    @maxZoom = if @minZoom < 1 / exportZoom then 1 / exportZoom else @minZoom

  getZoom: (sliderPos) ->
    return null unless @minZoom and @maxZoom
    sliderPos * (@maxZoom - @minZoom) + @minZoom

  getSliderPos: (zoom) ->
    return null unless @minZoom and @maxZoom
    if @minZoom is @maxZoom
      0
    else
      (zoom - @minZoom) / (@maxZoom - @minZoom)

  isZoomable: ->
    return null unless @minZoom and @maxZoom
    @minZoom isnt @maxZoom

  fixZoom: (zoom) ->
    return @minZoom if zoom < @minZoom
    return @maxZoom if zoom > @maxZoom
    zoom
