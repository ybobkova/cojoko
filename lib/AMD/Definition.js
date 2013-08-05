define(['lodash'], function (_) {

  /**
   * A Asynchronous Module Definition in code looks like this:
   *
   * define(['dependency1', 'dependency2'], function (dep1, dep2) {
   *
   * });
   * 
   * the pairs of dep1: depencency1, dep2: dependency2 are called dependencies. Every dependency of an AMD is of class AMD/Dependency
   */
  return function () {
    var that = this;

    this.dependencies = [];
    this.aliasIndex = {};

    /**
     * @param object dependency string .path the requirejs path string, .name the name of the dependency which is bound like this in the define([..], function(nameOfDependency))
     */
    this.addDependency = function (dependency) {
      if (dependency.hasAlias()) {
        var storedDependency = this.getDependency(dependency.getAlias());

        if (storedDependency) {
          // check for consistency
          if (storedDependency.getPath() !== dependency.getPath()) {
            throw new Error("The dependency with alias: '"+dependency.getAlias()+"'' is already used for path: '"+storedDependency.getPath()+"' cannot use it for path: '"+dependency.getPath()+"')");
          } else {
            return this;
          }
        } else {
          this.dependencies.push(dependency);
          this.aliasIndex[dependency.getAlias()] = this.dependencies.length-1;
        }

      } else {
        this.dependencies.push(dependency);
      }
      
      return this;
    };

    this.getDependency = function (alias) {
      var index = this.aliasIndex[alias];
      return _.isNumber(index) ? this.dependencies[index] : undefined;
      //return _(this.dependencies).find({ 'name': name });
    };

    this.hasDependency = function (alias) {
      return this.aliasIndex[alias] !== undefined;
    };

    /**
     * @return array
     */
    this.getDependencies = function () {
      return this.dependencies;
    };
  };
});