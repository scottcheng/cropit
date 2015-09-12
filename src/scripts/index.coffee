openFileInput = ->
  @find('input.cropit-image-input').click()
downloadCroppedImage = ->
  imageData = @cropit 'export'
  window.open imageData
onZoomEnabled = ->
  @find('.slider-wrapper').removeClass 'disabled'
onZoomDisabled = ->
  @find('.slider-wrapper').addClass 'disabled'
onImageError = (error, a, b) ->
  if error.code is 1
    @find('.error-msg').text "Please use an image that's at least
      #{@outerWidth()}px in width and #{@outerHeight()}px in height."
    @addClass 'has-error'
    window.setTimeout =>
      @removeClass 'has-error'
    , 3000

# Splash demo
do ->
  $splash = $ '.splash'
  $splash.cropit
    imageBackground: true
    imageState:
      src: 'http://scottcheng.github.io/cropit/images/0-1920.jpg'
      offset:
        x: -112
        y: 0
    onZoomEnabled: onZoomEnabled.bind $splash
    onZoomDisabled: onZoomDisabled.bind $splash
    onImageError: onImageError.bind $splash.find '.cropit-image-preview'

  $splash.on 'click', '.select-image-btn', openFileInput.bind $splash
  $splash.on 'click', '.download-btn', downloadCroppedImage.bind $splash

# Basic demo
do ->
  $demo = $ '.demo-wrapper.basic'
  $demo.cropit
    imageState:
      src: 'http://scottcheng.github.io/cropit/images/1-960.jpg'
      offset:
        x: 0
        y: -125
    onZoomEnabled: onZoomEnabled.bind $demo
    onZoomDisabled: onZoomDisabled.bind $demo
    onImageError: onImageError.bind $demo.find '.cropit-image-preview'

  $demo.on 'click', '.download-btn', downloadCroppedImage.bind $demo

# Custom select image button
do ->
  $demo = $ '.demo-wrapper.custom-button'
  $demo.cropit
    imageState:
      src: 'http://scottcheng.github.io/cropit/images/2-960.jpg'
      offset:
        x: 0
        y: -94
    onZoomEnabled: onZoomEnabled.bind $demo
    onZoomDisabled: onZoomDisabled.bind $demo
    onImageError: onImageError.bind $demo.find '.cropit-image-preview'

  $demo.on 'click', '.select-image-btn', openFileInput.bind $demo
  $demo.on 'click', '.download-btn', downloadCroppedImage.bind $demo

# Image background
do ->
  $demo = $ '.demo-wrapper.image-background'
  $demo.cropit
    imageBackground: true
    imageState:
      src: 'http://scottcheng.github.io/cropit/images/3-960.jpg'
      offset:
        x: 0
        y: -86
    onZoomEnabled: onZoomEnabled.bind $demo
    onZoomDisabled: onZoomDisabled.bind $demo
    onImageError: onImageError.bind $demo.find '.cropit-image-preview'

  $demo.on 'click', '.select-image-btn', openFileInput.bind $demo
  $demo.on 'click', '.download-btn', downloadCroppedImage.bind $demo

# Image background
do ->
  $demo = $ '.demo-wrapper.image-background-border'
  $demo.cropit
    imageBackground: true
    imageBackgroundBorderWidth: 15
    imageState:
      src: 'http://scottcheng.github.io/cropit/images/4-960.jpg'
      offset:
        x: 0
        y: -71
    onZoomEnabled: onZoomEnabled.bind $demo
    onZoomDisabled: onZoomDisabled.bind $demo
    onImageError: onImageError.bind $demo.find '.cropit-image-preview'

  $demo.on 'click', '.select-image-btn', openFileInput.bind $demo
  $demo.on 'click', '.download-btn', downloadCroppedImage.bind $demo
