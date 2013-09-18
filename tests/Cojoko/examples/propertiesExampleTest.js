define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {

  var setup = function (test) {
    return t.setup(test, {});
  };

  
  test("the class Person with properties is created correctly", function() {

    var that = setup(this);

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

    that.assertNotUndefined(Person, 'the class is defined');
    that.assertNotUndefined(bob, 'bob is defined');
    that.assertNotUndefined(anna, 'anna is defined');
    that.isTrue(bob.names, ["Bob", "Kelzow"], 'bobs names are saved correctly');
    that.isTrue(anna.names, ["Anna"], 'annas names are saved correctly');
  });

  test("the class Person with init is created correctly", function() {

    var that = setup(this);

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

    that.assertNotUndefined(Person, 'the class is created');
  });
});