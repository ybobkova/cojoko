define(['Cojoko'],function (Cojoko) {
 return Cojoko.Class('Animal', {
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
});