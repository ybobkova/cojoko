define(['qunit-assert', 'test-setup', 'lodash', 'Cojoko/Class', 'test-files/Cojoko/Wolpertinger'], function(t, testSetup, _, CojokoClass, Wolpertinger) {
  
  module("Cojoko.Class");

  var setup = function (test) {
    var classRegistry = {};
    var cojokoClass = new CojokoClass('namespaced.test.className', {}, classRegistry);
    
    return t.setup(test, {
        cojokoClass: cojokoClass,
        toFQNs: function (classes) {
          return _.sortBy(
            _.map(classes, function (cojokoClass) {
              return cojokoClass.getName();
            })
          );
        }
      }
    );
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

  test("getImplicitClasses returns the mixins and extends classes from the class", function () {
    var that = setup(this);

    var fqns = that.toFQNs(Wolpertinger.getImplicitClasses());

    this.assertEquals(
      ['Animal', 'Flying', 'Running', 'Swimming'],
      fqns
    );
  });

  test("getExplicitClasses returns the added explicit classes from the class", function () {
    var that = setup(this);

    var PscCode = new CojokoClass('Psc.Code', {});
    var PscException = new CojokoClass('Psc.Exception', {});

    that.cojokoClass
      .addExplicitClass(PscCode)
      .addExplicitClass(PscException)
    ;

    this.assertEquals(
      ['Psc.Code', 'Psc.Exception'],
      this.toFQNs(that.cojokoClass.getExplicitClasses())
    );
  });

  test("addDependency inclosures a dependency for runtimeClasses or classes", function () {
    var that = setup(this);
    var $ = { jquery: true };

    that.cojokoClass
      .addDependency('vendor/jquery', 'jQuery')
      .addDependency('vendor/lodash', '_')
    ;

    this.assertEquals(
      [
        {
          alias: 'jQuery',
          path: 'vendor/jquery'
        },
        {
          alias: '_',
          path: 'vendor/lodash'
        }
      ],

      that.cojokoClass.getVendorDependencies()
    );
  });
});