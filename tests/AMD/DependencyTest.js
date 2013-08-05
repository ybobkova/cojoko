define(['qunit-assert', 'test-setup', 'AMD/Dependency'], function(t, testSetup, Dependency) {
  
  module("AMD.Dependency");

  var setup = function (test) {
    var Dependency = {};
    
    return t.setup(test, {Dependency: Dependency});
  };

  test("dependency can be contructed with 1 parameter", function () {
    var that = setup(this);

    var something = new Dependency('vendor/something');

    this.assertTrue(
      something instanceof Dependency
    );

    this.assertEquals('vendor/something', something.getPath());
  });

  test("dependency can be contructed with 2 parameters", function () {
    var that = setup(this);

    var something = new Dependency('vendor/something', 'someAlias');

    this.assertTrue(something instanceof Dependency);

    this.assertEquals('someAlias', something.getAlias());
  });
  
  test("dependency first parameter has to be a string", function() {
    var that = setup(this);

    try {
      new Dependency(7);

      this.fail('no exception was thrown');
    } catch (err) {
      this.assertContains('has to be a string', err.toString());
    }

  });
});