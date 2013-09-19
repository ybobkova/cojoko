/*globals Test: true */
define([
  'qunit-assert', 'test-setup', 'esprima', 'JSON', 'lodash', 'joose', 'Cojoko/Joose/RuntimeReader',
  'test-files/Joose/Psc/Response', 
  'test-files/Joose/Psc/EventDispatching', 
  'test-files/Joose/Psc/UI/WidgetWrapper'
  ], function (t, testSetup, esprima, JSON, _, Joose, JooseRuntimeReader) {
  
  module("Cojoko.Joose.RuntimeReader");

    Joose.Role('Test.Flying', {
      after: {
        initialize: function () {
          // expand wings
        }
      },

      methods: {
        fly: function () {}
      }
    });

    Joose.Role('Test.Swimming', {
      before: {
        initialize: function () {
          // prepare rubber-duck
        }
      },

      methods: {
        swim: function () {}
      }
    });

    Joose.Role('Test.Traveling', {
      does: [Test.Flying, Test.Swimming]
    });


    Joose.Class('Test.Citizen', {
      does: Test.Traveling,

      after:{
        initialize: function () {
          // pack the bags
        }
      }
    });

    Joose.Class('Test.Travelroute', {

      has: {
        length: {is:'w', init: 17},
        unit: {is:'rw', init: 'm'}
      },

      methods: {
        hasValidLength: function () {
          var that = this;

          return this.$$length > 0 && that.$$unit !== undefined;
        }
      }
    });

    Joose.Class('Test.InitObject', {

      has: {
        objectProperty: {is:'w', init: Joose.I.Object},
        arrayProperty: {is:'rw', init: Joose.I.Array}
      }

    });

  var setup = function (test) {
    var reader = new JooseRuntimeReader(testSetup.container.Cojoko);

    testSetup.extend(test);

    return t.setup(test, {reader: reader});
  };

  test("reads the Psc.Response Class from Joose and inits all properties", function () {
    var that = setup(this);

    var CojokoResponse = this.reader.read(Psc.Response);

    that.assertCojoko(CojokoResponse)
      .name('Psc.Response')
      .propertiesCount(3)
      .property('code').is('gs').isRequired().hasInit(undefined).end()
      .property('reason').is('gs').isOptional().hasInit(null).end()
      .property('body').is('gs').isOptional().hasInit(null).end();

  });

  test("reads the Psc.Response and adds all methods", function () {
    var that = setup(this);

    this.assertCojoko(this.reader.read(Psc.Response))
      .methodsCount(3)
      .method('toString').end()
      .method('isValidation').end();

  });

  test("reads the Psc.Response and converts the after initialize function to init()", function () {
    var that = setup(this);

    var CojokoResponse = this.reader.read(Psc.Response);
    var methods = CojokoResponse.reflection.getMethods();

    that.assertAttributeNotUndefined('init', methods);
  });

  test("reads a class with inheritance", function () {
    var that = setup(this);

    that.assertCojoko(this.reader.read(Psc.Response))
      .name('Psc.Response')
      .isSubclassOf('Psc.HTTPMessage')
    ;
  });

  test("reads a joose role", function () {
    var that = setup(this);

    that.assertCojoko(this.reader.read(Psc.EventDispatching))
      .name('Psc.EventDispatching')
      .isMixin()
      .method('init').end()
      .method('toString').end()
      .property('eventManager').end()
    ;

  });

  asyncTest("reads a class with a role", function () {
    var that = setup(this);

    define('jquery-ui', {});
    define('stacktrace', {});

    require(['test-files/Joose/Psc/UI/DropBox'], function() {
      start();

      that.assertCojoko(that.reader.read(Psc.UI.DropBox))
        .name('Psc.UI.DropBox')
        .method('init').end()
        .isSubclassOf('Psc.UI.WidgetWrapper')
        .hasMixin('Psc.EventDispatching')
      ;
    });
  });

  test("reads only the roles of the citizen class not the Roles of the hierarchy", function () {
    var that = setup(this);

    var Citizen = Joose.Class({
      does: Test.Traveling
    });

    that.assertCojoko(this.reader.read(Citizen))
      .hasMixin('Test.Traveling')
      .hasNotMixin('Test.Swimming')
      .hasNotMixin('Test.Flying')
    ;

  });

  test("reads empty is attribute", function () {
    var that = setup(this);

    var JooseClassWithNoIsProperty = Joose.Class({

      has: {
        noIsProperty: { is: '', required: false }
      }

    });

    that.assertCojoko(this.reader.read(JooseClassWithNoIsProperty))
      .property('noIsProperty').is('').end()
    ;

  });

  test("reads only the initialize method from the citizen class and no other methods of the whole hierarchy", function () {
    var that = setup(this);

    that.assertCojoko(this.reader.read(Test.Citizen))
      .methodsCount(1)
      .method('init').end()
    ;

  });

  test("this.$$ references will be translated", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.reader.read(Test.Travelroute))
      .name('Test.Travelroute')
      .method('hasValidLength');

    var hasValidLength = cojokoClass.reflection.getMethod('hasValidLength');

    this.assertContains('this.length', hasValidLength.getBodyAsString());
    this.assertContains('that.unit', hasValidLength.getBodyAsString());
  });

  test("property inits will be translated", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.reader.read(Test.InitObject))
      .property('objectProperty').hasInit({}).end()
      .property('arrayProperty').hasInit([]).end()
    ;
  });
});