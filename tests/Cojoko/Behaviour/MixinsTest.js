define([
  'qunit-assert', 'test-setup', 'Cojoko',
  'test-files/Cojoko/Eagle',
  'test-files/Cojoko/Wolpertinger'

  ], function(t, testSetup, Cojoko, EagleClass, WolpertingerClass) {
  
  module("Cojoko.Behaviour.Mixins");

  var setup = function (test) {
    testSetup.extend(test);

    return t.setup(test, {
      Eagle: Cojoko.runtimeCompile(EagleClass),
      Wolpertinger: Cojoko.runtimeCompile(WolpertingerClass)
    });
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