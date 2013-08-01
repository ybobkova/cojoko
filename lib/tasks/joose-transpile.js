/* jshint node:true */
/*
 * Copyright (c) 2013 Philipp Scheit
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  grunt.registerMultiTask("joose-transpile", "converts all files in directory", function() {
    var requirejs = GLOBAL.requirejs = require('requirejs'), _ = grunt.util._;

    require(__dirname+'/../config.js');

    requirejs.config({
      nodeRequire: require,

      baseUrl: __dirname+'/../'
    });

    var filepaths = grunt.file.expand(grunt.util._.pluck(this.files, 'src'));

    // all files are relative to the grunt.js file
    grunt.log.writeln("found "+filepaths.length+" files to transpile.");

    var done = this.async();
    var Cojoko = requirejs(['Cojoko'], function (Cojoko) {

      var jooseReader = Cojoko.getContainer().getJooseReader();
      var defineReader = Cojoko.getContainer().getDefineReader();
    
      _.each(filepaths, function (path) {
        var jooseClassName = (path.match(/^lib\/(.*?)\.js$/)[1]).replace(/\//g, '.');

        grunt.log.writeln("  transpiling "+path+" for joose-class: "+jooseClassName);
        var js = grunt.file.read(path);
        var wrapper = defineReader.read(js);

        // @TODO: combine the paths and arguments to defines, cut off Class-Dependencies (they have no argument), cut off joose dependency

        jooseReader.read();
      
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