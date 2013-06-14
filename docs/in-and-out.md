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

### basic classlllllllllllllllllll

```javascript
Cojoko.Class('ACME.Exchange.Share', {

  has: {
    title: { is : 'rw', required: true, isPrivate: true },
    isin: { is : 'rw', required: true, isPrivate: true },
    wkn: { is : 'rw', required: true, isPrivate: true },
    currency: { is : 'rw', required: true, isPrivate: true }
  },

  toString: function () {
    return this.title+ ' ('+this.isin+'/'+this.wkn+')';
  }

});
```

 * Defines a class `Share` in the Namespace `ACME.Exchange`
 * the class has 4 properties title, isin, wkn, currency
 * the class has one simple method that transform the class to a string

> Joose backward compability: Joose compiled Cojoko can use `this.$$title` for referencing private properties.


```javascript
Cojoko.Class('ACME.Exchange.Price', {

  has: {

  },

  init: function (props) {

  }
});
```

> Joose backward compability: the construct `after: {  initialize: function() {} }` pattern will be converted into the init function.