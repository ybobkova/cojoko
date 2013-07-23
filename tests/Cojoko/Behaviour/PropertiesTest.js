define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {
  
  module("Cojoko.Behaviour.Properties");

  var Price = Cojoko.Class({
  
    properties: {
      value: { is : 'g', required: true, isPrivate: true },
      currency: { is : 'g', required: true, isPrivate: true },
  
      decimals: { is : 'gs', required: false, isPrivate: true, init: 2 },
      thousandSeparator: { is : 'g', required: false, isPrivate: true },
      decimalsSeparator: { is : 'g', required: false, isPrivate: true }
    },
  
    methods: {
      init: function (props) {
  
        if (!props.decimalsSeparator) {
          this.decimalsSeparator = props.currency === 'USD' ? '.' : ',';
        }
  
        if (!props.thousandsSeparator) {
          this.thousandsSeparator = props.currency === 'USD' ? ',' : '.';
        }
      }
    }
  });

  var setup = function (test) {
    var googPrice = new Price({ value: 910.70, currency: 'USD' });

    return t.setup(test, {googPrice: googPrice});
  };
  
  test("values given through constructor are applied to properties", function() {
    var that = setup(this), googPrice = this.googPrice;

    that.assertEquals(910.70, googPrice.getValue());
    that.assertEquals('USD', googPrice.getCurrency());

  });

  test("values with init value have the init value if not supplied by constructor", function() {
    var that = setup(this);

    that.assertEquals(2, this.googPrice.getDecimals());
  });

  test("values can be applied from init() function", function() {
    var that = setup(this), googPrice = this.googPrice;

    that.assertEquals(',', googPrice.getThousandsSeparator());
    that.assertEquals('.', googPrice.getDecimalsSeparator());
  });

  test("only setters are generated if s is supplied", function() {
    var that = setup(this), googPrice = this.googPrice;

    // no setters
    that.assertUndefined(googPrice.setValue);
    that.assertUndefined(googPrice.setCurrency);
    that.assertUndefined(googPrice.setThousandsSeparator);
    that.assertUndefined(googPrice.setDecimalsSeparator);

    // setter
    that.assertNotUndefined(googPrice.setDecimals);
  });

  test("setters do work", function() {
    var that = setup(this), googPrice = this.googPrice;

    that.assertEquals(2, googPrice.getDecimals());
    googPrice.setDecimals(4);
    that.assertEquals(4, googPrice.getDecimals());
  });

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