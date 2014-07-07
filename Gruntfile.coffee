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

    clean:
      tmp: '.tmp'

  grunt.registerTask 'default', [
    'coffee'
    'concat'
    'uglify'
    'clean'
  ]
