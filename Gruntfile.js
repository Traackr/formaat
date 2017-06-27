module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner:
            '/*!\n'+
            ' * Formaat <%= pkg.version %>\n'+
            ' * Copyright <%= grunt.template.today("yyyy") %> Rajiv Raman (https://www.linkedin.com/in/rajivraman/)\n'+
            ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n'+
            ' */',

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            dist: {
                src: 'formaat.js',
                dest: 'formaat.min.js'
            }
        },

        // jshint tests
        jshint: {
            lib: {
                src: 'formaat.js'
            }
        },

        // mocha tests
        mochaTest: {
            unit: {
                src: 'tests/*.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', [
        'uglify'
    ]);

    grunt.registerTask('test', [
        'mochaTest',
        'jshint'
    ]);
};