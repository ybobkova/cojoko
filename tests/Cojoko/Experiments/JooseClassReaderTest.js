define(['qunit-assert', 'test-setup', 'esprima', 'JSON', 'lodash','test-files/Joose/Response'], function(t, testSetup, esprima, JSON, _) {
  
  module("Cojoko.Experiments.JooseClassReader");

  var setup = function (test) {
    var reader = testSetup.container.getJooseReader();

    return t.setup(test, {reader: reader});
  };

  test("read a Joose class with Joose", function () {
    var that = setup(this);

    var CojokoResponse = this.reader.read(Psc.Response);

    var properties = CojokoResponse.reflection.getProperties();

    that.assertLength(3, _.toArray(properties), 'all properties are parsed');

    var code, reason, body;

    that.assertNotUndefined(code = properties['code']);
    that.assertEquals('gs', code.is);
    that.assertTrue(code.required);
    that.assertEquals(undefined, code.init);

    that.assertNotUndefined(reason = properties['reason']);
    that.assertEquals('gs', reason.is);
    that.assertFalse(reason.required);
    that.assertEquals(null, reason.init);

    that.assertNotUndefined(body = properties['body']);
    that.assertEquals('gs', body.is);
    that.assertFalse(body.required);
    that.assertEquals(null, body.init);
  });
});