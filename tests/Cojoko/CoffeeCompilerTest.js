/*globals Test: true */
define(['qunit-assert', 'test-setup', 'Cojoko/Class'], function(t, testSetup, CojokoClass) {
  
  module("Cojoko.CoffeeCompiler");

  var setup = function(test) {
    var compiler = testSetup.container.getCompiler();

    return t.setup(test, {compiler: compiler});
  };

  test("parses preambel into code", function () {
    var that = setup(this);

    var js = that.compiler.compile(new CojokoClass('SimpleClass', {}));

    this.assertContains("__extends = function", js);
  });

  test("creates named constructor for Class", function () {
    var that = setup(this);

    var js = that.compiler.compile(new CojokoClass('SimpleClass', {}));

    this.assertContains("function SimpleClass(props) {", js);
    this.assertContains("return SimpleClass;", js);
  });

  test("creates all methods as prototype methods", function () {
    var that = setup(this);

    var js = that.compiler.compile(new CojokoClass('SimpleClass', {
      methods: {
        doSomething: function () {},
        doOther: function () {}
      }
    }));

    this.assertContains("SimpleClass.prototype.doSomething = function ()", js);
    this.assertContains("SimpleClass.prototype.doOther = function ()", js);
  });
});