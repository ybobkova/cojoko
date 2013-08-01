/*jshint evil:true*/
define(['joose', 'lodash', 'esprima', 'escodegen', 'Cojoko/Method'], function (Joose, _, esprima, escodegen, CojokoMethod) {

  return function (Cojoko) {
    var that = this;
    var s = esprima.Syntax;
    var fqn;

    /**
     * @param string jooseClassFQN
     * @param function readClassCode function(jooseClassFQN) has to return the classCode as string
     */
    this.read = function (jooseClassFQN, readClassCode) {
      if (!_.isFunction(readClassCode)) {
        throw new Error('Please provide a callback with one parameter (string jooseClassFQN) which returns the code for the file');
      }

      if (!_.isString(jooseClassFQN)) {
        throw new Error('Plase provide a fqn for a class');
      }

      fqn = jooseClassFQN;
      var jooseClass = this.parse(readClassCode(jooseClassFQN));

      var spec = {};
      that.specifyExtends(spec, jooseClass, readClassCode);
      that.specifyMixins(spec, jooseClass, readClassCode);
      that.specifyProperties(spec, jooseClass);
      that.specifyMethods(spec, jooseClass);

      var compiledClass;
      if (jooseClass.isRole) {
        compiledClass = Cojoko.RuntimeMixin(jooseClass.fqn, spec);
      } else {
        compiledClass =  Cojoko.RuntimeClass(jooseClass.fqn, spec);
      }

      return Cojoko.getClassFor(compiledClass);
    };

    this.parse = function (jooseClassCode) {
      var ast, jooseClass = {
        isRole: false,
        methods: {},
        properties: {}
      };

      try {
        ast = esprima.parse(jooseClassCode);
      } catch (Ex) {
        throw this.parseError('Esprima cannot parse: '+jooseClassCode+' Reason: '+Ex.toString());
      }

      var bodyExpression = this.assertType(s.ExpressionStatement, ast.body[0]);
      var callExpression = this.assertType(s.CallExpression, bodyExpression.expression, 'callExpression in body of program expected');

      jooseClass.define = this.parseDefine(callExpression);

      this.parseClassCall(jooseClass.define.statements, jooseClass);

      return jooseClass;
    };

    this.parseClassCall = function (statements, jooseClass) {
      try {
        this.assertEquals(1, statements.length, 'one statement expected');

        var callExpression = this.assertType(
          s.CallExpression, 
          this.assertType(
            s.ExpressionStatement, statements[0], 'in statements for class'
          ).expression,
          'in expressionStatement of class'
        );

        var jooseClassExpression = this.assertType(s.MemberExpression, callExpression.callee);
        this.assertEquals('Joose', this.assertIdentifier(jooseClassExpression.object));

        var classType = this.assertIdentifier(jooseClassExpression.property);

        if (classType === 'Role') {
          jooseClass.isRole = true;
        } else if (classType !== 'Class') {
          throw this.parseError('onle Joose.Class or Joose.Role call expressions are expected', callExpression);
        }

        this.parseClassDefinition(callExpression['arguments'], jooseClass);


      } catch (Ex) {
        if (Ex.isAssertion) {
          Ex = this.parseError('statements from class should be only one ExpressionStatement with CallExpression: Joose.Class. Parse Error: '+Ex.toString(), statements);
        }

        throw Ex;
      }
    };

    this.parseClassDefinition = function (classArguments, jooseClass) {
      if (classArguments[0].type === s.Literal) {
        jooseClass.fqn = this.assertLiteral(classArguments[0]);

        return this.parseClassSpecification(classArguments[1], jooseClass);
      } else {
        jooseClass.fqn = null;

        return this.parseClassSpecification(classArguments[0], jooseClass);
      }
    };

    this.parseClassSpecification = function (specExpression, jooseClass) {
      var specification = this.assertObjectExpression(specExpression, 'specification for class (parameter of Joose.Class)');

      _.each(specification, function (valueExpression, key) {
        if (key === 'has') {
          that.parseProperties(valueExpression, jooseClass);
        } else if (key === 'methods') {
          that.parseMethods(valueExpression, jooseClass);
        } else if (key === 'does') {
          that.parseRoles(valueExpression, jooseClass);
        } else if (key === 'isa') {
          that.parseIsa(valueExpression, jooseClass);
        } else if (key === 'after' || key === 'before') {
          that.parseInitMethod(valueExpression, jooseClass);
        } else {
          throw that.parseError('Unexpected key "'+key+'" in specification for class.');
        }
      });
    }

    this.parseDefine = function (callExpression) {
      if (callExpression.callee.name !== 'define') {
        throw this.parseError('Joose class should be wrapped with define()-callExpression', callExpression);
      }

      // define( [paths], function (params) { ... })
      var pathsExpression = this.assertType(s.ArrayExpression, callExpression['arguments'][0]);
      var defineFunction = this.assertType(s.FunctionExpression, callExpression['arguments'][1]);

      return {
        paths: _.map(pathsExpression.elements, function (pathLiteral) {
          return that.assertLiteral(pathLiteral);
        }),
        params: _.map(defineFunction.params, function (identifier) {
          return that.assertIdentifier(identifier);
        }),
        statements: that.assertType(s.BlockStatement, defineFunction.body).body
      };
    }

    this.parseIsa = function (memberExpression, jooseClass) {
      jooseClass['isa'] = this.constructFQN(memberExpression, 'isa specification of class');
    };

    this.constructFQN = function (memberExpression, msg) {
      var parts = this.assertMemberExpression(memberExpression, msg);

      return {
        parts: parts,
        fqn: parts.join('.')
      };
    };

    this.parseProperties = function (hasObjectExpression, jooseClass) {
      _.each(this.assertObjectExpression(hasObjectExpression, 'value from .has in specification of class'), function (propertySpecExpression, propertyName) {
        var propertySpec = that.assertObjectExpression(propertySpecExpression);
        var fullName = jooseClass.fqn+'::'+propertyName;

        jooseClass.properties[propertyName] = {
          is: that.parseAttributeIs(propertySpec, fullName),
          required: that.parseAttributeRequired(propertySpec, fullName),
          init: that.parseAttributeInit(propertySpec, fullName)
        }
      });
    }

    this.parseAttributeIs = function (propertySpec, name) {
      if (!propertySpec.is) {
        return '';
      }

      var isValue = this.assertLiteral(propertySpec.is, 'is value of '+name);

      return isValue.replace('r', 'g').replace('w', 's');
    };

    this.parseAttributeRequired = function (propertySpec, name) {
      if (!propertySpec.required) {
        return undefined; // parse, dont interpret
      }

      return this.assertLiteral(propertySpec.required, 'required value of '+name);
    };

    this.parseAttributeInit = function (propertySpec, name) {
      if (!propertySpec.init) {
        return undefined;
      }

      var init = propertySpec.init;

      if (init.type == s.Literal) {
        return this.assertLiteral(init);
      }

      if (init.type == s.MemberExpression) {
        var parts = this.assertMemberExpression(init);

        if (parts[0] === 'Joose' && parts[1] === 'I') {
          if (parts[2] === 'Array') {
            return [];
          }

          if (parts[2] === 'Object') {
            return {};
          }
        }
      }

      throw this.parseError('Cannot read value from init function in '+name+'. The type: '+init.type+' is not expected', propertySpec);
    }

    this.checkJooseInitializer = function (initExpression) {
      /*
      } else if(_.isFunction(jooseInit)) { 
        // jooseInit is Joose.I.Array but maybe constructed on other joose instance
        var testValue = jooseInit();

        if (_.isArray(testValue) && testValue.length === 0) {
          return [];
        } else if(_.isObject(testValue) && _.isEmpty(testValue)) {
          return {};
        } else {
          
        }
      */
    };


    this.parseInitMethod = function (afterObjectExpression, jooseClass) {
      var afterObject = this.assertObjectExpression(afterObjectExpression, 'after object in class definition');
      var size = _.size(afterObject);

      if (size === 1 && afterObject.initialize) {
        var method = this.parseMethod(afterObject.initialize, 'initialize', jooseClass);
        jooseClass.methods[method.getName()] = method;

      } else {
        throw 'Can only read one modifier (after or before) for initialize from Joose Class. You have to change the definition from: '+jooseClass.fqn+'. I found '+size+' modifiers';
      }
    };

    this.parseMethods = function (methodsObjectExpression, jooseClass) {
      var methodsObject = this.assertObjectExpression(methodsObjectExpression);

      _.each(methodsObject, function (methodExpression, name) {
        var method = that.parseMethod(methodExpression, name, jooseClass);

        jooseClass.methods[method.getName()] = method;
      });
    };

    /**
     * @return CojokoMethod
     */
    this.parseMethod = function (functionExpression, name, jooseClass) {
      this.assertType(s.FunctionExpression, functionExpression, 'method '+name+' in '+jooseClass.fqn);

      var js = escodegen.generate(functionExpression, {
        indent: '  '
      });

      return new CojokoMethod(name, js);
    };


    this.specifyMixins = function(spec, jooseClass, readClassCode) {

    };

    this.specifyExtends = function (spec, jooseClass, readClassCode) {
      if (jooseClass.isa) {
        spec['extends'] = this.read(jooseClass['isa'].fqn, readClassCode);
      }
    };

    this.specifyProperties = function (spec, jooseClass) {
      if (_.size(jooseClass.properties) > 0) {
        spec.properties = jooseClass.properties;
      }
    };

    this.specifyMethods = function (spec, jooseClass) {
      if (_.size(jooseClass.methods) > 0) {
        spec.methods = jooseClass.methods;

        if (jooseClass.methods.initialize) {
          spec.methods.init = _.clone(spec.methods.initialize);
          spec.methods.init.name = 'init';
          delete spec.methods.initialize;
        }
      }

      /*
      _.forOwn(methods, function (method, name, methods) {
        var methodCode = method.toString();

        methodCode = methodCode.replace(/(this|that)\.\$\$/g, '$1.');

        var js = 'method = '+methodCode+';';

        eval(js);

        methods[name] = method;
      });

      return methods;
    };
    */

    };




    this.assertType = function (expectedType, node, msg) {
      if (!node.type || node.type !== expectedType) {
        throw this.parseError('node does not match type: '+expectedType+'. Actual type is: '+(node && node.type)+". "+msg, node);
      }

      return node;
    };

    this.assertObjectExpression = function (objectExpression, msg) {
      this.assertType(s.ObjectExpression, objectExpression);

      var properties = {};

      _.each(objectExpression.properties, function (propertyExpression) {
        var property = that.assertProperty(propertyExpression, msg);

        properties[property.key] = property.value;
      });

      return properties;
    };

    /**
     * @return .key string .value expression
     */
    this.assertProperty = function (node, msg) {
      this.assertType(s.Property, node, msg);

      this.assertEquals('init', node.kind, 'unexpected kind of property');

      return {
        key: this.assertIdentifier(node.key),
        value: node.value
      };
    };

    this.assertMemberExpression = function (memberExpression) {
      var names = [];

      this.assertType(s.MemberExpression, memberExpression);

      if (memberExpression.object.type == s.MemberExpression) {
        names = names.concat(this.assertMemberExpression(memberExpression.object));
      } else {
        names.push(this.assertIdentifier(memberExpression.object));
      }

      names.push(this.assertIdentifier(memberExpression.property));

      return names;
    };

    /**
     * @return the value of the literal
     */
    this.assertLiteral = function (literal) {
      return that.assertType(s.Literal, literal).value;
    };

    /**
     * @return the name of the identifier
     */
    this.assertIdentifier = function (identifier) {
      return that.assertType(s.Identifier, identifier).name;
    };

    this.assertEquals = function (expectedValue, actualValue, msg) {
      if (expectedValue != actualValue) {
        throw {
          isAssertion: true,
          msg: "assertEquals failed for: "+expectedValue+" "+actualValue+". "+msg,
          toString: function () {
            return 'Assertion: '+this.msg;
          }
        }
      }

      return actualValue;
    }

    this.parseError = function (msg, node) {
      var ex = new Error(msg)
      ex.isParseError = true;
      ex.node = node;
      ex.fqn = fqn;

      return ex;
    };
  };
});