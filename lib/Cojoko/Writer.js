define(['lodash', 'Cojoko/debug', 'AMD/Definition', 'AMD/Dependency', 'AMD/Generator', 'escodegen', 'ast-types'], function (_, debug, Definition, Dependency, AMDGenerator, escodegen) {

  return function () {
    var that = this;
    var eol = "\n";
    var indent = "  ";
    var DOUBLE_QUOTE = '"';
    var SINGLE_QUOTE = "'";
    var b = require("ast-types").builders;
    var n = require("ast-types").namedTypes;

    /**
     * Returns the class as a plain string of Cojoko Code
     *
     * options
     *  .moduleName uses the name for the define() call as a defined module
     *  .definePrefix per default every used mixin or extending class is used as requireJsPath like Name/Space/to/Class/ClassShortname 
     *    if definePrefix is set it will be {{definePrefix}}Name/Space/to/Class/ClassShortname
     *    be sure to provide a trailing slash
     *  
     */
    this.write = function (cojokoClass, options) {
      var code = '';
      options = _.merge({
        moduleName: null,
        definePrefix: ''
      }, options);

      var globalAliases = {};
      var amd = this.initModuleDefinition(cojokoClass, options, globalAliases);

      code += that.writeGlobalAliases(globalAliases);

      code += that.writeClass(cojokoClass, amd, options);
      code += that.writeFooter();

      code = that.writeDefine(cojokoClass, amd, options)+code;

      return code;
    };

    this.initModuleDefinition = function (cojokoClass, options, globalAliases) {
      var amd = new Definition();

      amd.addDependency(new Dependency('Cojoko', 'Cojoko'));

      if (options.moduleName) {
        amd.setName(options.moduleName);
      }

      this.amdAliases = {};

      _.forEach(cojokoClass.getImplicitClasses(), function (implicitClass) {
        var alias = implicitClass.getShortName();
        var requirePath = options.definePrefix+implicitClass.getName().replace(/\./g, '/');

        that.amdAliases[implicitClass.getName()] = alias;

        amd.addDependency(new Dependency(requirePath, alias));
      });

      _.forEach(cojokoClass.getExplicitClasses(), function (explicitClass) {
        var requirePath = options.definePrefix+explicitClass.getName().replace(/\./g, '/');
        globalAliases[ explicitClass.getName() ] = requirePath;

        amd.addDependency(new Dependency(requirePath));
      });

      _.forEach(cojokoClass.getVendorDependencies(), function (dependency) {
        amd.addDependency(new Dependency(dependency.path, dependency.alias));
      });

      return amd;
    };

    /**
     * writes an construct like:

      var Psc = {
        UI: {
           DropBox: require('Psc/UI/DropBox')
        },
        Code: require('Psc/Code')
      };

       because requirejs cannot create namespaced classes
     */
    this.writeGlobalAliases = function (aliases) {
      // first: create an object from the splitted namespaces
      var struct = {}, ast = [];

      _.forEach(aliases, function (requirePath, fqn) {
        var namespaces = fqn.split(/\./);
        var path = struct; // begin in root

        for (var i = 0; i<namespaces.length; i++) {
          var part = namespaces[i];
          if (namespaces.length-1 === i) {
            path[part] = b.callExpression(b.identifier('require'), [b.literal(requirePath)]); // leaf

          } else {
            if (!path[part]) {
              path[part] = {};
            }

            path = path[part]; // traverse to next namespace
          }
        }
      });

        var generateObjectExpression = function (object) {
          var properties = _.map(object, function (property, propertyKey) {
            if (property.type === 'CallExpression') {
              return b.property('init', b.literal(propertyKey), property);
            } else {
              return b.property('init', b.literal(propertyKey), generateObjectExpression(property));
            }
          });

          return b.objectExpression(properties);
        };

      var declarators = [];
      _.forEach(struct, function (aliases, key) {
        declarators.push(
          b.variableDeclarator(
            b.identifier(key),
            generateObjectExpression(aliases)
          )
        );
      });


      var js = '';

      if (declarators.length) {
        js += indent+escodegen.generate( b.variableDeclaration('var', declarators) );
        js += "\n\n";
      }

      return js;
    };

    this.writeClass = function (cojokoClass, amd, options) {
      var code = indent+'return ';

      if (cojokoClass.getName()) {
        code += "Cojoko.Class("+that.exportString(cojokoClass.getName())+", {"+eol;
      } else {
        code += "Cojoko.Class({"+eol;
      }

      code += that.writeMixins(cojokoClass, amd, options);
      code += that.writeExtends(cojokoClass, amd, options);
      code += that.writeProperties(cojokoClass)+','+eol;
      code += eol;
      code += that.writeMethods(cojokoClass);
      code += eol;

      code += indent+'});'+eol;

      return code;
    };

    this.writeExtends = function (cojokoClass, amd, options) {
      var parentClass = cojokoClass.reflection.getExtends();
      var code = '';

      if (parentClass) {
        code += indent+indent+"'extends': "+this.getAMDAliasForClass(parentClass)+','+eol;
        code += eol;
      }

      return code;
    };

    this.writeMixins = function (cojokoClass, amd, options) {
      var code = '';
      var mixins = _.toArray(cojokoClass.reflection.getMixins());
      if (mixins.length) {
        code += indent+indent+'mixins: [';

        code += _.map(mixins, function (mixin) {
          return that.getAMDAliasForClass(mixin);
        }).join(", ");

        code += '],'+eol;
      }


      return code;
    };

    this.getAMDAliasForClass = function (cojokoClass) {
      return this.amdAliases[cojokoClass.getName()];
    };

    this.writeProperties = function (cojokoClass) {
      var properties = cojokoClass.reflection.getProperties();
      var code = indent+indent+'properties: {'+eol;

      code += _.map(properties, function (property, name) {
        return that.writeProperty(name, property, cojokoClass);
      }).join(','+eol);
      code += eol;

      code += indent+indent+'}';

      return code;
    };

    this.writeMethods = function (cojokoClass) {
      var methods = cojokoClass.reflection.getMethods();
      var code = indent+indent+'methods: {'+eol;

      code += _.map(methods, function (method, name) {
        return that.writeMethod(name, method);
      }).join(','+eol+eol);
      code += eol;

      code += indent+indent+'}';

      return code;
    };

    this.writeMethod = function (name, method) {
      return indent+indent+indent+that.escapeObjectKey(name)+': '+method.getBodyAsString();
    };

    this.writeProperty = function (name, property, cojokoClass) {
      var writeProps = {
        is: that.exportString(property.is, SINGLE_QUOTE),
        required: property.required ? 'true' : 'false'
      };

      /*
      if (!property.isPrivate) {
        writeProps.isPrivate = false;
      }
      */

      if (property.init !== undefined) {
        writeProps.init = that.writeInitValue(property.init, name, cojokoClass);
      }

      var properties = [];
      for (var key in writeProps) {
        properties.push(that.escapeObjectKey(key)+': '+writeProps[key]);
      }

      return indent+indent+indent+that.escapeObjectKey(name)+': { '+properties.join(', ')+' }';
    };

    this.writeInitValue = function (value, name, cojokoClass) {
      // @see Compiler.js
      if (_.isPlainObject(value) && _.isEmpty(value)) {
        return '{}';
      } else if (_.isString(value)) {
        return that.exportString(value, DOUBLE_QUOTE);
      } else if (value === null) {
        return 'null';
      } else if (_.isNumber(value) || _.isBoolean(value)) {
        return value.toString();
      } else if (_.isArray(value) && _.isEmpty(value)) {
        return '[]';
      } else {
        debug('init value is: ', value);
        throw 'The init value in property '+cojokoClass.getName()+' from class cannot be written- it is too complex. Remove the init value from property and set it in the init() function.';
      }
    };

    this.writeDefine = function (cojokoClass, amd, options) {
      var generator = new AMDGenerator();

      var js = escodegen.generate(
        generator.generateDefine(amd), {
          format: {
            compact: true
          }
       });

      js = js.replace(/,/g, ', ');

      return js.substring(0, js.length-3)+" {\n";
    };

    this.writeFooter = function() {
      return '});';
    };

    this.escapeObjectKey = function (key) {
      return key;
    };

    this.exportString = function (string, quote) {
      if (quote === DOUBLE_QUOTE) {
        return DOUBLE_QUOTE+string.replace(/"/, '\\\\"')+DOUBLE_QUOTE;
      } else {
        return SINGLE_QUOTE+string.replace(/'/,  "\\\\'")+SINGLE_QUOTE;
      }
    };
  };
});