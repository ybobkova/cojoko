define(['lodash', 'JSON'], function (_, JSON) {

  return function (test) {

    this.assertCojoko = function (CojokoClass) {

      var AssertClass = function (CojokoClass) {
        var that = this;
        this.cojoko = CojokoClass;

        var properties = this.cojoko.reflection.getProperties();
        var methods = this.cojoko.reflection.getMethods();
        var className = CojokoClass.getName();

        this.name = function (name) {
          test.assertEquals(name, className, 'tested class has the correct name');
          return this;
        };

        this.isSubclassOf = function(name) {
          test.assertTrue(that.cojoko.reflection.isSubclassOf(name), className+' is subclass of '+name);
          return this;
        };

        this.propertiesCount = function (num) {
          test.assertLength(num, _.toArray(properties), 'properties match expected count. Parsed: ['+_.keys(properties).join(', ')+']');
          return this;
        };

        this.methodsCount = function (num) {
          test.assertLength(num, _.toArray(methods), 'methods match expected count. Parsed: ['+_.keys(methods).join(', ')+']');
          return this;
        };

        this.property = function (name) {
          test.assertAttributeNotUndefined(name, properties, 'property '+name+' is defined in '+className);
          var property = properties[name];

          if (!property) {
            throw 'Test cannot continue. Missing property: '+name;
          }

          return {
            is: function (expectedIs) {
              test.assertEquals(expectedIs, property.is, 'is from property '+name+' in '+className+' matches');
              return this;
            },

            isRequired: function () {
              test.assertTrue(property.required, 'property '+name+' is required in '+className);
              return this;
            },

            isOptional: function () {
              test.assertFalse(property.required, 'property '+name+' is optional in '+className);
              return this;
            },

            hasInit: function (initValue) {
              test.assertEquals(initValue, property.init, 'init value from property '+name+' in '+className);
              return this;
            },

            end: function () {
              return that;
            }
          };
        };

        this.method = function (name) {
          test.assertAttributeNotUndefined(name, methods, 'method '+name+' is defined in '+className);
          var method = methods[name];

          if (!method) {
            throw 'Test cannot continue. Missing method: '+name;
          }

          return {
            end: function () {
              return that;
            }
          };
        };

        this.hasMixin = function (name) {
          test.assertTrue(that.cojoko.reflection.hasMixin(name), className+' has mixin '+name);
          return this;
        };

        this.hasNotMixin = function (name) {
          test.assertFalse(that.cojoko.reflection.hasMixin(name), className+' has not mixin '+name);
          return this;
        };

        this.isMixin = function() {
          test.assertTrue(that.cojoko.reflection.isMixin(), className+' is a mixin');
          return this;
        };

        this.hasVendorDependency = function (dependency) {
          var vendorDependencies = that.cojoko.getVendorDependencies();

          if (_.isString(dependency)) {
            dependency = { alias: dependency };
          }

          var actualDependency = this.findDependency(vendorDependencies, dependency);

          test.assertNotUndefined(actualDependency, 'class has vendorDependency searched with :'+JSON.stringify(dependency));

          if (actualDependency) {
            var dependencyLabel = actualDependency.alias ? actualDependency.alias : actualDependency.path;

            if (dependency.alias) {
              test.assertEquals(dependency.alias, actualDependency.alias, 'alias from dependency '+dependencyLabel+' matches');
            }

            if (dependency.path) {
              test.assertEquals(dependency.path, actualDependency.path, 'path from dependency '+dependencyLabel+' matches');
            }

          } else {
            test.fail('cannot continue without dependency');
          }

          return this;
        };

        this.findDependency = function (dependencies, search) {
          if (!search) {
            throw new Error('search for dependency has to be defined. use object or string in has(Not)Dependency ');
          }

          if (search.path) {
            return _.find(dependencies, function (dependency) {
              return dependency.path === search.path;
            });

          } else if (search.alias) {
            return _.find(dependencies, function (dependency) {
              return dependency.alias === search.alias;
            });

          } else {
            throw new Error('search for dependency have to define alias or path');
          }

        };

        this.hasNotVendorDependency = function (dependency) {

          if (_.isString(dependency)) {
            dependency = { alias: dependency };
          } 

          test.assertUndefined(
            this.findDependency(that.cojoko.getVendorDependencies(), dependency),
            'the dependency with '+JSON.stringify(dependency)+' is not vendor dependency of '+className
          );

          return this;
        };

        this.hasImplicitClass = function (fqn) {
          var classes = this.cojoko.getImplicitClasses();

          test.assertNotUndefined(
            _.find(classes, function (cojokoClass) {
              return cojokoClass.getName() === fqn;
            }),
            'class '+fqn+' is found in implicit classes: '+_.map(classes, function (cojokoClass) { return cojokoClass.getName(); }).join(', ')
          );

          return this;
        };

        this.hasExplicitClass = function (fqn) {
          var classes = this.cojoko.getExplicitClasses();

          test.assertNotUndefined(
            _.find(classes, function (cojokoClass) {
              return cojokoClass.getName() === fqn;
            }),
            'class '+fqn+' is found in implicit classes: '+_.map(classes, function (cojokoClass) { return cojokoClass.getName(); }).join(', ')
          );

          return this;
        };
      };

      return new AssertClass(CojokoClass);
    };
  };
});