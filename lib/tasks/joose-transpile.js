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
      classPath: './lib/'
    });
    var filepaths = grunt.file.expand(grunt.util._.pluck(this.files, 'src'));

    // resolve to the gruntfile of the callin project
    var classPath = path.resolve(options.classPath);

    var done = this.async();
    grunt.log.writeln('using ' + classPath + ' as classPath for requirejs');
    var cojokoRequire = createRequire(path.resolve(__dirname+'/..'), 'cojoko');
    var classRequire = createRequire(classPath, 'classes', {
      paths: {
        'jquery': "../vendor/jquery/jquery-fake"
      }
    });

    var Cojoko = cojokoRequire(['Cojoko'], function (Cojoko) {

      var jooseReader = Cojoko.getContainer().getJooseReader();
      var defineReader = Cojoko.getContainer().getDefineReader();

      grunt.log.writeln("found " + filepaths.length + " files to transpile.");

      _.each(filepaths, function(path) {
        var jooseClassName = (path.match(/^lib\/(.*?)\.js$/)[1]).replace(/\//g, '.');

        grunt.log.writeln("  transpiling " + path + " for joose-class: " + jooseClassName);
        var js = grunt.file.read(path);
        var wrapper = defineReader.read(js);

        // @TODO: combine the paths and arguments to defines, cut off Class-Dependencies (they have no argument), cut off joose dependency

        jooseReader.read(js);

        /*
        grunt.file.write(htmlPath, testCode({
          testTitle: 'single test for: '+test.replace('/\/g', '.'),
          testName: test+"Test"
        }));
        */
      });

      grunt.log.ok();
      done(true);
    });

  });
};