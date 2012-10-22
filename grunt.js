/*global module:false*/
module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-rigger');
  
  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/StyleManagerTest.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    rig: {
      build: {
        src: ['src/wrapper.js'],
        dest: 'build/StyleManager.js'
      }
    },
    min: {
      dist: {
        src: ['build/StyleManager.js'],
        dest: 'build/StyleManager.min.js'
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
        describe: true,
        expect: true,
        it: true,
        beforeEach: true,
        StyleManager: true,
        define: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');
  
  grunt.registerTask('build', 'lint rig:build min');
};
