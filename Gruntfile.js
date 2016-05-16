module.exports = function(grunt) {
//  grunt.loadNpmTasks('grunt-contrib-watch');
//  grunt.loadNpmTasks('grunt-contrib-jshint');
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      parser: {
        src: 'src/scripts/**/*.js'
      }
    },
    concat: {
      parser: {
        files: {
          "lrcParser.js": 'src/scripts/parser/*.js',
          "contextMenu.js": 'src/scripts/contextmenu/*.js'
        }
      }
    },
    uglify: {
      options: {
        compress: {
          dead_code: true,
        }
      },
      compress: {
        src: '<%= concat.parser.files %>',
        dest: '<%= concat.parser.files %>'.replace('.js', 'min.js')
      }
    },
    connect: {
      server: {
        options: {
          base: 'www',
          port: 80,
          keepalive: true,
          open: {
            target: "http://localhost"
          }
        }
      }
    },
    watch: {
      parser: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'concat']
      },
      reload: {
        files: ['www/**'],
        tasks: ['connect']
      }
    }
  });

  grunt.registerTask('default', ['watch:parser']);
  grunt.registerTask('reload', ['watch:reload']);
};
