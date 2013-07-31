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

});