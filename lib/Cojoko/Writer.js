define(['lodash'], function (_) {

  return function () {
    var that = this;
    var eol = "\n";
    var indent = "  ";
    var DOUBLE_QUOTE = '"';
    var SINGLE_QUOTE = "'";

    /**
     * Returns the class as a plain string of Cojoko Code
     *
     * options
     *  .defines an object hash argumentName: requireJsPath
     *  .definePrefix per default every used mixin or extending class is used as requireJsPath like Name/Space/to/Class/ClassShortname 
     *    if definePrefix is set it will be {{definePrefix}}Name/Space/to/Class/ClassShortname
     *    be sure to provide a trailing slash
     *  . moduleName uses the name for the define() call as a defined module
     */
    this.write = function (cojokoClass, options) {
      var code = '';
      options = _.merge({
        moduleName: null,
        defines: {},
        definePrefix: ''
      }, options);

      var defines = _.clone(options.defines);

      code += that.writeClass(cojokoClass, defines, options);
      code += that.writeFooter();

      code = that.writeDefine(cojokoClass, defines, options)+code;

      return code;
    };

    this.writeClass = function (cojokoClass, defines, options) {
      var code = indent+'return ';

      if (cojokoClass.getName()) {
        code += "Cojoko.Class("+that.exportString(cojokoClass.getName())+", {"+eol;
      } else {
        code += "Cojoko.Class({"+eol;
      }

      code += that.writeMixins(cojokoClass, defines, options);
      code += that.writeExtends(cojokoClass, defines, options);
      code += eol;
      code += that.writeProperties(cojokoClass)+','+eol;
      code += eol;
      code += that.writeMethods(cojokoClass);
      code += eol;

      code += indent+'});'+eol;

      return code;
    };

    this.writeExtends = function (cojokoClass, defines, options) {
      var parentClass = cojokoClass.reflection.getExtends();
      var code = '';

      if (parentClass) {
        defines[parentClass.getShortName()] = options.definePrefix+parentClass.getName().replace(/\./g, '/');
        code += "'extends': "+parentClass.getShortName()+','+eol;
        code += eol;
      }

      return code;
    };

    this.writeMixins = function (cojokoClass, defines, options) {
      var code = '';
      var mixins = _.toArray(cojokoClass.reflection.getMixins());
      if (mixins.length) {
        code += indent+indent+'mixins: [';

        code += _.map(mixins, function (mixin) {
          defines[mixin.getShortName()] = options.definePrefix+mixin.getName().replace(/\./g, '/');
          return mixin.getShortName();
        }).join(", ");

        code += '],'+eol;
      }


      return code;
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
      } else if (_.isNumber(value)) {
        return value.toString();
      } else if (_.isArray(value) && _.isEmpty(value)) {
        return '[]';
      } else {
        throw 'The init value in property '+cojokoClass.getName()+' from class cannot be written- it is too complex. Remove the init value from property and set it in the init() function.';
      }
    };

    this.writeDefine = function (cojokoClass, defines, options) {
      var paths = _(defines).map(function (key) { return "'"+key+"'"; } );
      var params = _(defines).keys();

      paths.unshift("'Cojoko'");
      params.unshift('Cojoko');

      var def = "define(";

      if (options.moduleName) {
        def += "'"+options.moduleName+"', ";
      }

      def += "["+paths.join(", ")+"], function ("+params.join(", ")+") {"+eol;

      return def;
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