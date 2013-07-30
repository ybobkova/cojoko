/*globals Test: true, requirejs: true */
define(['require',
  'qunit-assert', 'test-setup', 'lodash', 'joose'
  ], function(require, t, testSetup, _, Joose) {

  module("Cojoko.Experiments.JooseAll");

  var setup = function (test) {
    var reader = testSetup.container.getJooseReader();

    testSetup.extend(test);

    return t.setup(test, {reader: reader});
  };

  asyncTest("reads a lot of Psc Classes without error", function () {
    var that = setup(this);

    var classes = [
  'CoMun.CalendarEvent',
  'CoMun.City',
  'CoMun.Curver',
  'Psc.AjaxFormHandler',
  'Psc.AjaxHandler',
  'Psc.CMS.ComboDropBoxable',
  'Psc.CMS.FastItem',
  'Psc.CMS.NavigationService',
  'Psc.CMS.TabOpenable',
  'Psc.CalendarCalculation',
  'Psc.CalendarEvent',
  'Psc.Code',
  'Psc.Container',
  'Psc.Date',
  'Psc.EventDispatching',
  'Psc.EventManagerMock',
  'Psc.EventManager',
  'Psc.Exception',
  'Psc.FormRequest',
  'Psc.GuidManager',
  'Psc.HTTPMessage',
  'Psc.InvalidArgumentException',
  'Psc.Loader',
  'Psc.Numbers',
  'Psc.Request',
  'Psc.ResponseMetaReader',
  'Psc.Response',
  'Psc.TPL.TemplatesRenderer',
  'Psc.TableModel',
  'Psc.TextEditor',
  'Psc.TextParser',
  'Psc.UI.AutoComplete',
  'Psc.UI.Button',
  'Psc.UI.Calendar',
  'Psc.UI.CodeEditor',
  'Psc.UI.ComboBox',
  'Psc.UI.ComboDropBox',
  'Psc.UI.ContextMenuManager',
  'Psc.UI.Controller',
  'Psc.UI.DatePicker',
  'Psc.UI.DateTimePicker',
  'Psc.UI.Dialog',
  'Psc.UI.Dragger',
  'Psc.UI.DropBox',
  'Psc.UI.EffectsManager',
  'Psc.UI.ErrorPane',
  'Psc.UI.FormBuilder',
  'Psc.UI.FormController',
  'Psc.UI.FormFields',
  'Psc.UI.FormReader',
  'Psc.UI.GridPanel',
  'Psc.UI.GridTableEditor',
  'Psc.UI.GridTable',
  'Psc.UI.Group',
  'Psc.UI.HTML.Base',
  'Psc.UI.HTML.Builder',
  'Psc.UI.HTML.TagBuilder',
  'Psc.UI.InteractionProvider',
  'Psc.UI.LayoutManager.CollectionWidget',
  'Psc.UI.LayoutManager.ContentStreamWrapper',
  'Psc.UI.LayoutManager.Control',
  'Psc.UI.LayoutManager.DownloadsList',
  'Psc.UI.LayoutManager.Headline',
  'Psc.UI.LayoutManager.Image',
  'Psc.UI.LayoutManager.Li',
  'Psc.UI.LayoutManager.Paragraph',
  'Psc.UI.LayoutManager.Teaser',
  'Psc.UI.LayoutManager.WebsiteWidget',
  'Psc.UI.LayoutManagerComponent',
  'Psc.UI.LayoutManager',
  'Psc.UI.Main',
  'Psc.UI.Menu',
  'Psc.UI.MiniButtonPanel',
  'Psc.UI.NavigationNode',
  'Psc.UI.NavigationSelect',
  'Psc.UI.Navigation',
  'Psc.UI.PagesMenu',
  'Psc.UI.ResizableImage',
  'Psc.UI.SingleImage',
  'Psc.UI.Spinner',
  'Psc.UI.SplitPane',
  'Psc.UI.Tab',
  'Psc.UI.TableBuilder',
  'Psc.UI.Table',
  'Psc.UI.Tabs',
  'Psc.UI.Template',
  'Psc.UI.TestInteractionProvider',
  'Psc.UI.UploadableFile',
  'Psc.UI.UploadableImage',
  'Psc.UI.WidgetWrapper',
  'Psc.UI.jqx.GridTableEditor',
  'Psc.UI.jqx.I18nWrapper',
  'Psc.UploadService',
  'Psc.WrongValueException',
  'Psc.ko.Bindings.LayoutManager',
  'Psc.ko.Table',
  'tiptoi.ConsoleOutput',
  'tiptoi.GameEditor',
  'tiptoi.GameMaker',
  'tiptoi.GameSimulator',
  'tiptoi.GameTable',
  'tiptoi.InputProvider',
  'tiptoi.InteractiveInputProvider',
  'tiptoi.ProgramRunner',
  'tiptoi.SoundImporter',
  'tiptoi.Sound',
  'tiptoi.Timer',
  'tiptoi.TitoGameEditor',
  'tiptoi.cpu'
    ];
    var deps = _.map(classes, function (className) { return className.replace(/\./g, '/'); });

    var requirePsc = requirejs.config({
      context: "psc-cms-js",
      baseUrl: "/psc-cms-js/lib",

 /* set paths and vendor versions for applications
   *
   * paths are relative to lib
   * define all vendor dependencies here
   */
  paths: {
    'jquery': "../vendor/jquery/jquery-1.8.3.min",
    'jquery-ui': "../vendor/jquery-ui/jquery-ui-1.8.24.custom.patched",
    'jquery-ui-i18n': "../vendor/jquery-ui/jquery-ui-i18n.custom",
    "qunit": "../vendor/qunit/qunit-1.10.0",
    'joose': "../vendor/joose/all",
    'ace': "../vendor/ace/lib/ace",
    'lodash': "../vendor/lodash/lodash-0.10.0.min",
    'psc-tests-assert': '../vendor/qunit-assert/lib/assert',
    'test-setup': '../tests/setup',
    'qunit-assert': '../vendor/qunit-assert/lib/assert',
    'TestRunner': "../vendor/qunit-assert/lib/TestRunner",
    'img-files': '../img',
    'jquery-form': "../vendor/jquery-form/jquery.form-3.20",
    'jquery-fileupload': "../vendor/jquery-fileupload/jquery.fileupload",
    'jquery-iframe-transport': "../vendor/jquery-fileupload/jquery.iframe-transport",
    'jquery.ui.widget': "../vendor/jquery-fileupload/vendor/jquery.ui.widget",
    'jquery-tmpl': "../vendor/jquery-tmpl/jquery.tmpl",
    'jqwidgets': "../vendor/jqwidgets/jqx-all.min",
    'jquery-simulate': "../vendor/jquery-simulate/jquery.simulate.patched",
    'jquery-rangyinputs': "../vendor/jquery-rangyinputs/rangyinputs_jquery.min",
    'jquerypp': "../vendor/jquerypp/1.0.0/amd/jquerypp",
    'ui-connect-morphable': "../vendor/webforge/jquery.ui.connect-morphable",
    'ui-paging': "../vendor/webforge/ui.paging",
    "JSON": "../vendor/json/json2",
    "hogan": "../vendor/hogan/hogan-2.0.0.min.amd",
    'placeholder': "../vendor/mths.be/placeholder-2.0.6",
    'stacktrace': "../vendor/eriwen/stacktrace-min-0.4",
    'twitter-bootstrap': "../vendor/twitter-bootstrap/bootstrap",
    'twitter-typeahead': "../vendor/twitter/typeahead/typeahead.min",
    'knockout': "../vendor/knockout/knockout-2.2.1",
    'knockout-mapping': "../vendor/knockout/knockout.mapping",
    'test-files': "../tests/files",
    'knockout-bindings': "lib/Psc/ko/bindings",
    'jquery-selectrange': "../vendor/stackoverflow/jquery-selectrange",
    'jquery-global': "../vendor/jqwidgets/globalization/jquery.global",
    'jquery-global-de-DE': "../vendor/jqwidgets/globalization/jquery.glob.de-DE",
    'templates': "../templates",
    'html5shiv': "../vendor/afarkas/html5shiv",
    'i18next': '../vendor/i18next/i18next.amd.withJQuery-1.6.3.min'
  }
    });

    requirePsc(['require', 'boot-helper'], function (require, boot) {
      requirePsc(deps, function () {
        var cojoko;
        start();

        _.forEach(classes, function (className) {
          var jooseClass = window;
          _.forEach(className.split(/\./), function (part) {
            jooseClass = jooseClass[part];
          });

          cojoko = that.reader.read(jooseClass);

          that.assertCojoko(cojoko)
           .name(className)
          ;

          _.forEach(cojoko.reflection.getMethods(), function(method, name) {
            that.assertContainsNot('$$', method.toString(), 'method '+name+' in '+className+' contains still a $$');
          });
        });
      });
    });
  });
});