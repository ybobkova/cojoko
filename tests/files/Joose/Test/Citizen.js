define(['joose', './Traveling'], function (Joose) {
    Joose.Class('Test.Citizen', {
      does: Test.Traveling,

      after:{
        initialize: function () {
          // pack the bags
        }
      }
    });
});