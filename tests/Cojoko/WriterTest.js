/*jshint evil:true*/
define([
    'qunit-assert', 'test-setup', 'jquery', 'lodash', 'Cojoko', 'text!test-files/Cojoko/HTTPMessage.cojoko.js', 'Test/GetWrapper', 'escodegen',
    'test-files/Cojoko/Eagle', 'test-files/Cojoko/Wolpertinger',
    'text!test-files/Joose/Psc/HTTPMessage.js',
    'test-files/Cojoko/AllInitValues',
    'text!test-files/Joose/Psc/UI/DropBox.js'
  ],
  function(
    t, testSetup, $, _, Cojoko, HTTPMessageCojokoCode, getWrapper, escodegen,
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

        that.assertTrue(_(wrapper.params).contains('Flying'));
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

      that.evalWritten(EagleClass).done(function(writtenClass, wrapper) {
        start();

        that.assertCojoko(writtenClass)
          .name('Psc.UI.DropBox')
          .isSubClassOf('Psc.UI.WidgetWrapper');

        // see ReaderTest.js for full expl
        //define(['joose', 'jquery', 'jquery-ui', 'Psc/UI/WidgetWrapper', 'Psc/EventDispatching', 'Psc/Code'], function(Joose, $) {
        var paths = _(wrapper.paths);

        that.assertTrue(_(wrapper.params).contains('$'));
        that.assertTrue(paths.contains('Psc/UI/WidgetWrapper'));
        that.assertTrue(paths.contains('Psc/EventDispatching'));
        that.assertTrue(paths.contains('Psc/Code'));
        that.assertTrue(paths.contains('jquery'));
        that.assertTrue(paths.contains('jquery-ui'));
      });
    });
});