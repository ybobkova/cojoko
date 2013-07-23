/*globals ACME:true */
define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {
  
  module("Cojoko.Behaviour.Methods");

  var setup = function (test) {
    var googPrice = null;

    return t.setup(test, {googPrice: googPrice});
  };

  test("setters can be overriden", function () {
    var that = setup(this);

    var o = new (Cojoko.Class({
      properties: {
        value: { is : 'gs', required: true, isPrivate: true }
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

    var o = new (Cojoko.Class({
      properties: {
        value: { is : 'gs', required: true, isPrivate: true }
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