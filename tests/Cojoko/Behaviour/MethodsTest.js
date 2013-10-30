define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {
  
  module("Cojoko.Behaviour.Methods");

  var setup = function (test) {
    return t.setup(test, {});
  };

  test("when properties are defined in root of class spec they are treated as methods", function () {
    var that = setup(this);

    try {
      Cojoko.RuntimeClass('ErrorWithPropertyInRoot', {

        lastName: {'is': 'rw', 'required': true},

        init: function (props) {

        }
      });

      this.fail('exception is not caught');
    } catch (Ex) {
      var message = Ex.toString();

      this.ok('exception is caught with message '+message);
      this.assertContains('Wrap your properties with properties: {', message);
    }

  });

  test("setters can be overriden", function () {
    var that = setup(this);

    var o = new (Cojoko.RuntimeClass({
      properties: {
        value: { is : 'gs', required: false, isPrivate: true }
      },

      methods: {
        setValue: function () {
          this.value = 'overidden';
        }
      }
    }))();

    o.setValue(false);
    this.assertEquals('overidden', o.getValue(), 'value setter is overidden');
  });


  test("getters can be overriden", function () {
    var that = setup(this);

    var o = new (Cojoko.RuntimeClass({
      properties: {
        value: { is : 'gs', required: false, isPrivate: true }
      },

      methods: {
        getValue: function () {
          return 'overidden';
        }
      }
    }))();

    o.setValue(false);
    this.assertEquals('overidden', o.getValue(), 'value getter is overidden');
  });

  test("a cojoko method gets variables inherited from class scope", function() {
    var Psc = {
      'Code': { name: 'Psc.Code' },
      'UI': { 'DropBox': { name: 'Psc.UI.DropBox' } }
    };
    var fn;

    var ScopeClass = Cojoko.Class('ScopeClass', {
      methods: {
        getCodeDependency: fn = function () {
          return Psc.Code;
        },

      getDropBoxDependency: function () {
        return Psc.UI.DropBox;
      }
    }});

    var CompiledScopeClass = Cojoko.runtimeCompile(ScopeClass);
    var scopeObject = new CompiledScopeClass();

    this.assertSame(Psc.Code, scopeObject.getCodeDependency());
  });
});