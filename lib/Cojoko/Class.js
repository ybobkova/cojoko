define(['./ClassReflection', './Method', 'lodash', 'AMD/Definition'], function (ClassReflection, Method, _, AMDefinition) {

  return function (name, spec, classRegistry) {
    var that = this;

    if (typeof(name) === 'object' && spec === undefined) {
      spec = name;
      name = undefined;
    }

    this.name = name;
    this.id = undefined;

    /**
     * Classes that are used in Methods for example
     * 
     * these are dependencies to other cojokoClasses
     */
    this.explicitClasses = {};

    /**
     * alias: path
     */
    this.dependencies = [];

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
            try {
              that.reflection.addMixin(classRegistry.getClassFor(name));
            } catch (Ex) {
              var error = new Error('Parameter to mixin must be a valid Compiled CojokoClass Constructor OR a valid CojokoClass. Error in specification of class: '+name+' Reason: '+Ex.toString());
              error.previousError = Ex;

              throw error;
            }
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
      if (!this.uniqueName) {
        if (this.name) {
          this.uniqueName = _.uniqueId(this.getShortName());
        } else {
          this.uniqueName = _.uniqueId('AnonymousClass');
        }
      }

      return this.uniqueName;
    };

    this.getShortName = function () {
      var split = this.name.split(/\./);
      return split.pop();
    };

    this.getId = function () {
      if (!this.id) {
        this.id = _.uniqueId(this.name+('Class' || 'AnonymousClass'));
      }

      return this.id;
    };

    this.getImplicitClasses = function () {
      var classes = _.toArray(this.reflection.getMixins());

      if (this.reflection.getExtends()) {
        classes.push(this.reflection.getExtends());
      }

      return classes;
    };

    this.addExplicitClass = function (cojokoClass) {
      this.explicitClasses[cojokoClass.getName()] = cojokoClass;
      return this;
    };

    this.getExplicitClasses = function () {
      return _.toArray(this.explicitClasses);
    };

    this.addDependency = function (path, alias) {
      this.dependencies.push({
        alias: alias,
        path: path
      });

      return this;
    };

    this.getVendorDependencies = function() {
      return this.dependencies;
    };
   
    this.initReflection(spec);
  };
});