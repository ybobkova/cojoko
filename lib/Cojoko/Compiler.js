/*jshint evil:true */
define(['require', 'Cojoko/debug', 'esprima', 'lodash', 'escodegen', 'text!Cojoko/Compilers/Coffee/preambel.js', 'ast-types'], function(require, debug, esprima, _, escodegen, coffeePreambel) {

  return function() {
    var that = this;

    var n = require("ast-types").namedTypes;
    var b = require("ast-types").builders;
    var neededClasses, doCompileArgs; // CojokoClasses that need to be passed to the doCompile callback
    var classNameIdentifier;
    var parentClassIdentifier, parent;

    /**
     * Returns an hash:
     * 
     * .js the plain code for the compile function as string
     * .neededClasses an array of Cojoko.Class objects which are needed (in this order) as parameter of the compile function
     */
    this.compile = function(CojokoClass) {
      neededClasses = [];
      doCompileArgs = [];
      classNameIdentifier = b.identifier(CojokoClass.getUniqueName());
      parentClassIdentifier = undefined;
      parent = CojokoClass.reflection.getExtends();

      if (parent) {
        neededClasses.push(parent);
        parentClassIdentifier = b.identifier(parent.getUniqueName());
        doCompileArgs.push(parentClassIdentifier);
      }

      var ast = b.program(
        [
          b.expressionStatement(
            b.functionExpression(
              null, 
              doCompileArgs, // identifiers for all neededClasses
              b.blockStatement(this.compileProgram(CojokoClass))
            )
          )
        ]
      );

      var js = escodegen.generate(ast, {
        indent: '  '
      });

      return {
        js: js,
        neededClasses: neededClasses
      };
    };

    this.compileProgram = function(CojokoClass) {
      var statements = this.compilePreambel();

      statements.push(
        b.returnStatement(
          this.compileClassClosure(CojokoClass)
        )
      );

      return statements;
    };

    this.compileClassClosure = function(CojokoClass) {
      var classBody = [];

      if (parentClassIdentifier) {
        classBody.push(
          b.expressionStatement(
            b.callExpression(
              b.identifier('__extends'),
              [classNameIdentifier, b.identifier('_super')]
            )
          )
        );
      }

      classBody.push(
        this.compileConstructor(CojokoClass)
      );

      classBody = classBody.concat(this.compileMethods(CojokoClass));

      classBody.push(b.returnStatement(classNameIdentifier));

      if (parentClassIdentifier) {
        // (function (_super) { ... })( {{parentClass}} )
        return b.callExpression(
          b.functionExpression(null, [b.identifier('_super')], b.blockStatement(classBody)),
          [parentClassIdentifier]
        );
      } else {
        return this.buildClosure(classBody);
      }
    };

    this.compileConstructor = function(CojokoClass) {
      var that = this;
      var properties = CojokoClass.reflection.getProperties();
      var propsId = b.identifier('props');

      var constructorStatements = [];

      if (false) {
        constructorStatements.push(
          b.expressionStatement(
            b.callExpression(
              this.buildMemberChain(['console', 'log']),
              [b.literal('Constructor properties for: '+CojokoClass.getName()), b.identifier('props')]
            )
          )
        );
      }

      // init props to object
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

      if (parent) {
        constructorStatements.push(
          b.expressionStatement(
            b.callExpression(
              this.buildMemberChain([classNameIdentifier, '__super__', 'constructor', 'apply']),
              [b.thisExpression(), b.identifier('arguments')]
              )
            )
         );
      }

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
      } else if (_.isNumber(value) || _.isBoolean(value)) {
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
              this.compileMethod(method, name, CojokoClass)
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

    this.compileMethod = function(method, name, CojokoClass) {
      var program;
      var methodCode = method.toString();

      // besser mit traverse über den ast des geparsten laufen?
      // aber ich verstehe estraverse nicht
      methodCode = methodCode.replace(/this\.SUPER\(/ig, classNameIdentifier.name+'.__super__.'+name+'.call(this, ');
        
      try {
        // workaround esprima bug: function() {} is not valid javascript
        var js = 'var fn = ' + methodCode;
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

    this.buildMemberChain = function (identifiers) {
      var object;

      for (var i = 0, identifier; i < identifiers.length; i++) {
        identifier = identifiers[i];
        
        if (_.isString(identifier)) {
          identifiers[i] = identifier = b.identifier(identifier);
        }

        if (i > 0) {
          if (!object) {
            object = b.memberExpression(identifiers[0], identifier, false);
          } else {
            object = b.memberExpression(object, identifier, false);
          }
        }
      }

      return object;
    };
  };
});