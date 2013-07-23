# usage

## what goes in and what comes out

This documentation part is a test-driven-documentation. That means these examples are extracted from the real tests of cojoko. You'll see a lot of assertions made with [QUnit-Assert](https://github.com/pscheit/qunit-assert).

Basically Cojoko is a compiling library for models. We built it to switch the OOP backend for your object models easily. Of course this is not used very often, but this is the reason why Cojoko is documented in behaviour style. You put a class definition into Cojoko and get something compiled out that works like your class was defined. It does not matter how the implementation archieves this behaviour, just that it works.

## Conventions

We assume that all examples written in Cojoko have the following header:
```javascript
define(['Cojoko'], function (Cojoko) {
  // your Cojoko code here  

});
```

### basic class

```javascript
Cojoko.Class('ACME.Exchange.Share', {

  properties: {
    title: { is : 'rw', required: true, isPrivate: true },
    isin: { is : 'rw', required: true, isPrivate: true },
    wkn: { is : 'rw', required: true, isPrivate: true },
    price: { is : 'rw', required: true, isPrivate: true, type: ACME.Exchange.Price }
  },

  methods: {
    toString: function () {
      return this.title+' ('+this.isin+'/'+this.wkn+')';
    }
  }

});
```

 * Defines a class `Share` in the Namespace `ACME.Exchange`
 * the class has 4 properties title, isin, wkn, currency
 * the class has one simple method that transform the class to a string

```javascript
Cojoko.Class('ACME.Exchange.Price', {

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
```

the following applies:

```javascript
var googPrice = new ACME.Exchange.Price({ value: 910.70, currency: 'USD' });

that.assertEquals(910.70, googPrice.getValue());
that.assertEquals('USD', googPrice.getCurrency());
that.assertEquals(2, googPrice.getDecimals());

// values from init()
that.assertEquals(',', googPrice.getThousandsSeparator());
that.assertEquals('.', googPrice.getDecimalsSeparator());

// no setters
that.assertUndefined(googPrice.setValue;
that.assertUndefined(googPrice.setCurrency;

googPrice.setDecimals(4);
that.assertEquals(4, googPrice.getDecimals());
```

### converting from joose

  * Joose compiled Cojoko can use `this.$$title` for referencing private properties.
  * the construct `after: {  initialize: function() {} }` pattern will be converted into the init function.
  * is: 'rw' will be converted to 'gs'

