/*globals Test: true */
define(['qunit-assert', 'test-setup', 'Cojoko/Class'], function(t, testSetup, CojokoClass) {
  
  module("Cojoko.CoffeeCompiler");

  var setup = function(test) {
    var compiler = testSetup.container.getCompiler();

    testSetup.extend(test);

    return t.setup(test, {compiler: compiler});
  };

  test("parses preambel into code", function () {
    var that = setup(this);

    var compiled = that.compiler.compile(new CojokoClass('SimpleClass', {}));

    this.assertContains("__extends = function", compiled.js);
  });

  test("creates named constructor for Class", function () {
    var that = setup(this);

    var cojokoClass = new CojokoClass('SimpleClass', {});
    var compiled = that.compiler.compile(cojokoClass);

    this.assertContains("function "+cojokoClass.getUniqueName()+"(props) {", compiled.js);
    this.assertContains("return "+cojokoClass.getUniqueName()+";", compiled.js);
  });

  test("creates all methods as prototype methods", function () {
    var that = setup(this);

    var cojokoClass;
    var compiled = that.compiler.compile(cojokoClass = new CojokoClass('SimpleClass', {
      methods: {
        doSomething: function () {},
        doOther: function () {}
      }
    }));

    this.assertContains(cojokoClass.getUniqueName()+".prototype.doSomething = function ()", compiled.js);
    this.assertContains(cojokoClass.getUniqueName()+".prototype.doOther = function ()", compiled.js);
  });

  test("does not modify reflection when methods are generated", function() {
    var that = setup(this);

    var cojokoClass = new CojokoClass('SimplePropertyClass', {
      properties: {
        'one': { is: 'gs', required: false },
        'two': { is: 'gs', required: false }
      }
    });

    that.assertCojoko(cojokoClass).methodsCount(0);

    var compiled = that.compiler.compile(cojokoClass);

    that.assertCojoko(cojokoClass).methodsCount(0);
  });
});