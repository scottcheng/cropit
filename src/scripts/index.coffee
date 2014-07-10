$splash = $ '.splash'
$splash.cropit
  imageBackground: true
  imageState:
    src: 'http://scottcheng.github.io/cropit/images/0.jpg'
    offset:
      x: -112
      y: 0

$splash.on 'click', '.select-image-btn', ->
  $splash.find('input.cropit-image-input').click()

$splash.on 'click', '.download-btn', ->
  imageData = $splash.cropit 'croppedImageData'
  window.open imageData
