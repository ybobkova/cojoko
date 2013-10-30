/*jshint evil:true*/
define([
    'require', 'qunit-assert', 'test-setup', 'jquery', 'lodash', 'Cojoko', 'text!test-files/Cojoko/HTTPMessage.cojoko.js', 'Test/GetWrapper', 'escodegen',
    'test-files/Cojoko/Eagle', 'test-files/Cojoko/Wolpertinger',
    'text!test-files/Joose/Psc/HTTPMessage.js',
    'test-files/Cojoko/AllInitValues',
    'text!test-files/Joose/Psc/UI/DropBox.js',
    'text!test-files/Joose/Psc/UI/WidgetWrapper.js',
    'text!test-files/Joose/Psc/EventDispatching.js',
    'text!test-files/Joose/Psc/Code.js',
    'text!test-files/Joose/Psc/WrongValueException.js',
    'text!test-files/Joose/Psc/Exception.js',
    'text!test-files/Joose/Test/NamespacedDependenciesClass.js'
  ],
  function(
    require, t, testSetup, $, _, Cojoko, HTTPMessageCojokoCode, getWrapper, escodegen,
    EagleClass, WolpertingerClass, HTTPMessageJooseCode, AllInitValuesClass
  ) {

    module("Cojoko.Writer");

    var setup = function(test) {
      var writer = testSetup.container.getWriter();
      var jooseReader = testSetup.container.getJooseReader();
      var classCodeReader = testSetup.getTestClassCodeReader();

      testSetup.extend(test);

      var parseDefine = function(code) {
        var findReturn = true;

        return getWrapper(code, findReturn);
      };

      var evalWritten = function(cojokoClass) {
        var moduleName = _.uniqueId('evalWritten' + cojokoClass.getShortName());

        var js = this.writer.write(cojokoClass, {
          moduleName: moduleName,
          definePrefix: 'test-files/Cojoko/'
        });

        var wrapper = parseDefine(js);

        test.assertNotEquals(null, wrapper.returns, 'wrapper should have first level return for class');
        test.assertEquals(moduleName, wrapper.moduleName, 'moduleName should be injected correctly for test');

        eval(js);

        var d = $.Deferred();

        require([moduleName], function(writtenCojokoClass) {
          d.resolve(writtenCojokoClass, wrapper);
        });

        return d.promise();
      };

      return t.setup(test, {
        writer: writer,
        jooseReader: jooseReader,
        classCodeReader: classCodeReader,
        parseDefine: parseDefine,
        evalWritten: evalWritten
      });
    };

    test("acceptance: the writer returns a CojokoClass as CojokoCode", function() {
      var that = setup(this);

      var httpMessage = this.jooseReader.read('Psc.HTTPMessage', that.classCodeReader);

      var eolVisible = function(code) {
        return code.replace(/\n/g, "\n-n-").replace(/ /g, ".");
      };

      this.assertEquals(
        eolVisible(HTTPMessageCojokoCode),
        eolVisible(this.writer.write(httpMessage))
      );
    });

    test("the wrapper is named with moduleName in options", function() {
      var that = setup(this);
      var js = this.writer.write(EagleClass, {
        moduleName: "writtenEagleClass1"
      });

      var wrapper = that.parseDefine(js);

      this.assertAttributeEquals('writtenEagleClass1', 'moduleName', wrapper);
    });

    test("returns the class in the wrapper", function() {
      var that = setup(this);
      var js = this.writer.write(EagleClass);

      var wrapper = that.parseDefine(js);

      this.assertNotEquals(null, wrapper.returns, 'wrapper should have a first level return for the class');
    });

    test("writes all init values", function() {
      var that = setup(this);

      var js = this.writer.write(AllInitValuesClass);

      this.assertNotUndefined(js);
    });

    asyncTest("writes class with one mixin", function() {
      var that = setup(this);

      that.evalWritten(EagleClass).done(function(writtenClass, wrapper) {
        start();

        that.assertCojoko(writtenClass)
          .name('Eagle')
          .hasMixin('Flying');

        that.assertTrue(_(wrapper.params).contains('Flying'), 'Flying is in define wrapper');
      });
    });

    asyncTest("writes class with multiple mixins", function() {
      var that = setup(this);

      that.evalWritten(WolpertingerClass).done(function(writtenClass, wrapper) {
        start();

        that.assertCojoko(writtenClass)
          .name('Wolpertinger')
          .hasMixin('Flying')
          .hasMixin('Swimming')
          .hasMixin('Running');

        that.assertTrue(_(wrapper.params).contains('Flying'));
        that.assertTrue(_(wrapper.params).contains('Swimming'));
        that.assertTrue(_(wrapper.params).contains('Running'));
      });
    });

    asyncTest("writes class with extends", function() {
      var that = setup(this);

      that.evalWritten(EagleClass).done(function(writtenClass, wrapper) {
        start();

        that.assertCojoko(writtenClass)
          .name('Eagle')
          .isSubclassOf('Animal');

        that.assertTrue(_(wrapper.params).contains('Animal'));
      });
    });

    asyncTest("writes explicit and implicit dependencies from the correctly read cojokoClass to the file", function() {
      var that = setup(this);

      var DropBoxClass = this.jooseReader.read('Psc.UI.DropBox', that.classCodeReader);

      define('test-files/Cojoko/Psc/EventDispatching', function () { return Cojoko.Class('Psc.EventDispatching', {}); });
      define('test-files/Cojoko/Psc/Code', {});
      define('test-files/Cojoko/Psc/Exception', {});
      define('test-files/Cojoko/Psc/UI/WidgetWrapper', function () { return Cojoko.Class('Psc.UI.WidgetWrapper', {}); });
      define('jquery-ui', {});

      that.evalWritten(DropBoxClass).done(function(writtenClass, wrapper) {
        start();

        that.assertCojoko(writtenClass)
          .name('Psc.UI.DropBox')
          .isSubclassOf('Psc.UI.WidgetWrapper');

        // see ReaderTest.js for full expl
        //define(['joose', 'jquery', 'jquery-ui', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching', 'Psc/Code'], function(Joose, $) {
        var paths = _(wrapper.paths);

        that.assertTrue(_(wrapper.params).contains('$'));
        that.assertTrue(paths.contains('test-files/Cojoko/Psc/UI/WidgetWrapper'), 'Psc/UI/WidgetWrapper is a dependency');
        that.assertTrue(paths.contains('test-files/Cojoko/Psc/EventDispatching'));
        that.assertTrue(paths.contains('test-files/Cojoko/Psc/Code'));
        that.assertTrue(paths.contains('jquery'));
        that.assertTrue(paths.contains('jquery-ui'));
      });
    });

    asyncTest("writes old Depdencies with namespaces as a Construct in the define wrapper", function () {
      var that = setup(this);

      var OurClass = this.jooseReader.read('Test.NamespacedDependenciesClass', that.classCodeReader);
      var PscCode = Cojoko.Class('Psc.Code', {}), PscUIDropBox = Cojoko.Class('Psc.UI.DropBox', {});

      define('test-files/Cojoko/Psc/Code', function () { return  PscCode; });
      define('test-files/Cojoko/Psc/UI/DropBox', function () { return  PscUIDropBox; });
      define('jquery-ui', {});
      
      /*
      var Psc = {
        UI: {
           DropBox: require('Psc/UI/DropBox')
        },
        Code: require('Psc/Code')
      };
      */

      that.evalWritten(OurClass).done(function(writtenClass, wrapper) {
        start();

        that.assertCojoko(writtenClass)
          .name('Test.NamespacedDependenciesClass');

        var WrittenClass = Cojoko.runtimeCompile(writtenClass);
        var inst = new WrittenClass();

        that.assertSame(PscCode, inst.getCodeDependency());
        that.assertSame(PscUIDropBox, inst.getDropBoxDependency());
      });
    });
});