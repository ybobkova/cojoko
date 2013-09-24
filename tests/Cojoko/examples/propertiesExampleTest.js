define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {

  var setup = function (test) {
    return t.setup(test, {});
  };

  
  test("the class Person with properties is created correctly", function() {

    var that = setup(this);

    /* beginning of the example */
    var Person = Cojoko.Class({
      properties: {
        names: { is: 'gw', required: false, init: [], type: "Array" }
      },

      methods: {
        addNamePart: function (part) {
          this.names.push(part);

          return this;
        }
      }
    });

    var bob = new Person();
    bob.addNamePart("Bob").addNamePart("Kelzow");
    // bob.getNames() == ["Bob", "Kelzow"]

    var anna = new Person();
    anna.addNamePart("Anna");
    // anna.getNames() == ["Anna"]

    /* end of the example */

    that.assertNotUndefined(Person, 'the class is defined');
    that.assertNotUndefined(bob, 'bob is defined');
    that.assertNotUndefined(anna, 'anna is defined');
    that.isTrue(bob.names, ["Bob", "Kelzow"], 'bobs names are saved correctly');
    that.isTrue(anna.names, ["Anna"], 'annas names are saved correctly');
  });
});