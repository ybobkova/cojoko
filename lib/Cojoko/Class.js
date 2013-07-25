define(['./ClassReflection', 'lodash'], function (ClassReflection, _) {

  return function (name, spec, classRegistry) {
    var that = this;

    if (typeof(name) === 'object' && spec === undefined) {
      spec = name;
      name = undefined;
    }

    this.name = name;
    this.id = undefined;

    this.initReflection = function (spec)  {
      that.reflection = new ClassReflection();

      _.forEach(spec, function (value, key) {
        if (key === 'has' || key === 'properties') {
          _.forEach(value, function (propertySpec, name) {
            that.reflection.addProperty(name, propertySpec);
          });

        } else if (key === 'methods') {
          _.forEach(value, function (body, name) {
            that.reflection.addMethod(name, body);
          });

        } else if (key === 'extends') {

          try {
            that.reflection.setExtends(classRegistry.getClassFor(value));
          } catch (Ex) {
            var error = new Error('Parameter to extends must be a valid Compiled CojokoClass Constructor OR a valid CojokoClass. Error in specification of class: '+name+' Reason: '+Ex.toString());
            error.previousError = Ex;

            throw error;
          }

        } else if (key === 'mixins') {
          _.forEach(value, function (name) {
            that.reflection.addMixin(name);
          });

        } else {

          if (!_.isFunction(value)) {
            throw new Error('Only methods are allowed to be defined in root. Wrap your properties with properties: {. Error in specification of class: '+name);
          }

          that.reflection.addMethod(key, value);
        }

      });
    };

    this.getName = function () {
      return this.name;
    };

    this.getUniqueName = function() {
      if (this.name) {
        return this.name;
      } else {
        return _.uniqueId('AnonymousClass');
      }
    };

    this.getId = function () {
      if (!this.id) {
        this.id = _.uniqueId(this.name+('Class' || 'AnonymousClass'));
      }

      return this.id;
    };


    this.initReflection(spec);
  };
});