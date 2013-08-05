define(['qunit-assert', 'test-setup', 'Cojoko/Class'], function(t, testSetup, CojokoClass) {
  
  module("Cojoko.Class");

  var setup = function (test) {
    var classRegistry = {};
    var cojokoClass = new CojokoClass('namespaced.test.className', {}, classRegistry);
    
    return t.setup(test, {cojokoClass: cojokoClass});
  };

  test("shortname returns the last portion of the name", function () {
    var that = setup(this);

    that.assertEquals('className', that.cojokoClass.getShortName());
  });

  test("uniqueName stays the same when called twice", function() {
    var that = setup(this), uniqueName;

    that.assertNotUndefined(uniqueName = that.cojokoClass.getUniqueName());
    that.assertEquals(uniqueName, that.cojokoClass.getUniqueName());
  });

  test("uniqueName is not the same for classes with the same name", function () {
    var that = setup(this);

    var sameNamedClass = new CojokoClass(that.cojokoClass.getName(), {});

    that.assertNotEquals(
      that.cojokoClass.getUniqueName(),
      sameNamedClass.getUniqueName()
    );
  });
});