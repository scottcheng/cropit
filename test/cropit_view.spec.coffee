jasmine.getFixtures().fixturesPath = 'test'

describe 'Cropit View', ->

  $el = null

  beforeEach ->
    loadFixtures 'fixture.html'
    $el = $ '.image-editor'

  it 'should', ->
    $el.cropit()
    expect($el).not.toHaveClass 'abc'
