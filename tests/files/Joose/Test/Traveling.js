define(['joose', './Flying', './Swimming'], function (Joose) {
    Joose.Role('Test.Traveling', {
      does: [Test.Flying, Test.Swimming]
    });
});