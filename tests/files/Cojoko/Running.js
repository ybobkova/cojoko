define(['Cojoko'],function (Cojoko) {
  return Cojoko.Mixin('Running', {
    run: function(meters) {
      return this.move(meters)+' On land, but fast (because its running).';
    }
  });
});