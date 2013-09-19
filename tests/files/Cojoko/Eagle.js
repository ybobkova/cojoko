define(['Cojoko', './Animal', './Flying'],function (Cojoko, Animal, Flying) {
  return Cojoko.Class('Eagle', {
    'extends': Animal,

    mixins: [Flying]
  });
});