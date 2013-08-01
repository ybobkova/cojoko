define(['joose'], function (Joose) {
    Joose.Class('Test.InitObject', {

      has: {
        objectProperty: {is:'w', init: Joose.I.Object},
        arrayProperty: {is:'rw', init: Joose.I.Array}
      }

    });
});