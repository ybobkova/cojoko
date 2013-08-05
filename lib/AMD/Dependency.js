define(['lodash'], function (_) {
  /**
   * A dependency consists of a path (in requirejs a module ID) and the dependency alias
   * 
   * define(['modules/id1'], function(id1Module))
   *
   * the path would be 'modules/id1' the alias would be id1Module
   * the alias might be undefined
   */
  return function (path, alias) {
    if (!_.isString(path)) {
      throw new Error('Parameter #1 (path) for dependency has to be a string.');
    }

    this.path = path;
    this.alias = alias;

    this.getAlias = function () {
      return this.alias;
    };

    this.hasAlias = function () {
      return this.alias !== undefined;
    };

    this.getPath = function () {
      return this.path;
    };
  };
});