/*global module:false*/
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-rigger');
  
  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'build/StyleManager.js', 'test/StyleManagerTest.js', 'build/css.js']
    },
    watch: {
      files: 'src/**/*.js',
      tasks: 'build'
    },
    rig: {
      build: {
        src: ['src/wrapper.js'],
        dest: 'build/StyleManager.js'
      },
      plugin: {
        src: ['src/plugin-wrapper.js'],
        dest: 'build/css.js'
      }
    },
    min: {
      dist: {
        src: ['build/StyleManager.js'],
        dest: 'build/StyleManager.min.js'
      },
      plugin: {
        src: ['build/css.js'],
        dest: 'build/css.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        strict: false,
        browser: true
      },
      globals: {
        it: true,
        expect: true,
        beforeEach: true,
        describe: true,
        StyleManager: true,
        define: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'build');
  
  grunt.registerTask('build', 'rig:build rig:plugin lint min');
};
