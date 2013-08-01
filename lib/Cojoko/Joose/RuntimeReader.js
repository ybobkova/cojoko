/*jshint evil:true*/
define(['joose', 'lodash'], function (Joose, _) {

  return function (Cojoko) {
    var that = this;

    this.read = function (JooseClass) {
      var meta = JooseClass.meta, superClass = meta.superClass;

      var spec = {};

      if (superClass && superClass.meta.name && superClass.meta.name.substr(0,6) !== 'Joose.') {
        spec['extends'] = this.read(superClass);
      }

      spec.mixins =  that.readMixins(meta);
      spec.properties = that.readProperties(meta, JooseClass);
      spec.methods =  that.readMethods(meta);

      var compiledClass;
      if (meta.meta.name === 'Joose.Meta.Role') {
        compiledClass = Cojoko.RuntimeMixin(meta.name, spec);
      } else {
        compiledClass =  Cojoko.RuntimeClass(meta.name, spec);
      }

      return Cojoko.getClassFor(compiledClass);
    };

    this.readProperties = function (meta, jooseClass) {
      var properties = {};

      meta.getAttributes().eachOwn(function (jooseAttribute, name) {
        properties[name] = {
          'is': that.readAttributeIs(jooseAttribute, meta.name+'::'+name),
          required: jooseAttribute.required,
          init: that.readAttributeInit(jooseAttribute, meta.name+'::'+name)
        };
      });

      return properties;
    };

    this.readAttributeIs = function (jooseAttribute, name) {
      if (!jooseAttribute.is) {
        return '';
        //throw 'property '+name+' does not have a is attribute';
      }

      return jooseAttribute.is.replace('r', 'g').replace('w', 's');
    };

    this.readAttributeInit = function (jooseAttribute, attrName) {
      var jooseInit = jooseAttribute.init;

      if (jooseInit === Joose.I.Array) {
        return [];
      } else if(jooseInit === Joose.I.Object) {
        return {};
      } else if(_.isFunction(jooseInit)) { 
        // jooseInit is Joose.I.Array but maybe constructed on other joose instance
        var testValue = jooseInit();

        if (_.isArray(testValue) && testValue.length === 0) {
          return [];
        } else if(_.isObject(testValue) && _.isEmpty(testValue)) {
          return {};
        } else {
          throw new Error('Cannot read value from init function in '+attrName);
        }

      } else {
        return jooseInit;
      }
    };

    this.readMethods = function (meta) {
      var methods = {};

      if (meta.hasMethodModifiersFor('initialize')) {
        var init = meta.getMethod('initialize');

        var modifiers = _.filter(meta.stem.properties.methodsModifiers.getProperty('initialize'), function (modifier) {
          return modifier.definedIn.definedIn.name === meta.name;
        });

        if (modifiers.length > 1) {
          //console.log(modifiers);
          throw 'Can only read one modifier (after or before) for initialize from Joose Class. You have to change the definition from: '+meta.name+'. I found '+modifiers.length+' modifiers';
        } else if (modifiers.length === 1) {
          methods['init'] = modifiers[0].init;
        } else {
          //console.log('initialize without modifier: '+meta.name);
        }
      }

      meta.getMethods().eachOwn(function (jooseMethod, name) {
        var isReal = !jooseMethod.init.ACCESSOR_FROM;
        var isFromSelf = jooseMethod.definedIn.definedIn.name === meta.name;

        if (isReal && isFromSelf) {
          methods[name] = jooseMethod.init;
        }
      });

      // transpile
      _.forOwn(methods, function (method, name, methods) {
        var methodCode = method.toString();

        methodCode = methodCode.replace(/(this|that)\.\$\$/g, '$1.');

        var js = 'method = '+methodCode+';';

        eval(js);

        methods[name] = method;
      });

      return methods;
    };

    that.readMixins = function (meta) {
      var mixins = [];

      if (meta.getRoles) {
        var roles = meta.getRoles(), name;

        for (var i = 0; i < roles.length; i++) {
          name = roles[i].meta.name;

          if (name.substr(0, 6) !== 'Joose.') {
            mixins.push(this.read(roles[i]));
          }
        }
      }

      return mixins;
    };
  };

});