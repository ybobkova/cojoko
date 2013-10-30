define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {

  var setup = function (test) {
    return t.setup(test, {});
  };

  
  test("the class and class instance are created correctly", function() {

    var that = setup(this);

    /* beginning of the example */
    var Price = Cojoko.Class('ACME.Exchange.Price', {

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
    /* end of the example */
  
    that.assertNotUndefined(Price, 'the class is not undefined');

    var googPrice = new Price({ value: 910.70, currency: 'USD' });

    that.assertEquals(910.70, googPrice.getValue());
    that.assertEquals('USD', googPrice.getCurrency());
    that.assertEquals(2, googPrice.getDecimals());

    // values from init()
    that.assertEquals(',', googPrice.getThousandsSeparator());
    that.assertEquals('.', googPrice.getDecimalsSeparator());

      // no setters
    that.assertUndefined(googPrice.setValue);
    that.assertUndefined(googPrice.setCurrency);

    googPrice.setDecimals(4);
    that.assertEquals(4, googPrice.getDecimals());
  });
});