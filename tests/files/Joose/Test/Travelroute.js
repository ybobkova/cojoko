define(['joose'], function (Joose) {
    Joose.Class('Test.Travelroute', {

      has: {
        length: {is:'w', init: 17},
        unit: {is:'rw', init: 'm'}
      },

      methods: {
        hasValidLength: function () {
          var that = this;

          return this.$$length > 0 && that.$$unit !== undefined;
        }
      }
    });
});