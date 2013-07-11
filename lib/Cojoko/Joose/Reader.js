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
    };
  };
});