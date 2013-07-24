define(['require', 'esprima', 'lodash', 'escodegen', 'text!Cojoko/Compilers/Coffee/preambel.js', 'ast-types'], function (require, esprima, _, escodegen, coffeePreambel) {

  return function() {
    var that = this;

    var n = require("ast-types").namedTypes;
    var b = require("ast-types").builders;

    this.compile = function (CojokoClass) {
      if (!CojokoClass.getName()) {
        throw new Error('Can only compile Cojoko Classes with a name, yet');
      }

      var ast = b.program(this.compileProgram(CojokoClass));

      return escodegen.generate(ast, {
        indent: '  '
      });
    };

    this.compileProgram = function (CojokoClass) {
      var statements = [];

      statements = statements.concat(this.compilePreambel());

      var classNameIdentifier = b.identifier(CojokoClass.getName());

      /* 

      //var {{ClassName}} = function () {... }();
      statements.push(
        b.variableDeclaration(
          "var",
          [
            b.variableDeclarator(
              classNameIdentifier,
              this.compileClosure(CojokoClass)
            )
          ]
        )
      );
     */

      statements.push(
        b.returnStatement(
          this.compileClosure(CojokoClass)
        )
      );

      return [b.expressionStatement(this.buildClosure(statements))];
    };

    this.compileClosure = function (CojokoClass) {
      var classNameIdentifier = b.identifier(CojokoClass.getName());

      var classBody = [
        this.compileConstructor(CojokoClass)
      ];

      classBody = classBody.concat(this.compileMethods(CojokoClass));

      classBody.push(b.returnStatement(classNameIdentifier));
      
      return this.buildClosure(classBody);
    };

    this.compileConstructor = function (CojokoClass) {
      var constructorArgs = [];
      var classNameIdentifier = b.identifier(CojokoClass.getName());
      var properties = CojokoClass.reflection.getProperties();

      for (var i = 0, property; i < properties.length; i++) {
        property = properties[i];
        if (property.required) {
          constructorArgs.push(property);
        }
      }

      return b.functionDeclaration(
        classNameIdentifier,
        _.pluck(constructorArgs, 'name'),
        b.blockStatement(_.map(constructorArgs, this.compileInitProperty))
      );
    };

    this.compileInitProperty = function (property) {
      return b.expressionStatement(
        b.assignmentExpression(
          '=',
          b.memberExpression(b.thisExpression(), b.identifier(property.name), false), // this.{{property.name}}
          b.identifier(property.name) // {[property.name]}
        )
      );
    };


    this.compileMethods = function (CojokoClass) {
      var classNameIdentifier = b.identifier(CojokoClass.getName());
      var methods = CojokoClass.reflection.getMethods();
      var methodExpressions = [];

      var method;
      for (var name in methods) {
        method = methods[name];

        methodExpressions.push(
          b.expressionStatement(
            b.assignmentExpression(
              '=',
              // left
              b.memberExpression(
                b.memberExpression(
                  classNameIdentifier,
                  b.identifier('prototype'),
                  false
                ),
                b.identifier(name),
                false
              ),
              // right
              this.compileMethod(method, name)
            )
          )
        );
      }

      return methodExpressions;
    };

    this.compileMethod = function (method, name) {
      // workaround esprima bug: function() {} is not valid javascript
      var program = esprima.parse('var fn = '+method.toString());

      var declarator = program.body[0].declarations[0];

      return declarator.init;
    };

    this.compilePreambel = function () {
      var program = esprima.parse(coffeePreambel);

      return program.body;
    };

    /**
     * Build: (function() { functionBody })()
     * 
     * @param array functionBody
     */
    this.buildClosure = function (functionBody) {
      return b.callExpression(
        b.functionExpression(null, [], b.blockStatement(functionBody)), 
        []
      );
    };
  };

});