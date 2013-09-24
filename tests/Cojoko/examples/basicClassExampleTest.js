define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {

  var setup = function (test) {
    return t.setup(test, {});
  };

  
  test("the class is created correctly", function() {

    var that = setup(this);

    /* beginning of the example */  
    Cojoko.Class('ACME.Exchange.Share', {

      properties: {
        title: { is: 'rw', required: true, isPrivate: true },
        isin: { is: 'rw', required: true, isPrivate: true },
        wkn: { is: 'rw', required: true, isPrivate: true },
        price: { is:'rw', required: true, isPrivate: true, type: 'ACME.Exchange.Price' }
      },

      methods: {
        toString: function () {
          return this.title+' ('+this.isin+'/'+this.wkn+')';
        }
      }
    });
    /* end of the example */
  
    that.assertNotUndefined(ACME.Exchange.Share, 'the class is not undefined');
  });
});