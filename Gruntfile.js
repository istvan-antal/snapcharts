/*
 * grunt-deployinator
 * https://github.com/istvan-antal/grunt-deployinator
 *
 * Copyright (c) 2014 István Miklós Antal
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';
    var pkg = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js'
            ],
            options: pkg.jshintConfig,
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('check', ['jshint']);

    grunt.registerTask('default', ['check']);
};
