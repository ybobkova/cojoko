define(['Cojoko/Container', 'Cojoko/Class'], function (Container, CojokoClass) {
  return {
    "Class": function(name, spec) {
      return new CojokoClass(name, spec);
    }
  };

});