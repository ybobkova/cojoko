/*globals requirejs*/
/* main used in tests and for standalone bootstrapping (right out of this repository) */
requirejs.config({
  baseUrl: "/lib",
  
  /* define all other paths ALWAYS in ui-main.js */
  paths: {
    fixtures: "../tests/files",
    tests: "../tests",
    "js/main": "/lib/main"
  }
});

/*
 * this bootstrap is a fake bootstrap for tests, which creates a main with fixture contents
 */
define(['boot-helper'], function(boot) {
  
  return boot;
});