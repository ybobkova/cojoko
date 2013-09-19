define(['require', 'qunit-assert', 'test-setup', 'escodegen', 'ast-types'], function(require, t, testSetup, escodegen) {
  
  module("Cojoko.Experiments.CodeGenTest");

  var setup = function (test) {

    return t.setup(test);
  };
  
  test("generate a binary expression", function() {
    var that = setup(this);

    that.assertEquals(
      '40 + 2',
      escodegen.generate({
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Literal', value: 40 },
        right: { type: 'Literal', value: 2 }
      })
    );
  });

  test("generate with ast-types", function () {
    var that = setup(this);

    var n = require("ast-types").namedTypes;
    var b = require("ast-types").builders;

    var fooId = b.identifier("foo");
    var ifFoo = b.ifStatement(
      fooId, 
      b.blockStatement([
        b.expressionStatement(b.callExpression(fooId, []))
      ])
    );

    var ast = b.program([ifFoo]);

    that.assertEquals(
      "if (foo) {\n"+
      "  foo();\n"+
      "}",
      escodegen.generate(ast, {
        indent: "  "
      })
    );
  });
});