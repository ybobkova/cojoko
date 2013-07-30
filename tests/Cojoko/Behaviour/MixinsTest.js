define(['qunit-assert', 'test-setup', 'Cojoko'], function(t, testSetup, Cojoko) {
  
  module("Cojoko.Behaviour.Mixins");

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

    var Flying = Cojoko.Mixin('Flying', {
      fly: function(meters) {
        return this.move(meters)+' In the air (because its flying).';
      }
    });

    var Eagle = Cojoko.Class('Eagle', {
      'extends': Animal,

      mixins: [Flying]
    });

    var Swimming = Cojoko.Mixin('Swimming', {
      swim: function(meters) {
        return this.move(meters)+' In water (because its swimming).';
      },

      say: function () {
        return 'blubb blubb'; // it cannot say something under water
      }
    });

    var Running = Cojoko.Mixin('Running', {
      run: function(meters) {
        return this.move(meters)+' On land, but fast (because its running).';
      }
    });

    var Wolpertinger = Cojoko.Class('Wolpertinger', {
      'extends': Animal,

      mixins: [Flying, Swimming, Running]
    });

    testSetup.extend(test);

    return t.setup(test, {Animal: Animal, Wolpertinger: Wolpertinger, Running: Running, Swimming:Swimming, Flying: Flying, Eagle: Eagle});
  };

  test("class extends with mixins gets all methods from extend AND from all mixins", function () {
    var that = setup(this);

    var eagle = new that.Eagle({name: 'Eagly'});

    that.assertFunction(eagle.move, 'eagle has method move from animal');
    that.assertFunction(eagle.say, 'eagle has method say from animal');
    that.assertFunction(eagle.fly, 'eagle has method fly from Flying');

    var wolpi = new that.Wolpertinger({name: 'Wolpi'});

    that.assertFunction(wolpi.move, 'wolpertinger has method move from animal');
    that.assertFunction(wolpi.say, 'wolpertinger has method say from animal');

    // flying, Swimming, Running
    that.assertFunction(wolpi.fly, 'wolpertinger has method fly from Flying');
    that.assertFunction(wolpi.swim, 'wolpertinger has method swim from Flying');
    that.assertFunction(wolpi.run, 'wolpertinger has method run from Flying');
  });

});