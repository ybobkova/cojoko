define(['lodash'], function (_) {

  return function () {
    var that = this;

    this.properties = {};
    this.methods = {};
    this.mixins = {};
    this.extend = undefined;
    this.mixin = false;

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

    this.getMethod = function (name) {
      return this.methods[name];
    };

    this.getMethods = function () {
      return this.methods;
    };

    this.addMixin = function (cojokoClass) {
      this.mixins[cojokoClass.getName()] = cojokoClass;
      return this;
    };

    this.isSubclassOf = function (className) {
      return this.mixins[className] !== undefined || this.extend && this.extend.getName() === className;
    };

    this.hasMixin = function (className) {
      return this.mixins[className] !== undefined;
    };

    this.getMixins = function () {
      return this.mixins;
    };

    this.getExtends = function () {
      return this.extend;
    };

    this.setExtends = function (cojokoClass) {
      this.extend = cojokoClass;
      return this;
    };

    this.setMixin = function (is) {
      this.mixin = is === undefined ? true : !!is;
      return this;
    };

    this.isMixin = function () {
      return this.mixin;
    };
  };
});