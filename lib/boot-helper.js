/* global requirejs */

requirejs.config({

  /* set paths and vendor versions for applications
   *
   * paths are relative to lib
   * define all vendor dependencies here
   */
  paths: {
    'jquery': "../vendor/jquery/jquery-1.10.1",
    "qunit": "../vendor/qunit/qunit-1.11.0",
    'knockout': "../vendor/knockout/knockout-2.2.1",

    'psc-tests-assert': '../vendor/qunit-assert/lib/assert',
    'TestRunner': "../vendor/qunit-assert/lib/TestRunner",
    'test-files': "../tests/files",

    //"JSON": "../vendor/json/json2",
    //"hogan": "../vendor/hogan/hogan-2.0.0.min.amd",
    'twitter-bootstrap': "../vendor/twitter-bootstrap/bootstrap",

    'templates': "../templates"
  }
});

define(function() {

  return {

  };

});