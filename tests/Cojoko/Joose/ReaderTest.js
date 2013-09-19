/*globals Test: true */
define([
  'require', 'qunit-assert', 'test-setup', 'esprima', 'JSON', 'lodash', 'joose', 'Cojoko/debug',
  'text!test-files/Joose/Test/Flying.js', 
  'text!test-files/Joose/Test/Swimming.js', 
  'text!test-files/Joose/Test/Traveling.js', 
  'text!test-files/Joose/Test/Citizen.js', 
  'text!test-files/Joose/Test/Travelroute.js',
  'text!test-files/Joose/Test/InitObject.js',
  'text!test-files/Joose/Test/JooseClassWithNoIsProperty.js',
  'text!test-files/Joose/Psc/Date.js',
  'text!test-files/Joose/Psc/Code.js',
  'text!test-files/Joose/Psc/WrongValueException.js',
  'text!test-files/Joose/Psc/Exception.js',
  'text!test-files/Joose/Psc/CMS/TabButtonable.js',
  'text!test-files/Joose/Psc/CMS/Buttonable.js',
  'text!test-files/Joose/Psc/CMS/TabOpenable.js',
  'text!test-files/Joose/Psc/Response.js', 
  'text!test-files/Joose/Psc/HTTPMessage.js',
  'text!test-files/Joose/Psc/EventDispatching.js', 
  'text!test-files/Joose/Psc/UI/WidgetWrapper.js',
  'text!test-files/Joose/Psc/UI/DropBox.js'
  ], function(require, t, testSetup, esprima, JSON, _, Joose, debug) {
  
  module("Cojoko.Joose.Reader");

  var setup = function (test) {
    var reader = testSetup.container.getJooseReader();

    testSetup.extend(test);

    var classCodeReader = testSetup.getTestClassCodeReader();

    var read = function (code) {
      try {
        return test.reader.read(code, classCodeReader);
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

  test("reads a class with a static interface (really?)", function () {
    expect(0);
    /*
    var that = setup(this);

    that.assertCojoko(this.read('Psc.UI.WidgetWrapper'))
      .name('Psc.UI.WidgetWrapper')
      .staticMethod('unwrapWidget').end()
    ;
    */
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

  test("reads a class with more roles", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Psc.CMS.TabButtonable'))
      .name('Psc.CMS.TabButtonable')
      .hasMixin('Psc.CMS.Buttonable')
      .hasMixin('Psc.CMS.TabOpenable')
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

  test("this.$$ references will be translated in methods", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.read('Test.Travelroute'))
      .name('Test.Travelroute')
      .method('hasValidLength');

    var hasValidLength = cojokoClass.reflection.getMethod('hasValidLength');

    this.assertContains('this.length', hasValidLength.getBodyAsString());
    this.assertContains('that.unit', hasValidLength.getBodyAsString());
  });

  test("property inits will be translated", function () {
    var that = setup(this), cojokoClass;

    that.assertCojoko(cojokoClass = this.read('Test.InitObject'))
      .property('objectProperty').hasInit({}).end()
      .property('arrayProperty').hasInit([]).end()
    ;
  });

  test("other dependencies from joose class will be read", function () {
    var that = setup(this);

    that.assertCojoko(this.read('Test.Swimming'))
      .hasVendorDependency({ path: 'lodash', alias: '_'})
      .hasNotVendorDependency('Joose')
    ;
  });

  test("dependencies that are subclasses will be ignored but used dependencies or other class dependencies will be added", function () {
    var that = setup(this), cojokoClass;

    //define(['joose', 'jquery', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching', 'Psc/Code'], function(Joose, $) {
    that.assertCojoko(cojokoClass = this.read('Psc.UI.DropBox'))
      .hasNotVendorDependency('Joose')

      .hasVendorDependency({ path: 'jquery', alias: '$'})

      // dependency that has no param alias
      .hasVendorDependency({path: 'jquery-ui'})
      
      // dependenciy that is subClass
      .hasImplicitClass('Psc.UI.WidgetWrapper') // extends
      .hasImplicitClass('Psc.EventDispatching') // mixin

      // real class dependency (will be hooked at define level as a global-look-alike)
      .hasExplicitClass('Psc.Code')
      .hasExplicitClass('Psc.Exception')
    ;

    /* will be converted (with cojoko to something like):
      define(['require', 'Cojoko', 'jquery', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching', 'Psc/Code'], function(require, Cojoko, $) {
      
      var Psc = {
        UI: {
           WidgetWrapper: require('Psc/UI/WidgetWrapper')
        },
        EventDispatching: require('Psc/EventDispatching')
      };

      return Cojoko.Class('Psc.UI.DropBox', {
         ...
      })


      for that to happen we need:

      1. the reader needs to parse the dependencies and needs to categorize them into:

        mixins/extends dependencies 
          they are treatet by cojoko and need no special progressing
          .type = 'class.cojoko.implicit'

        vendor/library dependencies 
          these are dependencies that might have an alias or not (jquery plugins have no alias)
          they have to be written from the writer into async module definition of the file
          .type = 'vendor'

        class dependencies 
          those need special treatments because they are used in the code like:
            new Namespaced.Class.Dependency()
          and those names cannot be created with define(): 
          define('Namespaced/Class/Dependency', function (Namespaced.Class.Dependency))
          will not work.

          for that we need to hack in the Psc = { ... } hook. This is the Cojoko Writers work
          those classes are detected with an alias with a . inside

          .type = 'class.cojoko.explicit'
    */
  });
});