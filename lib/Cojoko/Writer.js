define(['lodash'], function (_) {

  return function () {
    var that = this;
    var eol = "\n";
    var indent = "  ";

    /**
     * Returns the class as a plain string of Cojoko Code
     */
    this.write = function (CojokoClass) {
      var code = '';

      code += that.writeDefine(CojokoClass);
      code += that.writeClass(CojokoClass);
      code += that.writeFooter();

      return code;
    };

    this.writeClass = function (CojokoClass) {
      var code = '';

      if (CojokoClass.name) {
        code += indent+"Cojoko.Class('', {"+eol;
      } else {
        code += indent+"Cojoko.Class({"+eol;
      }

      //code += this.writeExtends();
      code += this.writeProperties(CojokoClass);
      code += this.writeMethods(CojokoClass);

      code += indent+'});'+eol;
    };

    this.writeProperties = function (CojokoClass) {
      
    };

    this.writeMethods = function (CojokoClass) {
      var methods = CojokoClass.reflection.getMethods();
      var code = '';

      for (var i = 0; i < methods.length; i++) {
        code += this.writeMethod(methods[i]);
        code += eol;
      }

      return code;
    };

    this.writeMethod = function (method) {
      return method.toString()+eol;
    };

    this.writeDefine = function (CojokoClass) {
      return "define(['Cojoko'], function (Cojoko) {"+eol;
    };

    this.writeFooter = function() {
      return '});';
    };

  };

});