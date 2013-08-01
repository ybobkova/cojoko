define(['joose'], function (Joose) {
    Joose.Role('Test.Swimming', {
      before: {
        initialize: function () {
          // prepare rubber-duck
        }
      },

      methods: {
        swim: function () {}
      }
    });

});
