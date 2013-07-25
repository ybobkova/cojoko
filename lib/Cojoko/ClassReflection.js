define(['lodash'], function (_) {

  return function () {
    var that = this;

    this.properties = {};
    this.methods = {};
    this.mixins = {};

    this.getProperties = function () {
      return this.properties;
    };

    this.addProperty = function (name, spec) {
      this.properties[name] = this.normalizePropertySpec(spec, name);
      return this;
    };

    this.normalizePropertySpec = function (spec, name) {
      spec.name = name;

      spec.getGetterName = function () {
        return 'get'+this.name.substr(0, 1).toUpperCase() + this.name.substr(1);
      };

      spec.getSetterName = function () {
        return 'set'+this.name.substr(0, 1).toUpperCase() + this.name.substr(1);
      };

      if (!spec.hasOwnProperty('init')) {
        spec.init = undefined;
      }

      if (!spec.hasOwnProperty('is')) {
        spec.is = '';
      }

      return spec;
    };

    this.addMethod = function (name, body) {
      this.methods[name] = body;
      return this;
    };

    this.hasMethod = function (name) {
      return this.methods[name] !== undefined;
    };

    this.getMethods = function () {
      return this.methods;
    };

    this.addMixin = function (className) {
      this.mixins[className] = true;
      return this;
    };

    this.isSubclassOf = function (className) {
      return this.mixins[className] !== undefined;
    };

    this.hasMixin = function (className) {
      return this.mixins[className] !== undefined;
    };
  };
});