define(['qunit-assert', 'test-setup', 'text!test-files/Cojoko/HTTPMessage.cojoko.js','test-files/Joose/HTTPMessage'], function(t, testSetup, HTTPMessageCojokoCode) {
  
  module("Cojoko.Writer");

  var setup = function (test) {
    var writer = testSetup.container.getWriter();
    var jooseReader = testSetup.container.getJooseReader();
    
    return t.setup(test, {writer: writer, jooseReader: jooseReader});
  };
  
  test("acceptance: the writer returns a CojokoClass as CojokoCode", function() {
    var that = setup(this);

    var httpMessage = this.jooseReader.read(Psc.HTTPMessage);

    var eolVisible = function (code) {
      return code.replace(/\n/g, "\n-n-").replace(/ /g, ".");
    };

    this.assertEquals(
      eolVisible(HTTPMessageCojokoCode),
      eolVisible(this.writer.write(httpMessage))
    );
  });
});