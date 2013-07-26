define(['qunit-assert', 'test-setup', 'Cojoko', 'lodash'], function(t, testSetup, Cojoko, _) {
  
  module("Cojoko.Behaviour.Properties");

  var Price = Cojoko.Class('TestPrice', {
  
    properties: {
      value: { is : 'g', required: true, isPrivate: true },
      currency: { is : 'g', required: true, isPrivate: true },
  
      decimals: { is : 'gs', required: false, isPrivate: true, init: 2 },
      thousandsSeparator: { is : 'g', required: false, isPrivate: true },
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
  
  test("getters are generated if g is supplied", function() {
    var that = setup(this), googPrice = this.googPrice;

    that.assertNotUndefined(googPrice.getValue);
    that.assertNotUndefined(googPrice.getCurrency);
    that.assertNotUndefined(googPrice.getDecimals);
    that.assertNotUndefined(googPrice.getThousandsSeparator);
    that.assertNotUndefined(googPrice.getDecimalsSeparator);
  });

  test("values given through constructor are applied to properties", function() {
    var that = setup(this), googPrice = this.googPrice;

    that.assertEquals(910.70, googPrice.getValue());
    that.assertEquals('USD', googPrice.getCurrency());

  });

  test("values with init value have the init value if not supplied by constructor", function() {
    var that = setup(this);

    that.assertEquals(2, this.googPrice.getDecimals());
  });

  test("init() is called / values are be applied from init() function", function() {
    var that = setup(this), googPrice = this.googPrice;

    that.assertEquals(',', googPrice.getThousandsSeparator());
    that.assertEquals('.', googPrice.getDecimalsSeparator());
  });

  test("init is called after init-values for properties are applied to the initial object state", function () {
    var that = setup(this);

    // please note: that is not defined in init from test ! Because its recompiled from Cojoko and evaluated in other scope
    var Person = Cojoko.Class('TestPerson1', {
      properties: {
        name: { is: 'gw', required: false, init: 'P', type: "String" },
        lastName: { is: 'gw', required: false, init: 'Sc', type: "String" }
      },

      methods: {
        init: function (props) {

          if (props.case1) {
            // when props.name is === undefined this.name is 'P'
            props.test.assertUndefined(props.name);
            props.test.assertEquals('P', this.name);
            // when props.lastName is === undefined this.name is 'Sc'
            props.test.assertUndefined(props.lastName);
            props.test.assertEquals('Sc', this.lastName);

          } else {
           // when props.name is !== undefined as 'foo' this.name is 'foo'
            props.test.assertNotUndefined(props.name);
            props.test.assertEquals('foo', this.name);
           // when props.lastName is !== undefined as 'bar' this.lastName is 'bar'
            props.test.assertNotUndefined(props.lastName);
            props.test.assertEquals('bar', this.lastName);
          }
        }
      } 
    });

    new Person({
      'case1': true,
      test: that
    });

    new Person({
      'case1': false,
      'name': 'foo',
      'lastName': 'bar',
      test: that
    });

  });

  test("init value array", function() {
    var that = setup(this);

    var ArrayValueClass = Cojoko.Class('ArrayValueClass', {
      properties: {
        value: { is: 'gs', required: false, isPrivate: true, init: [] }
      }
    });

    var o1 = new ArrayValueClass();
    var init1 = o1.getValue();

    this.assertTrue(_.isArray(init1));

    var o2 = new ArrayValueClass();
    var init2 = o2.getValue();
    
    this.assertNotSame(init1, init2);
  });


  test("init value object", function() {
    var that = setup(this);

    var ObjectValueClass = Cojoko.Class('ObjectValueClass', {
      properties: {
        value: { is: 'gs', required: false, isPrivate: true, init: {} }
      }
    });

    var o1 = new ObjectValueClass();
    var init1 = o1.getValue();

    this.assertTrue(_.isObject(init1));

    var o2 = new ObjectValueClass();
    var init2 = o2.getValue();
    
    this.assertNotSame(init1, init2);
  });

  test("all required properties has to be set", function () {
    var that = setup(this);

    try {
      new Price({currency: 'EUR'});

      that.fail('no Exception was thrown, allthough value is missing');
    } catch (Ex) {
      that.ok('exception cought with: '+Ex.toString());
      that.assertContains("Missing property 'value'", Ex.toString());
    }
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
});