/*
 * src
 *
 * hipstersmoothie
 * https://github.com/alisowski/src
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
'use strict';

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg   : grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    site  : grunt.file.readYAML('_config.yml'),
    bootstrap: '<%= vendor %>/bootstrap',


    // Before generating any new files, remove files from previous build.
    clean: {
      default: ['<%= site.dest %>/*.html']
    },


    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'templates/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    copy: {
      assets: {
        files: [
          {expand: true, cwd: '<%= bootstrap %>/css', src: ['bootstrap.css'], dest: '<%= site.assets %>/css/'},
          {expand: true, cwd: '<%= bootstrap %>/fonts', src: ['*.*'], dest: '<%= site.assets %>/fonts/'},
          {expand: true, cwd: '<%= bootstrap %>/js',    src: ['bootstrap.js'], dest: '<%= site.assets %>/js/'}
        ]
      }
    },

    // Build HTML from templates and data
    assemble: {
      options: {
        layout: '<%= site.layout %>',
        layoutdir: '<%= site.layouts %>',
        partials: '<%= site.includes %>',

        flatten: true,
        production: false,
        assets: '<%= site.assets %>',

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>'],
                
        // Extensions
        helpers: '<%= site.helpers %>',
        plugins: '<%= site.plugins %>',

        collections: [{
          name: 'post',
          sortby: 'posted',
          sortorder: 'descending'
        }]
      },
      posts: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/*.hbs', 
                                      '<%= site.content %>/*.hbs',
                                      '<%= site.content %>/blog/*',
                                      '<%= site.content %>/_pages/*.hbs']}
      }
    },


    // Compile LESS to CSS
    less: {
      options: {
        vendor: 'vendor',
        paths: [
          '<%= site.theme %>',
          '<%= site.theme %>/components',
          '<%= site.theme %>/utils'
        ],
      },
      site: {
        src: ['<%= site.theme %>/site.less'],
        dest: '<%= site.assets %>/css/site.css'
      }
    },
    
    watch: {
      options: {
         livereload: true
      },
      site: {
        files: ['Gruntfile.js', '<%= less.options.paths %>/*.less', 'templates/**/*.hbs', 'templates/*.hbs', 'theme/**/*.less', 'theme/*.less' ],
        tasks: ['assemble']
      }
   },

     connect: {
      dev: {
        options: {
          port: 8000,
          base: './hipstersmoothie/'
        }
      }
    }
  });
  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-sync-pkg');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Run this task once, then delete it as well as all of the "once" targets.
  grunt.registerTask('setup', ['copy:once', 'clean:once']);

  // Build HTML, compile LESS and watch for changes. You must first run "bower install"
  // or install Bootstrap to the "vendor" directory before running this command.
  grunt.registerTask('design', ['clean', 'assemble', 'less', 'watch']);

  grunt.registerTask('docs', ['readme', 'sync']);

  grunt.registerTask('default', ['clean', 'jshint', 'copy:assets', 'assemble', 'less', 'docs']);
};
