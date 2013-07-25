define(['Cojoko/Class', 'joose', 'lodash'], function (CojokoClass, Joose, _) {

  return function () {
    var that = this;

    this.read = function (JooseClass) {
      var meta = JooseClass.meta;

      return new CojokoClass(JooseClass.meta.name, {
        mixins: that.readMixins(meta),

        properties: that.readProperties(meta),

        methods: that.readMethods(meta)
      });
    };

    this.readProperties = function (meta) {
      var properties = {};

      meta.getAttributes().eachOwn(function (jooseAttribute, name) {
        properties[name] = {
          'is': that.readAttributeIs(jooseAttribute, meta.name+'::'+name),
          required: jooseAttribute.required,
          init: that.readAttributeInit(jooseAttribute)
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

      return methods;
    };

    that.readMixins = function (meta) {
      var mixins = [];
      var roles = meta.getRoles();

      if (meta.superClass) {
        mixins.push(meta.superClass.meta.name);
      }

      for (var i = 0; i < roles.length; i++) {
        mixins.push(roles[i].meta.name);
      }

      return mixins;
    };
  };

});