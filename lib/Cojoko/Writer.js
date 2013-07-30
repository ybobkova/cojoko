define(['lodash'], function (_) {

  return function () {
    var that = this;
    var eol = "\n";
    var indent = "  ";
    var DOUBLE_QUOTE = '"';
    var SINGLE_QUOTE = "'";

    /**
     * Returns the class as a plain string of Cojoko Code
     */
    this.write = function (cojokoClass) {
      var code = '';

      code += that.writeDefine(cojokoClass);
      code += that.writeClass(cojokoClass);
      code += that.writeFooter();

      return code;
    };

    this.writeClass = function (cojokoClass) {
      var code = '';

      if (cojokoClass.getName()) {
        code += indent+"Cojoko.Class("+that.exportString(cojokoClass.getName())+", {"+eol;
      } else {
        code += indent+"Cojoko.Class({"+eol;
      }

      //code += that.writeExtends();
      code += eol;
      code += that.writeProperties(cojokoClass)+','+eol;
      code += eol;
      code += that.writeMethods(cojokoClass);
      code += eol;

      code += indent+'});'+eol;

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
      return indent+indent+indent+that.escapeObjectKey(name)+': '+method.toString();
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

    this.writeDefine = function (cojokoClass) {
      return "define(['Cojoko'], function (Cojoko) {"+eol;
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