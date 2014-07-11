openFileInput = ->
  $(@).find('input.cropit-image-input').click()
downloadCroppedImage = ->
  imageData = @cropit 'croppedImageData'
  window.open imageData


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

  $demo.on 'click', '.select-image-btn', openFileInput.bind $demo
  $demo.on 'click', '.download-btn', downloadCroppedImage.bind $demo

# Image background
do ->
  $demo = $ '.demo-wrapper.image-background-border'
  $demo.cropit
    imageBackground: true
    imageBackgroundBorderSize: 20
    imageState:
      src: 'http://scottcheng.github.io/cropit/images/4-960.jpg'
      offset:
        x: 0
        y: -140

  $demo.on 'click', '.select-image-btn', openFileInput.bind $demo
  $demo.on 'click', '.download-btn', downloadCroppedImage.bind $demo
