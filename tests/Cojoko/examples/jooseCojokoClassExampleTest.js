define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {

  var setup = function (test) {
    return t.setup(test, {});
  };

  
  test("the class is created correctly", function() {

    var that = setup(this);

    /* beginning of the example */
    define(['cojoko', 'Psc/HTTPMessage'], function (Cojoko, HTTPMessage) {
      Cojoko.Class('Psc.Response', {

        isa: HTTPMessage,
  
        has: {
          code: { is : 'gs', required: true },
          reason: { is : 'gs', required: false, init: null },
          body: { is : 'gs', required: false, init: null }
        },
    
        init: function (props) {
          if (props.headers) {
            this.parseHeader(props.headers);
          }
        
          if (typeof(this.getCode()) === 'string') {
            this.setCode(parseInt(this.code, 10));
          }
        },
  
        toString: function () {
          return '[Psc.Response Code: '+this.code+']';
        },
      
        isValidation: function() {
          return this.getHeaderField('X-Psc-Cms-Validation') === 'true';
        }
      });
    });
    /* end of the example */

    that.assertNotUndefined(Psc.Response, 'the class is defined');
    that.isTrue(Psc.Response.code.required, 'the attributes are created');
  });
});