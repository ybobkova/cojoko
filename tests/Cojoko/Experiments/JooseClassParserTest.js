define(['qunit-assert', 'test-setup', 'esprima', 'JSON', 'text!test-files/Joose/Response.js', 'test-files/Joose/Response'], function(t, testSetup, esprima, JSON, jooseResponse) {
  
  module("Cojoko.Experiments.JooseClassParser");

  var setup = function (test) {
    var JooseClassParser = {};
    
    return t.setup(test, {JooseClassParser: JooseClassParser});
  };
  
  test("parse a Joose Class", function() {
    var that = setup(this);

    var syntax = esprima.parse(jooseResponse);
    console.log(JSON.stringify(syntax, undefined, 2));
  });

  test("read a Joose class with Joose", function () {
    var meta = Psc.Response.meta;

    meta.getAttributes().eachAll(function (attribute, name, isOwn) {
      console.log('class has attribute ' + name)

      if (typeof(attribute.init) === "function") {
        console.log(attribute.init());
      }
    })
  });
});