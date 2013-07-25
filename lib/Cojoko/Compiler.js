/*jshint evil:true */
define(['require', 'Cojoko/debug', 'esprima', 'lodash', 'escodegen', 'text!Cojoko/Compilers/Coffee/preambel.js', 'ast-types'], function(require, debug, esprima, _, escodegen, coffeePreambel) {

  return function() {
    var that = this;

    var n = require("ast-types").namedTypes;
    var b = require("ast-types").builders;
    var classNameIdentifier;

    this.compile = function(CojokoClass) {
      var name = CojokoClass.getName();
      if (!name) {
        name = _.uniqueId('AnonymousClass');
        //throw new Error('Can only compile Cojoko Classes with a name, yet');
      }

      classNameIdentifier = b.identifier(name);

      var ast = b.program(this.compileProgram(CojokoClass));

      return escodegen.generate(ast, {
        indent: '  '
      });
    };

    this.compileProgram = function(CojokoClass) {
      var statements = [];

      statements = statements.concat(this.compilePreambel());

      statements.push(
        b.returnStatement(
          this.compileClosure(CojokoClass)
        )
      );

      return [b.expressionStatement(this.buildClosure(statements))];
    };

    this.compileClosure = function(CojokoClass) {
      var classBody = [
        this.compileConstructor(CojokoClass)
      ];

      classBody = classBody.concat(this.compileMethods(CojokoClass));

      classBody.push(b.returnStatement(classNameIdentifier));

      return this.buildClosure(classBody);
    };

    this.compileConstructor = function(CojokoClass) {
      var that = this;
      var properties = CojokoClass.reflection.getProperties();
      var propsId = b.identifier('props');

      var constructorStatements = [];


      constructorStatements.push(
        b.expressionStatement(
          b.assignmentExpression(
            "=",
            propsId,
            b.logicalExpression(
              "||",
              propsId,
              b.objectExpression([])
            )
          )
        )
      );

      constructorStatements = constructorStatements.concat(
        _.map(
          properties,
          function(property) {
            return that.compileInitProperty(property, propsId);
          }
        )
      );

      if (CojokoClass.reflection.hasMethod('init')) {
        constructorStatements.push(
          b.expressionStatement(
            b.callExpression(
              b.memberExpression(b.thisExpression(), b.identifier('init'), false),
              [propsId]
            )
          )
        );
      }

      return b.functionDeclaration(
        classNameIdentifier,
        [propsId],
        b.blockStatement(
          constructorStatements
        )
      );
    };

    this.compileInitProperty = function(property, propsId) {
      return b.expressionStatement(
        b.assignmentExpression(
          '=',
          b.memberExpression(b.thisExpression(), b.identifier(property.name), false), // this.{{property.name}}
          this.compileInitPropertyExpression(property, propsId)
        )
      );
    };

    this.compileInitPropertyExpression = function(property, propsId) {
      var propsMemberExpression = b.memberExpression(propsId, b.identifier(property.name), false); // props.{[property.name]}

      if (property.init !== undefined) {
        return b.conditionalExpression(
          // conditional
          b.binaryExpression(
            "!==",
            propsMemberExpression,
            b.identifier('undefined')
          ),
          // consequent
          propsMemberExpression,
          // alternate
          this.compileInitValueExpression(property.init, property)
        );
      } else {
        return propsMemberExpression;
      }
    };

    this.compileInitValueExpression = function(value, property) {
      // @see Writer.js
      if (_.isPlainObject(value) && _.isEmpty(value)) {
        return b.objectExpression([]);
      } else if (_.isString(value)) {
        return b.literal(value);
      } else if (_.isNumber(value)) {
        return b.literal(value);
      } else if (_.isArray(value) && _.isEmpty(value)) {
        return b.arrayExpression([null]);
      } else {
        throw 'The init value in property '+property.name+' cannot be compiled - it is too complex. Remove the init value from property and set it in the init() function in class';
      }
    };

    this.compileMethods = function(CojokoClass) {
      var methods = this.generateMethods(CojokoClass);
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


    this.generateMethods = function(CojokoClass) {
      var methods = CojokoClass.reflection.getMethods();
      var properties = CojokoClass.reflection.getProperties();

      var property;
      var getterName, setterName, func;
      for (var name in properties) {
        property = properties[name];

        if (property.is.match(/g/)) {
          getterName = property.getGetterName();

          if (!methods[getterName]) {
            eval("func = function () {\n      return this." + name + ";\n    };");

            methods[getterName] = func;
          }
        }

        if (property.is.match(/s/)) {
          setterName = property.getSetterName();

          if (!methods[setterName]) {
            eval("func = function (value) {\n      this." + name + " = value;\n      return this;\n    };");
            methods[setterName] = func;
          }
        }
      }


      return methods;
    };

    this.compileMethod = function(method, name) {
      var program;

      try {
        // workaround esprima bug: function() {} is not valid javascript
        var js = 'var fn = ' + method.toString();
        program = esprima.parse(js);
      } catch (ex) {
        debug('esprima cannot parse:', js);
        throw ex;
      }

      var declarator = program.body[0].declarations[0];

      return declarator.init;
    };

    this.compilePreambel = function() {
      var program = esprima.parse(coffeePreambel);

      return program.body;
    };

    /**
     * Build: (function() { functionBody })()
     *
     * @param array functionBody
     */
    this.buildClosure = function(functionBody) {
      return b.callExpression(
        b.functionExpression(null, [], b.blockStatement(functionBody)), []
      );
    };
  };
});