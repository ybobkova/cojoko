define(['joose'], function (Joose) {
    Joose.Role('Test.Flying', {
      after: {
        initialize: function () {
          // expand wings
        }
      },

      methods: {
        fly: function () {}
      }
    });
});
