'use strict';

module.exports = function (grunt) {

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
      specs: "test/specs"
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
      all: {
        files: [
          "<%= paths.src %>**/*",
          "<%= paths.test %>/**/*",
          "!<%= paths.test %>/lib/**/*"
        ],
        tasks: ['watcher']
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
        src: [ 'test/suite.js' ],
        dest: 'test/browserified_tests.js',
        options: {
          external: [ './<%= pkg.name %>.js' ],
          // Embed source map for tests
          debug: true
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
      options: {
        'reporter': 'spec'
      },
      all: ["<%= paths.test %>index.html"]
    }

  });


  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-mocha-phantomjs");

  grunt.registerTask("build", [
    "clean:before",
    "jshint",
    "browserify",
    "concat"
  ]);

  grunt.registerTask("test", [
    "build",
    "mocha_phantomjs"
  ]);

  grunt.registerTask("watcher", [
    "build",
    "test"
  ]);

  grunt.registerTask("default", "test");
  grunt.registerTask("w", ["watcher", "watch"]);
  grunt.registerTask("dist", ["test", "uglify"]);

};
