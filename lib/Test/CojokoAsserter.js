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

        this.hasDependency = function (dependency) {
          var amd = that.cojoko.getModuleDefinition();

          if (_.isString(dependency)) {
            test.assertTrue(amd.hasDependency(dependency), 'class has dependency with alias: '+dependency+' defined');
          } else {

            var actualDependency = this.findDependency(amd, dependency);

            test.assertNotUndefined(actualDependency, 'class has dependency searched with :'+JSON.stringify(dependency));

            if (actualDependency) {
              var dependencyLabel = actualDependency.hasAlias() ? actualDependency.getAlias() : actualDependency.getPath();

              if (dependency.alias) {
                test.assertEquals(dependency.alias, actualDependency.getAlias(), 'alias from dependency '+dependencyLabel+' matches');
              }

              if (dependency.path) {
                test.assertEquals(dependency.path, actualDependency.getPath(), 'path from dependency '+dependencyLabel+' matches');
              }

              if (dependency.type) {
                var type;

                if (dependency.type === 'implicit') {
                  type = 'class.cojoko.implicit';
                } else if (dependency.type === 'explicit') {
                  type = 'class.cojoko.explicit';
                } else {
                  type = dependency.type;
                }

                test.assertEquals(type, actualDependency.getType(), 'type from dependency '+dependencyLabel+' matches');
              }
            } else {
              test.fail('cannot continue without dependency');
            }
          }

          return this;
        };

        this.findDependency = function (amd, search) {
          if (!search) {
            throw new Error('search for dependency has to be defined. use object or string in has(Not)Dependency ');
          }

          if (search.path) {
            return _.find(amd.getDependencies(), function (dependency) {
              return dependency.getPath() === search.path;
            });

          } else if (search.alias) {
            return _.find(amd.getDependencies(), function (dependency) {
              return dependency.getAlias() === search.alias;
            });

          } else {
            throw new Error('search for dependency have to define alias or path');
          }

        };

        this.hasNotDependency = function (dependency) {
          var amd = that.cojoko.getModuleDefinition();

          if (_.isString(dependency)) {
            test.assertFalse(amd.hasDependency(dependency), 'class has not dependency with alias: '+dependency+' defined');
          } else {
            test.assertUndefined(
              this.findDependency(amd, dependency),
              'the dependency with '+JSON.stringify(dependency)+' is not dependency of '+className
            );
          }

          return this;
        };
      };

      return new AssertClass(CojokoClass);
    };
  };
});