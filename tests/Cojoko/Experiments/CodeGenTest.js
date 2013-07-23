define(['qunit-assert', 'test-setup', 'escodegen'], function(t, testSetup, escodegen) {
  
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
});