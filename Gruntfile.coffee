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

    concat:
      dist:
        src: ['.tmp/jquery.cropit.js']
        dest: 'dist/jquery.cropit.js'
      options:
        banner: '<%= meta.banner %>'

    uglify:
      dist:
        src: ['dist/jquery.cropit.js']
        dest: 'dist/jquery.cropit.min.js'
      options:
        banner: '<%= meta.banner %>'

    coffee:
      compile:
        files:
          '.tmp/jquery.cropit.js': 'src/jquery.cropit.coffee'

    coffeelint:
      all: [
        'Gruntfile.coffee'
        'src/*.coffee'
      ]
      options:
        max_line_length: level: 'ignore'
        indentation: level: 'ignore'

    clean:
      tmp: '.tmp'

  grunt.registerTask 'default', [
    'coffeelint'
    'coffee'
    'concat'
    'uglify'
    'clean'
  ]
