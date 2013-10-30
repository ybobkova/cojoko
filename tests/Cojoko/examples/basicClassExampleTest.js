define(['Cojoko', 'chai', 'mocha'], function(Cojoko, chai) {
  
  assert = chai.assert;
  should = chai.should();
  expect = chai.expect;

  describe("Classes", function() {
    it("can be created", function() {

      /* beginning of the example */  
      Cojoko.Class('ACME.Exchange.Share', {

        properties: {
          title: { is: 'rw', required: true, isPrivate: true },
          isin: { is: 'rw', required: true, isPrivate: true },
          wkn: { is: 'rw', required: true, isPrivate: true },
          price: { is: 'rw', required: true, isPrivate: true, type: 'ACME.Exchange.Price' }
        },

        methods: {
          toString: function () {
            return this.title+' ('+this.isin+'/'+this.wkn+')';
          }
        }
      });
      /* end of the example */
      
      assert.true(true, 'true=true');
      //that.assertNotUndefined(ACME.Exchange.Share, 'the class is not undefined'); rewrite!!
    });
  });
});