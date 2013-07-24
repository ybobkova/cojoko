define(['Cojoko/Container', 'Cojoko/Class'], function (ContainerClass, CojokoClass) {
  var container = new ContainerClass();

  return {
    "Class": function(name, spec) {

      var classJS = container.getCompiler().compile(new CojokoClass(name, spec));

      var js = '';

      js += 'var CompiledClass = ';
      js += classJS+"\n";

      console.log(js);

      eval(js);

      return CompiledClass;
    }
  };

});