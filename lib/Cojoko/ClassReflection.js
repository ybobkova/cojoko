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
      this.properties[name] = this.normalizePropertySpec(spec);
      return this;
    };

    this.normalizePropertySpec = function (spec) {
      return spec;
    };

    this.addMethod = function (name, body) {
      this.methods[name] = body;
      return this;
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