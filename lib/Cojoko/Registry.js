define(['lodash'], function (_) {

  return function(Cojoko) {
    var that = this;
    var compiledClasses = {};

    this.getClassFor = function (mixed) {
      if (!mixed) {
        throw new Error('Registry: Cannot getClassFor(): undefined');
      }

      if (Cojoko.isClass(mixed)) {
        return mixed;
      }

      if (Cojoko.isCompiledConstructor(mixed) || _.isObject(mixed) && mixed.cojokoId) {
        if (compiledClasses[mixed.cojokoId]) {
          return compiledClasses[mixed.cojokoId].cojoko;
        } else {
          throw new Error('Registry: getClassFor() argument #1 is a compiled constructor but the corrosponding class for the compiled class is not found (id: '+mixed.cojokoId);
        }
      }

      throw new Error('Registry: Cannot getClassFor(): '+mixed.toString());
    };

    this.hasCompiledClass = function(id) {
      return compiledClasses[id] !== undefined;
    };

    this.getCompiledClass = function(id) {
      return compiledClasses[id];
    };

    this.hashCompiled = function(cojokoClass, CompiledClass) {
      compiledClasses[cojokoClass.getId()] = {
        cojoko: cojokoClass,
        compiled: CompiledClass
      };
    };

  };
});