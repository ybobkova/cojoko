define(['Cojoko', 'Test/CojokoAsserter'], function (Cojoko, CojokoAsserter) {

  return {
    Cojoko: Cojoko,
    container: Cojoko.getContainer(),
    extend: function (test) {
      var asserter = new CojokoAsserter(test);

      test.assertCojoko = asserter.assertCojoko;
    }
  };
});