/* jshint node:true */
/*
 * Copyright (c) 2013 Philipp Scheit
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  var requirejs = require('requirejs'),
    _ = grunt.util._;

  var createRequire = function(path, context, overwriteConfig) {
    var config = require(path + '/config.js');

    return requirejs.config(
      _.merge(
        config, {
          context: context,
          baseUrl: path
        },
        overwriteConfig || {}
      )
    );
  };


  grunt.registerMultiTask("joose-transpile", "converts all files in directory", function() {
    var path = require('path');
    var options = this.options({
      classPath: './lib/',
      buildPath: './build/Cojoko/'
    });
    var filepaths = grunt.file.expand(grunt.util._.pluck(this.files, 'src'));

    // resolve to the gruntfile of the callin project
    var classPath = path.resolve(options.classPath);
    var buildPath = path.resolve(options.buildPath);

    var classRequire = requirejs.config({
      context: 'sourceCode',
      baseUrl: classPath
    });


    var done = this.async();
    grunt.log.writeln('using ' + classPath + ' as classPath for requirejs');

    var cojokoRequire = createRequire(path.resolve(__dirname+'/..'), 'cojoko');

    var Cojoko = cojokoRequire(['Cojoko'], function (Cojoko) {
      var jooseReader = Cojoko.getContainer().getJooseReader();
      var classCodeReader = Cojoko.getContainer().getClassCodeReader();
      var cojokoWriter = Cojoko.getContainer().getWriter();

      classCodeReader.getClassCode = function (fqn) {
        return grunt.file.read(classPath+'/'+fqn.replace(/\./g, '/')+'.js');
      };

      grunt.log.writeln("found " + filepaths.length + " files to transpile.");

      _.each(filepaths, function(filepath) {
        var relativePath = path.relative(classPath, filepath);
        var jooseClassName = relativePath.substring(0,relativePath.length-3).replace(/\//g, '.');

        grunt.log.writeln("  transpiling " + filepath + " for joose-class: " + jooseClassName);

        var cojokoClass = jooseReader.read(jooseClassName, classCodeReader);

        grunt.file.write(buildPath+'/'+relativePath, cojokoWriter.write(cojokoClass));
      });

      grunt.log.ok();
      done(true);
    });

  });
};