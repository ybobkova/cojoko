define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {
  
  module("Cojoko.Behaviour.Inheritance");

  var setup = function (test) {
    var Animal = Cojoko.Class('Animal', {

      properties: {
        name: {'is': 'g', required: true},
        distanceMoved: {'is': 'g', required: false, init: 0}
      },
      
      methods: {
        move: function(meters) {
          this.distanceMoved += meters;
          return this.name+' moved '+meters+'m.';
        },

        say: function (what) {
          return this.name+' says: '+what;
        }
      }
    });

    var Snake = Cojoko.Class('Snake', {
      'extends': Animal,

      properties: {
        noxious: {'is': 'rw', required: false, init: false}
      },

      methods: {
        isNoxious: function () {
          return this.noxious;
        },

        move: function(meters) {
          return this.SUPER(meters)+' Slithering...';
        }
      }
    });


    var Horse = Cojoko.Class('Horse', {
      'extends': Animal
    });

    testSetup.extend(test);

    return t.setup(test, {Animal: Animal, Snake: Snake, Horse: Horse});
  };

  test("subclass inherits all methods from parentclass", function () {
    var that = setup(this);

    var horse = new that.Horse({name: 'Jolly Jumper'});

    that.assertNotUndefined(horse.say, 'horse has method say from Animal');
    that.assertNotUndefined(horse.getDistanceMoved, 'horse has getter for distanceMoved from Animal');
  });

  test("subclass inherits all properties from parentclass", function () {
    var that = setup(this);

    var horse = new that.Horse({name: 'Incitatus'});

    that.assertNotUndefined(horse.name, 'property name is inherited from animal');
    that.assertNotUndefined(horse.distanceMoved, 'property distanceMoved is inherited from animal');

    horse.move(5);
    horse.move(10);

    that.assertEquals(5+10, horse.getDistanceMoved());
  });

  test("subclass has its own methods as well", function() {
    var that = setup(this);

    var snake = new that.Snake({name: 'Poisy', noxious: true});

    that.assertTrue(snake.isNoxious());
    that.assertNotUndefined(snake.move, 'move is overriden or inherited from Animal');
  });

  test("subclass can call the super method of the parent class", function () {
    var that = setup(this);

    var snake = new that.Snake({name: 'Slithery'});

    that.assertEquals("Slithery moved 20m. Slithering...", snake.move(20));
  });
});