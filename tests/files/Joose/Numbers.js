define(['joose'], function (Joose) {
  Joose.Class('Psc.Numbers', {
    
    has: {
      //attribute1: { is : 'rw', required: false, isPrivate: true }
    },
  
    my: {
      methods: {
        randomInt: function(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        formatBytes: function (bytes) {
          if (typeof bytes !== 'number') {
            return '';
          }
          if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
          }
          if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
          }
          
          return (bytes / 1000).toFixed(2) + ' KB';
        }
      }
    },
    
    methods: {
      
      toString: function() {
        return "[Psc.Numbers]";
      }
    }
  });
});