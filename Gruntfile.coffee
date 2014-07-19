module.exports = (grunt) ->

  require('load-grunt-tasks') grunt

  grunt.initConfig

    pkg: grunt.file.readJSON 'cropit.jquery.json'

    meta:
      banner: '/*\n' +
        ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
        ' *  <%= pkg.description %>\n' +
        ' *  <%= pkg.homepage %>\n' +
        ' *\n' +
        ' *  Made by <%= pkg.author.name %>\n' +
        ' *  Based on https://github.com/yufeiliu/simple_image_uploader\n' +
        ' *  Under <%= pkg.licenses[0].type %> License\n' +
        ' */\n'

    uglify:
      options:
        enclose: 'window.jQuery': '$'
        banner: '<%= meta.banner %>'
      dist:
        options:
          mangle: false
          beautify: true
          compress: false
        src: [
          '.tmp/src/zoomer.js'
          '.tmp/src/cropit.js'
          '.tmp/src/plugin.js'
        ]
        dest: 'dist/jquery.cropit.js'
      distMin:
        options:
          mangle: true
          compress: true
        src: [
          '.tmp/src/zoomer.js'
          '.tmp/src/cropit.js'
          '.tmp/src/plugin.js'
        ]
        dest: 'dist/jquery.cropit.min.js'

    coffee:
      options:
        bare: true
      src:
        files:
          '.tmp/src/zoomer.js': 'src/zoomer.coffee'
          '.tmp/src/cropit.js': 'src/cropit.coffee'
          '.tmp/src/plugin.js': 'src/plugin.coffee'
      test:
        files:
          '.tmp/test/zoomer.spec.js': 'test/zoomer.spec.coffee'
          '.tmp/test/cropit.spec.js': 'test/cropit.spec.coffee'
          '.tmp/test/cropit_view.spec.js': 'test/cropit_view.spec.coffee'

    coffeelint:
      all: [
        'Gruntfile.coffee'
        'src/*.coffee'
        'test/*.coffee'
      ]
      options:
        max_line_length: level: 'ignore'
        indentation: level: 'ignore'

    jasmine:
      test:
        src: '.tmp/src/*.js'
        options:
          vendor: [
            'bower_components/jquery/dist/jquery.js'
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
          ]
          specs: '.tmp/test/*.spec.js'

    clean:
      tmp: '.tmp'

  grunt.registerTask 'build', [
    'coffeelint'
    'coffee'
    'uglify'
    'clean'
  ]

  grunt.registerTask 'test', [
    'coffeelint'
    'coffee'
    'jasmine'
    'clean'
  ]

  grunt.registerTask 'default', [
    'test'
    'build'
  ]
