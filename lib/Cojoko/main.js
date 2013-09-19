/*jshint evil:true */
define(['Cojoko/Container', 'Cojoko/Class', 'Cojoko/Registry', 'Cojoko/debug', 'lodash'], function (ContainerClass, CojokoClass, Registry, debug, _) {

  var CojokoMainClass = function() {
    var that = this;

    var container = new ContainerClass(this);
    var registry = new Registry(this);

    _.extend(this, {
      /**
       * Returns a class
       */
      "Class": function (name, spec) {
        return new CojokoClass(name, spec, this);
      },

      /**
       * Returns a mixin
       */
      Mixin: function (name, spec) {
        var cojokoClass = new CojokoClass(name, spec, this);
        cojokoClass.reflection.setMixin(true);

        return cojokoClass;
      },

      /**
       * Returns a class that is directly usable at runtime
       */
      RuntimeClass: function(name, spec) {
        return this.runtimeCompile(this.Class(name, spec));
      },

      /**
       * Returns a Mixin that is directly usable at runtime
       */
      RuntimeMixin: function(name, spec) {
        return this.runtimeCompile(this.Mixin(name, spec));
      },

      /**
       * @return CompiledClass
       */
      runtimeCompile: function(cojokoClass) {
        var id = cojokoClass.getId();

        // cache hit?
        if (registry.hasCompiledClass(id)) {
          return registry.getCompiledClass(id).compiled;
        }

        var compiled = container.getCompiler().compile(cojokoClass);
        var doCompile, js = 'doCompile = '+compiled.js;

        try {
          eval(js);

          var doCompileArgs = [];
          for (var i = 0, neededClass; i < compiled.neededClasses.length; i++) {
            neededClass = compiled.neededClasses[i];

            doCompileArgs.push(
              this.runtimeCompile(neededClass) // recursive
            );
          }

          var CompiledClass = doCompile.apply(this, doCompileArgs);

          CompiledClass.cojokoId = cojokoClass.getId();

          // cache
          registry.hashCompiled(cojokoClass, CompiledClass);

          return CompiledClass;

        } catch (Ex) {
          var info = '';
          if (Ex.lineNumber) {
            info += ' on line: '+Ex.lineNumber;
          }

          throw new Error("Cojoko: Error while compiling runtime compiled cojoko class: "+cojokoClass.getName()+" (id: "+id+").\n Reason: "+Ex.toString()+info+".\n\nCompiled Code:\n"+js);
        }
      },

      getClassFor: function (mixed) {
        return registry.getClassFor(mixed);
      },

      isCompiledConstructor: function (compiledCojokoClassConstructor) {
        return _.isFunction(compiledCojokoClassConstructor) && compiledCojokoClassConstructor.cojokoId;
      },

      isClass: function (cojokoClass) {
        return _.isObject(cojokoClass) && cojokoClass instanceof CojokoClass;
      },

      getContainer: function () {
        return container;
      }
    });
  };

  return new CojokoMainClass();
});