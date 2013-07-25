/*jshint evil:true */
define(['Cojoko/Container', 'Cojoko/Class', 'Cojoko/debug', 'lodash'], function (ContainerClass, CojokoClass, debug, _) {
  var container = new ContainerClass();
  var compiledClasses = {};

  return {
    "Class": function(name, spec) {

      var cojokoClass = new CojokoClass(name, spec, this);

      return this.runtimeCompileClass(cojokoClass);
    },

    runtimeCompileClass: function(cojokoClass) {
      var id = cojokoClass.getId();

      // cache hit?
      if (compiledClasses[id]) {
        return compiledClasses[id].compiled;
      }

      var compiled = container.getCompiler().compile(cojokoClass);
      var doCompile, js = 'doCompile = '+compiled.js;

      eval(js);

      var doCompileArgs = [];
      for (var i = 0, neededClass; i < compiled.neededClasses.length; i++) {
        neededClass = compiled.neededClasses[i];

        doCompileArgs.push(
          this.runtimeCompileClass(neededClass) // recursive
        );
      }

      try {
        var CompiledClass = doCompile.apply(this, doCompileArgs);

        CompiledClass.cojokoId = cojokoClass.getId();

        // cache
        compiledClasses[cojokoClass.getId()] = {
          cojoko: cojokoClass,
          compiled: CompiledClass
        };

        return CompiledClass;

      } catch (Ex) {
        throw new Error("Cojoko: Error while compiling runtime compiled cojoko class: "+cojokoClass.getName()+" (id: "+id+").\n Reason: "+Ex.toString()+".\n\nCompiled Code:\n"+js);
      }
    },

    // implement ClassRegistry
    getClassFor: function (mixed) {
      if (this.isClass(mixed)) {
        return mixed;
      }

      if (this.isCompiledConstructor(mixed)) {
        if (compiledClasses[mixed.cojokoId]) {
          return compiledClasses[mixed.cojokoId].cojoko;
        } else {
          throw new Error('Registry: getClassFor() argument #1 is a compiled constructor but the corrosponding class for the compiled class is not found (id: '+mixed.cojokoId);
        }
      }

      throw new Error('Registry: Cannot getClassFor(): '+mixed.toString());
    },

    isCompiledConstructor: function(compiledCojokoClassConstructor) {
      return _.isFunction(compiledCojokoClassConstructor) && compiledCojokoClassConstructor.cojokoId;
    },

    isClass: function(cojokoClass) {
      return _.isObject(cojokoClass) && cojokoClass instanceof CojokoClass;
    }
  };
});