define(['Cojoko'],function (Cojoko) {
  return Cojoko.Mixin('Flying', {
    fly: function(meters) {
      return this.move(meters)+' In the air (because its flying).';
    }
  });
});