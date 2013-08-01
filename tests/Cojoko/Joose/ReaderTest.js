/*globals Test: true */
define([
  'require', 'qunit-assert', 'test-setup', 'esprima', 'JSON', 'lodash', 'joose', 'Cojoko/debug',
  'text!test-files/Joose/Test/Flying.js', 
  'text!test-files/Joose/Test/Swimming.js', 
  'text!test-files/Joose/Test/Traveling.js', 
  'text!test-files/Joose/Test/Citizen.js', 
  'text!test-files/Joose/Test/Travelroute.js',
  'text!test-files/Joose/Test/InitObject.js',
  'text!test-files/Joose/Response.js', 
  'text!test-files/Joose/HTTPMessage.js',
  'text!test-files/Joose/EventDispatching.js', 
  'text!test-files/Joose/WidgetWrapper.js',
  'text!test-files/Joose/DropBox.js',
  'text!test-files/Joose/Test/JooseClassWithNoIsProperty.js'
  ], function(require, t, testSetup, esprima, JSON, _, Joose, debug,
    TestFlying,
    TestSwimming,
    TestTraveling,
    TestCitizen,
    TestTravelroute,
    TestInitObject,
    PscResponse,
    PscHTTPMessage,
    PscEventDispatching,
    PscWidgetWrapper,
    PscUIDropBox,
    TestJooseClassWithNoIsProperty
  ) {
  
  module("Cojoko.Joose.Reader");

  var setup = function (test) {
    var reader = testSetup.container.getJooseReader();

    testSetup.extend(test);

    var sources = {
      'Test.Flying': TestFlying,
      'Test.Swimming': TestSwimming,
      'Test.Traveling': TestTraveling,
      'Test.Citizen': TestCitizen,
      'Test.Travelroute': TestTravelroute,
      'Test.InitObject': TestInitObject,
      'Psc.Response': PscResponse,
      'Psc.HTTPMessage': PscHTTPMessage,
      'Psc.EventDispatching': PscEventDispatching,
      'Psc.WidgetWrapper': PscWidgetWrapper,
      'Psc.UI.DropBox': PscUIDropBox,
      'Test.JooseClassWithNoIsProperty': TestJooseClassWithNoIsProperty
    };

    var readClassCode = function(fqn) {
      if (!sources[fqn]) {
        throw new Error('have no sources for: '+fqn);
      }
      return sources[fqn];
    };

    var read = function (code) {
      try {
        return test.reader.read(code, readClassCode);
      } catch (Ex) {
        if (Ex.isParseError) {
          debug('Parse Error caught for class', Ex.fqn, 'in node', Ex.node);
        }

        throw Ex;
      }
    };

    return t.setup(test, {reader: reader, read: read});
  };

  test("reads the Psc.Response Class from Joose and inits all properties", function () {
    var that = setup(this);

    var CojokoResponse = this.read('Psc.Response');

    that.assertCojoko(CojokoResponse)
      .name('Psc.Response')
      .propertiesCount(3)
      .property('code').is('gs').isRequired().hasInit(undefined).end()
      .property('reason').is('gs').isOptional().hasInit(null).end()
      .property('body').is('gs').isOptional().hasInit(null).end();

  });

  test("reads the Psc.Response and adds all methods", function () {
    var that = setup(this);

    this.assertCojoko(this.read('Psc.Response'))
      .methodsCount(3)
      .method('toString').end()
      .method('isValidation').end();

  });

  test("reads the Psc.Response and converts the after initialize function to init()", function () {
    var that = setup(this);

    var CojokoResponse = this.read('Psc.Response');
    var methods = CojokoResponse.reflection.getMethods();

    that.assertAttributeNotUndefined('init', methods);
  });

  test("reads a class with inheritance", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Psc.Response'))
      .name('Psc.Response')
      .isSubclassOf('Psc.HTTPMessage')
    ;
  });

  test("reads a joose role", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Psc.EventDispatching'))
      .name('Psc.EventDispatching')
      .isMixin()
      .method('init').end()
      .method('toString').end()
      .property('eventManager').end()
    ;

  });

  test("reads a class with a role", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Psc.UI.DropBox'))
      .name('Psc.UI.DropBox')
      .method('init').end()
      .isSubclassOf('Psc.UI.WidgetWrapper')
      .hasMixin('Psc.EventDispatching')
    ;

  });

  test("reads only the roles of the citizen class not the Roles of the hierarchy", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Test.Citizen'))
      .hasMixin('Test.Traveling')
      .hasNotMixin('Test.Swimming')
      .hasNotMixin('Test.Flying')
    ;

  });

  test("reads empty is attribute", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Test.JooseClassWithNoIsProperty'))
      .property('noIsProperty').is('').end()
    ;

  });


  test("reads only the initialize method from the citizen class and no other methods of the whole hierarchy", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Test.Citizen'))
      .methodsCount(1)
      .method('init').end()
    ;

  });

  test("this.$$ references will be translated", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.read('Test.Travelroute'))
      .name('Test.Travelroute')
      .method('hasValidLength');

    var hasValidLength = cojokoClass.reflection.getMethod('hasValidLength');

    this.assertContains('this.length', hasValidLength.toString());
    this.assertContains('that.unit', hasValidLength.toString());
  });

  test("property inits will be translated", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.read('Test.InitObject'))
      .property('objectProperty').hasInit({}).end()
      .property('arrayProperty').hasInit([]).end()
    ;
  });
});