'use strict';

module.exports = function (grunt) {

  var getGrepOption = function(){
    var grep = grunt.option('grep');
    if(grep){
      console.log('using mocha grep: ' + grep);
      return '?grep=' + grep;
    }
    return '';
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! \n* <%= pkg.title || pkg.name %> - v<%= pkg.version %>' +
            '\n* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> ' +
            '\n* <%= pkg.homepage ? pkg.homepage : "" %> ' +
            '\n*/ \n\n',

    paths: {
      src: "src/",
      dist: "dist/",
      test: "test/",
      specs: "test/specs/"
    },

    clean: {
      before: {
        src: [
          "<%= paths.dist %>*",
          "!<%= paths.dist %>.gitignore"
        ],
      }
    },

    watch: {
      browserified: {
        files: [
          '<%= paths.dist %><%= pkg.name %>.js',
          '<%= paths.test %>browserified_tests.js'
        ],
        tasks: ['jshint', 'mocha_phantomjs']
      }
    },

    browserify: {
      all: {
        options:{
          extension: [ '.js' ]
        },
        src: ['<%= paths.src %>index.js'],
        dest: '<%= paths.dist %><%= pkg.name %>.js'
      },
      tests: {
        src: [ '<%= paths.test %>suite.js' ],
        dest: '<%= paths.test %>browserified_tests.js',
        options: {
          external: [ './<%= pkg.name %>.js' ],
          // Embed source map for tests
          debug: true
        }
      },
      watchify: {
        files: {
          '<%= paths.test %>browserified_tests.js': ['<%= paths.test %>suite.js'],
          '<%= paths.dist %><%= pkg.name %>.js': ['<%= paths.src %>index.js']
        },
        options: {
          debug: true,
          watch: true
        }
      }
    },

    concat: {
      all: {
        options: {
          stripBanners: {
            line: true
          },
          banner: '<%= banner %>',
        },
        files: {
          '<%= paths.dist %><%= pkg.name %>.js': [ '<%= paths.dist %><%= pkg.name %>.js' ]
        }
      }
    },

    uglify: {
      all: {
        options: {
          stripBanners: {
            line: true
          },
          banner: '<%= banner %>',
        },
        files: {
          '<%= paths.dist %><%= pkg.name %>.min.js': [ '<%= paths.dist %><%= pkg.name %>.js' ]
        }
      }
    },

    jshint: {
      all: {
        files: {
          src: ["<%= paths.src %>**/*.js", "<%= paths.specs %>**/*.js"]
        },
        options: {
          jshintrc: '.jshintrc'
        }
      }
    },

    mocha_phantomjs: {
      all: {
        options: {
          'reporter': 'spec',
          urls: ["http://localhost:8000/test/index.html" + getGrepOption()]
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
        }
      }
    }

  });


  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-mocha-phantomjs");
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask("build", [
    "clean:before",
    "jshint",
    "browserify:all",
    "concat"
  ]);

  grunt.registerTask("test", [
    "build",
    "browserify:tests",
    "connect",
    "mocha_phantomjs"
  ]);

  grunt.registerTask("default", "test");
  grunt.registerTask("w", ["test", "browserify:watchify", "watch:browserified"]);
  grunt.registerTask("dist", ["test", "uglify"]);

};
