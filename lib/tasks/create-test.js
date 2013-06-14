/* jshint node:true */
/*
 * grunt-webforge-js-testplate
 * https://github.com/pscheit/grunt-webforge-js-testplate
 *
 * Copyright (c) 2013 Philipp Scheit
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  var getTemplateFile = function (name) {
    var path = require("path");

    if (grunt.file.exists('tests/'+name)) {
      return 'tests/'+name;
    } else if(grunt.file.exists())

    return __dirname + path.sep + 'config.file';
  };

  grunt.registerTask("create-test", "crates a new test stub in QUnit", function (testName) {
    var _ = grunt.util._;
    grunt.log.writeln('');
    
    var parts = testName.split('.');
    var ns = parts.slice(0, -1);
    var testOnlyName = parts.slice(-1).pop();
    var nsDir = 'tests/'+ns.join('/');
    var file = nsDir+'/'+testOnlyName+'Test.js';
    
    if (!grunt.file.exists(file) || grunt.cli.options.overwrite) {
      var jsStub = _.template(
        grunt.file.read(getTemplateFile('testTemplate.js')),
        {
          testName: testName,
          testOnlyName: testOnlyName,
          file: file,
          ns: ns
        }
      );
      
      if (!grunt.file.isDir(nsDir)) {
        grunt.file.mkdir(nsDir);
      }
    
      grunt.log.write('write new test to file '+file+'.. ');
      grunt.file.write(file, jsStub);
      grunt.log.ok();
      
      return;
    } else {
      grunt.log.error('will not write to existing file: '+file);
      return false;
    }
  });

};