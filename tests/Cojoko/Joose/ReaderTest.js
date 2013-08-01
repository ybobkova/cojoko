/*globals Test: true */
define([
  'qunit-assert', 'test-setup', 'esprima', 'JSON', 'lodash', 'joose', 'Cojoko/debug',
  'text!test-files/Joose/Test/Flying.js', 
  'text!test-files/Joose/Test/Swimming.js', 
  'text!test-files/Joose/Test/Traveling.js', 
  'text!test-files/Joose/Test/Citizen.js', 
  'text!test-files/Joose/Test/Travelroute.js',
  'text!test-files/Joose/Test/InitObject.js',
  'text!test-files/Joose/Response.js', 
  'text!test-files/Joose/EventDispatching.js', 
  'text!test-files/Joose/WidgetWrapper.js',
  'text!test-files/Joose/DropBox.js',
  'text!test-files/Joose/Test/JooseClassWithNoIsProperty.js'
  ], function(t, testSetup, esprima, JSON, _, Joose, debug,
    TestFlying,
    TestSwimming,
    TestTraveling,
    TestCitizen,
    TestTravelroute,
    TestInitObject,
    PscResponse,
    PscEventDispatching,
    PscWidgetWrapper,
    PscUIDropBox,
    TestJooseClassWithNoIsProperty
  ) {
  
  module("Cojoko.Joose.Reader");

  var setup = function (test) {
    var reader = testSetup.container.getJooseReader();

    testSetup.extend(test);

    var read = function (code) {
      try {
        return test.reader.read(code);
      } catch (Ex) {
        if (Ex.isParseError) {
          debug('Parse Error caught for', Ex.node);
        }

        throw Ex;
      }
    };

    return t.setup(test, {reader: reader, read: read});
  };

  test("reads the Psc.Response Class from Joose and inits all properties", function () {
    var that = setup(this);

    var CojokoResponse = this.read(PscResponse);

    that.assertCojoko(CojokoResponse)
      .name('Psc.Response')
      .propertiesCount(3)
      .property('code').is('gs').isRequired().hasInit(undefined).end()
      .property('reason').is('gs').isOptional().hasInit(null).end()
      .property('body').is('gs').isOptional().hasInit(null).end();

  });

  test("reads the Psc.Response and adds all methods", function () {
    var that = setup(this);

    this.assertCojoko(this.read(PscResponse))
      .methodsCount(3)
      .method('toString').end()
      .method('isValidation').end();

  });

  test("reads the Psc.Response and converts the after initialize function to init()", function () {
    var that = setup(this);

    var CojokoResponse = this.read(PscResponse);
    var methods = CojokoResponse.reflection.getMethods();

    that.assertAttributeNotUndefined('init', methods);
  });

  test("reads a class with inheritance", function () {
    var that = setup(this);

    that.assertCojoko(this.read(PscResponse))
      .name('Psc.Response')
      .isSubclassOf('Psc.HTTPMessage')
    ;
  });

  test("reads a joose role", function () {
    var that = setup(this);

    that.assertCojoko(this.read(PscEventDispatching))
      .name('Psc.EventDispatching')
      .isMixin()
      .method('init').end()
      .method('toString').end()
      .property('eventManager').end()
    ;

  });

  test("reads a class with a role", function () {
    var that = setup(this);

    that.assertCojoko(this.read(PscUIDropBox))
      .name('Psc.UI.DropBox')
      .method('init').end()
      .isSubclassOf('Psc.UI.WidgetWrapper')
      .hasMixin('Psc.EventDispatching')
    ;

  });

  test("reads only the roles of the citizen class not the Roles of the hierarchy", function () {
    var that = setup(this);

    that.assertCojoko(this.read(TestCitizen))
      .hasMixin('Test.Traveling')
      .hasNotMixin('Test.Swimming')
      .hasNotMixin('Test.Flying')
    ;

  });

  test("reads empty is attribute", function () {
    var that = setup(this);

    that.assertCojoko(this.read(TestJooseClassWithNoIsProperty))
      .property('noIsProperty').is('').end()
    ;

  });


  test("reads only the initialize method from the citizen class and no other methods of the whole hierarchy", function () {
    var that = setup(this);

    that.assertCojoko(this.read(TestCitizen))
      .methodsCount(1)
      .method('init').end()
    ;

  });

  test("this.$$ references will be translated", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.read(TestTravelroute))
      .name('Test.Travelroute')
      .method('hasValidLength');

    var hasValidLength = cojokoClass.reflection.getMethod('hasValidLength');

    this.assertContains('this.length', hasValidLength.toString());
    this.assertContains('that.unit', hasValidLength.toString());
  });

  test("property inits will be translated", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.read(TestInitObject))
      .property('objectProperty').hasInit({}).end()
      .property('arrayProperty').hasInit([]).end()
    ;
  });
});