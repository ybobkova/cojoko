define(['Cojoko/Container', 'Test/CojokoAsserter'], function (Container, CojokoAsserter) {

  return {
    container: new Container(),
    extend: function (test) {
      var asserter = new CojokoAsserter(test);

      test.assertCojoko = asserter.assertCojoko;
    }
  };
});