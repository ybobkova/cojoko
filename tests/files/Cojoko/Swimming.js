define(['Cojoko', 'lodash'],function (Cojoko, _) {
  return Cojoko.Mixin('Swimming', {
    swim: function(meters) {
      return this.move(meters)+' In water (because its swimming).';
    },

    say: function () {
      return 'blubb blubb'; // it cannot say something under water
    }
  });
});