define(['joose'], function (Joose) {
  Joose.Class('Test.JooseClassWithNoIsProperty', {

      has: {
        noIsProperty: { is: '', required: false }
      }

    });
});