define(['Cojoko/Class', 'joose'], function (CojokoClass, Joose) {

  return function () {
    var that = this;

    this.read = function (JooseClass) {

      var meta = JooseClass.meta;

      return new CojokoClass(JooseClass.meta.name, {
        properties: that.readProperties(meta),

        methods: that.readMethods(meta)
      });
    };

    this.readProperties = function (meta) {
      var properties = {};

      meta.getAttributes().eachOwn(function (jooseAttribute, name) {
        properties[name] = {
          'is': that.readAttributeIs(jooseAttribute),
          required: jooseAttribute.required,
          init: that.readAttributeInit(jooseAttribute)
        };
      });

      return properties;
    };

    this.readAttributeIs = function (jooseAttribute) {
      return jooseAttribute.is.replace('r', 'g').replace('w', 's');
    };

    this.readAttributeInit = function (jooseAttribute) {
      var jooseInit = jooseAttribute.init;

      if (jooseInit === Joose.I.Array) {
        return [];
      } else if(jooseInit === Joose.I.Object) {
        return {};
      } else {
        return jooseInit;
      }
    };

    this.readMethods = function (meta) {
      var methods = {};

      if (meta.hasMethodModifiersFor('initialize')) {
        var init = meta.getMethod('initialize');

        var modifiers = meta.stem.properties.methodsModifiers.getProperty('initialize');

        if (modifiers.length > 1) {
          throw 'Can only read one modifier (after or before) for initialize from Joose Class. You have to change the JooseClass!';
        }

        methods['init'] = modifiers[0].init;
      }

      meta.getMethods().eachOwn(function (jooseMethod, name) {
        var isReal = !jooseMethod.init.ACCESSOR_FROM;

        if (isReal) {
          methods[name] = jooseMethod.init;
        }

        /*
        } else if (key === 'after' || key === 'before') {
          _.forEach(value, function (body, name) {
            if (name !== 'initialize') {that.reflection.addMethod(name, 
              throw 'Cannot read other methdos then initialize in after or before from Joose class';
            }

            that.reflection.addMethod('init', body);
          });

       */
      });

      return methods;
    };
  };

});