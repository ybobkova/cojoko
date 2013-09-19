define(['joose', 'jquery-ui', 'Psc/Code', 'Psc/UI/DropBox'], function(Joose, $) {

  Joose.Class('Test.NamespacedDependenciesClass', {

    methods: {
      getCodeDependency: function () {
        return Psc.Code;
      },

      getExceptionDependency: function () {
        return Psc.Exception;
      }
    }

  });
});