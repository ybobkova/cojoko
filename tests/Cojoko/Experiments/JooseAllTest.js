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
  'Psc.CMS.NavigationService',
  'Psc.CMS.TabOpenable',
  'Psc.CMS.SelectComboBoxable',
  'Psc.CMS.AutoCompletable',
  'Psc.CMS.Identifyable',
  'Psc.CMS.DropBoxButtonable',
  'Psc.CMS.Buttonable',
  'Psc.CMS.FastItem',
  'Psc.CalendarCalculation',
  'Psc.CalendarEvent',
  'Psc.Code',
  'Psc.Container',
  'Psc.ContainerDepending',
  'Psc.ContainerInjecting',
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
  'Psc.UI.Controlling',
  'Psc.UI.DatePicker',
  'Psc.UI.DateTimePicker',
  'Psc.UI.Dialog',
  'Psc.UI.Dragger',
  'Psc.UI.DropBox',
  'Psc.UI.DropBoxButton',
  'Psc.UI.EffectsManager',
  'Psc.UI.EffectsManaging',
  'Psc.UI.ErrorPane',
  'Psc.UI.FormBuilder',
  'Psc.UI.FormBuilding',
  'Psc.UI.FormController',
  'Psc.UI.FormFields',
  'Psc.UI.FormReader',
  'Psc.UI.FormReading',
  'Psc.UI.GridPanel',
  'Psc.UI.GridTableEditor',
  'Psc.UI.GridTable',
  'Psc.UI.Group',
  'Psc.UI.HTML.Base',
  'Psc.UI.HTML.Builder',
  'Psc.UI.HTML.TagBuilder',
  'Psc.UI.InteractionProvider',
  'Psc.UI.InteractionProviding',
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
  'Psc.UI.LayoutManager.TemplateWidget',
  'Psc.UI.TemplateWidgetWrapper',
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
  'Psc.UI.Translating',
  'Psc.UI.TestInteractionProvider',
  'Psc.UI.UploadableFile',
  'Psc.UI.UploadableImage',
  'Psc.UI.WidgetWrapper',
  'Psc.UI.jqx.GridTableEditor',
  'Psc.UI.jqx.I18nWrapper',
  'Psc.UI.jqx.WidgetWrapper',
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
  'tiptoi.StringOutput',
  'tiptoi.Timer',
  'tiptoi.TitoGameEditor',
  'tiptoi.cpu'
    ];
    
    var requirePsc = requirejs.config({
      context: "psc-cms-js",
      baseUrl: "/psc-cms-js/lib"
    });

    var classCodeReader = testSetup.container.getClassCodeReader();
    classCodeReader.getClassCode = function (fqn) {
      return requirePsc('text!'+fqn.replace(/\./g, '/')+'.js');
    };

    var deps = _.map(classes, function (className) { return 'text!'+className.replace(/\./g, '/')+'.js'; });

    requirePsc(deps, function () { // preload deps-sources
      var cojoko;
      start();

      _.forEach(classes, function (className) {
        cojoko = that.reader.read(className, classCodeReader);

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