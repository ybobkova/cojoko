define(['qunit-assert', 'test-setup', 'AMD/Definition', 'AMD/Dependency', 'AMD/Generator', 'Test/GetWrapper', 'escodegen'], function(t, testSetup, AMDClass, Dependency, Generator, getWrapper, escodegen) {
  
  module("AMD.Generator");

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

    var jqueryui = new Dependency(
      'vendor/jquery-ui-1.10.1.min'
    );

    amd
      .addDependency(lodash)
      .addDependency(jqueryui)
      .addDependency(jquery);

    return t.setup(test, {generator: new Generator(), amd: amd, lodash: lodash, jquery: jquery});
  };
  
  test("definition generates an AST that is writeable as define", function () {
    var that = setup(this);

    var ast = that.generator.generateDefine(that.amd);
    var js = escodegen.generate(ast);

    var wrapper = getWrapper(js);

    this.assertNotEquals(null, wrapper, 'wrapper cannot be read');

    this.assertEquals(
      ['vendor/lodash', 'vendor/jquery-1.8.2.min', 'vendor/jquery-ui-1.10.1.min'],
      wrapper.paths
    );

    this.assertEquals(
      ['_', 'jQuery'],
      wrapper.params
    );
  });
});