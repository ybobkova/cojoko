/*jshint evil:true */
define(['Cojoko/Container', 'Cojoko/Class'], function (ContainerClass, CojokoClass) {
  var container = new ContainerClass();

  return {
    "Class": function(name, spec) {

      var classJS = container.getCompiler().compile(new CojokoClass(name, spec));


      var CompiledClass;
      var js = '';

      js += 'CompiledClass = ';
      js += classJS+"\n";

      eval(js);

      return CompiledClass;
    }
  };

});