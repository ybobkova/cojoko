define(['Cojoko', 'Test/CojokoAsserter', 'lodash'], function (Cojoko, CojokoAsserter, _) {

  return {
    Cojoko: Cojoko,
    container: Cojoko.getContainer(),
    extend: function (test) {
      var asserter = new CojokoAsserter(test);

      test.assertCojoko = asserter.assertCojoko;
    },

    getTestClassCodeReader: function() {
      return _.extend(
        this.container.getClassCodeReader(), {
          getClassCode: function (fqn) {
            return require('text!test-files/Joose/'+fqn.replace(/\./g, '/')+'.js');
          }
        }
      );
    }
  };
});