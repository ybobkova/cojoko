define(['lodash'], function (_) {

  return function () {
    var that = this;

    this.properties = {};
    this.methods = {};

    this.getProperties = function () {
      return that.properties;
    };

    this.addProperty = function (name, spec) {
      that.properties[name] = that.normalizePropertySpec(spec);
      return this;
    };

    this.normalizePropertySpec = function (spec) {
      return spec;
    };

    this.addMethod = function (name, body) {
      that.methods[name] = body;
      return this;
    };

    this.getMethods = function () {
      return this.methods;
    };
  }
});