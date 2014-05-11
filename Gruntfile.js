/*
 * grunt-deployinator
 * https://github.com/istvan-antal/grunt-deployinator
 *
 * Copyright (c) 2014 István Miklós Antal
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';
    var pkg = grunt.file.readJSON('package.json'),
        srcFiles = [
            'Gruntfile.js',
            'src/**/*.js'
        ];

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: srcFiles,
            options: pkg.jshintConfig
        },
        jscs: {
            src: srcFiles,
            options: pkg.jscsConfig
        }
    });

    grunt.loadNpmTasks('grunt-jscs-checker');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('check', ['jshint', 'jscs']);

    grunt.registerTask('default', ['check']);
};
