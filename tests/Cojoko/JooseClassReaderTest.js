/*globals Test: true */
define([
  'qunit-assert', 'test-setup', 'esprima', 'JSON', 'lodash', 'joose', 
  'test-files/Joose/Response', 
  'test-files/Joose/EventDispatching', 
  'test-files/Joose/WidgetWrapper',
  'test-files/Joose/DropBox'
  ], function(t, testSetup, esprima, JSON, _, Joose) {
  
  module("Cojoko.JooseClassReader");

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

  var setup = function (test) {
    var reader = testSetup.container.getJooseReader();

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
      //.isMixin()
      .method('init').end()
      .method('toString').end()
      .property('eventManager').end()
    ;

  });

  test("reads a class with a role", function () {
    var that = setup(this);

    that.assertCojoko(this.reader.read(Psc.UI.DropBox))
      .name('Psc.UI.DropBox')
      .method('init').end()
      .isSubclassOf('Psc.UI.WidgetWrapper')
      .hasMixin('Psc.EventDispatching')
    ;

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
});