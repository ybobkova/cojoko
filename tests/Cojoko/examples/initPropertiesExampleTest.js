define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {

  var setup = function (test) {
    return t.setup(test, {});
  };

  test("the class Person with init is created correctly", function() {

    var that = setup(this);

    /* beginning of the example */
    var Person = Cojoko.Class({
      properties: {
        name: { is: 'gw', required: false, init: 'P', type: "String" },
        lastName: { is: 'gw', required: false, init: 'Sc', type: "String" }
      },

      methods: {
        init: function (props) {

        // when props.name is === undefined this.name is 'P'
        // when props.lastName is === undefined this.name is 'Sc'

        // when props.name is !== undefined as 'foo' this.name is 'foo'
        // when props.lastName is !== undefined as 'foo' this.lastName is 'foo'
        }
      }  
    });
    /* end of the example */

    that.assertNotUndefined(Person, 'the class with init is created');
  });
});