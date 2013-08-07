/* global requirejs */
(function() {
  var config = {
    baseUrl: "/lib",

    packages: [
      "Cojoko", 
      { 
        name: "escodegen", 
        location: "../vendor/escodegen"
      },
      { 
        name: "estraverse", 
        location: "../vendor/estraverse"
      },
      { 
        name: "ast-types", 
        location: "../vendor/ast-types"
      }
    ],

    /* set paths and vendor versions for applications
     *
     * paths are relative to lib
     * define all vendor dependencies here
     */
    paths: {
      'tests': '../tests', // for testRunner
      'test-setup': "../tests/setup",
      'test-files': "../tests/files",
      'templates': "../templates",

      'assert': '../vendor/nodejs/assert',

      'source-map': "../vendor/source-map/source-map",
      'jquery': "../vendor/jquery/jquery-1.10.1.min",
      "qunit": "../vendor/qunit/qunit-1.11.0",
      'knockout': "../vendor/knockout/knockout-2.2.1",
      'TestRunner': "../vendor/qunit-assert/lib/TestRunner",
      'qunit-assert': '../vendor/qunit-assert/lib/assert',
      'esprima': '../vendor/esprima/esprima',
      'joose': "../vendor/joose/all",
      'text': "../vendor/requirejs/text",

      "lodash": "../vendor/lodash/lodash.min",
      "JSON": "../vendor/json/json2",
      //"hogan": "../vendor/hogan/hogan-2.0.0.min.amd",
      'twitter-bootstrap': "../vendor/twitter-bootstrap/bootstrap",

      'Psc': "../tests/files/Joose/Psc"
    }
  };

  if (typeof define === 'function' && define.amd) {
    /*
    requirejs.onError = function (err) {
        console.log(err.requireType);
        if (err.requireType === 'timeout') {
            console.log('modules: ' + err.requireModules);
        }

        throw err;
    };
    */

    return requirejs.config(config);

  } else { // node
    module.exports = config;
  }

})();