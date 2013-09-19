define(['qunit-assert', 'test-setup', 'Cojoko/ClassCodeReader', 'text!test-files/Joose/Psc/HTTPMessage.js','text!test-files/Joose/extractedParseHeaderFunction.txt', 'esprima'], function(t, testSetup, classCodeReader, HTTPMessageCode, parseHeaderFunctionCode, esprima) {
  
  module("Cojoko.ClassCodeReader");

  var setup = function (test) {

    classCodeReader.getClassCode = function (fqn) {
      if (fqn !== 'Psc.HTTPMessage') {
        throw new Error('Im stupid test read and cannot read something else like: '+fqn);
      }

      return HTTPMessageCode;
    };
    
    return t.setup(test, {classCodeReader: classCodeReader});
  };
  
  test("extract code returns the exact position of a portion of code", function () {
    var that = setup(this);

    var ast = esprima.parse(HTTPMessageCode, { raw: true, comment: true, loc: true, range: true });

    var functionExpression = ast.body[0].expression['arguments'][1].body.body[0].expression['arguments'][1].properties[1].value.properties[3].value;

    that.assertEquals(
      parseHeaderFunctionCode,
      that.classCodeReader.extractClassCode('Psc.HTTPMessage', functionExpression.range)
    );

  });
});