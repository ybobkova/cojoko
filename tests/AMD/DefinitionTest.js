define(['qunit-assert', 'test-setup', 'AMD/Definition', 'AMD/Dependency'], function(t, testSetup, AMDClass, Dependency) {
  
  module("AMD.Definition");

  var setup = function (test) {
    var amd = new AMDClass();

    var lodash = new Dependency(
      'vendor/lodash',
      '_'
    );

    var jquery = new Dependency(
      'vendor/jquery-1.8.2.min',
      'jQuery'
    );
    
    return t.setup(test, {amd: amd, lodash: lodash, jquery: jquery});
  };
  
  test("dependencies can be added to the definition", function() {
    var that = setup(this);

    that.assertNotUndefined(
      that.amd.addDependency(
        new Dependency(
          'vendor/lodash',
          '_'
        )
      )
    );
  });

  test("getDependency returns the dependency by name if added", function() {
    var that = setup(this), dependency;

    that.amd.addDependency(dependency = that.lodash);

    that.assertSame(dependency, that.amd.getDependency('_'));
    that.assertUndefined(that.amd.getDependency('jQuery'));
  });

  test("hasDependency returns true for dependency by name if added", function () {
    var that = setup(this);

    that.amd.addDependency(that.lodash);

    that.assertTrue(that.amd.hasDependency('_'), 'hasDependency reflects if dependency was added');
    that.assertFalse(that.amd.hasDependency('jQuery'));
  });

  test("getDependencies returns all dependencies in AMD", function () {
    var that = setup(this);

    that.assertLength(0, that.amd.getDependencies());

    that.amd.addDependency(that.lodash);

    that.assertLength(1, that.amd.getDependencies());

    that.amd.addDependency(that.jquery);

    that.assertLength(2, that.amd.getDependencies());
  });

  test("when dependency is added twice with same arguments nothing happens", function () {
    var that = setup(this);

    that.amd.addDependency(that.lodash);

    that.assertLength(1, that.amd.getDependencies());

    that.amd.addDependency(that.lodash);

    that.assertLength(1, that.amd.getDependencies());
  });

  test("when dependency is added twice with other path an error accurs", function () {
    var that = setup(this);

    that.amd.addDependency(that.lodash);

    try {
      that.amd.addDependency(new Dependency(
        'vendor/other/lodash',
        '_'
      ));

      this.fail('an Error was expected to be thrown');
    } catch (err) {
      this.assertContains("lodash", err.toString());
      this.assertContains("already used", err.toString());
    }
  });

  test("by default the module definition is anonymous", function () {
    var that = setup(this);

    this.assertTrue(that.amd.isAnonymous(), 'amd is anonymous per default');
  });

  test("when name is given as parameter 1 the module is not anonymous", function () {
    var that = setup(this);

    var amd = new AMDClass('Some/ModuleId');

    that.assertEquals('Some/ModuleId', amd.getName());
    this.assertFalse(amd.isAnonymous(), 'amd is not anonymous');
  });

  test("when name is set the module definition is not anonymous anymore", function () {
    var that = setup(this);

    that.amd.setName('Some/ModuleId');

    that.assertEquals('Some/ModuleId', that.amd.getName());
    this.assertFalse(that.amd.isAnonymous(), 'amd is not anonymous');
  });
});