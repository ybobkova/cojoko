define(['Cojoko', './Animal', './Flying', './Running', './Swimming'],function (Cojoko, Animal, Flying, Running, Swimming) {
  return Cojoko.Class('Wolpertinger', {
    'extends': Animal,

    mixins: [Flying, Swimming, Running]
  });
});