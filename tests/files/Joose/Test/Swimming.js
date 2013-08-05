define(['joose', 'lodash'], function (Joose, _) {
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