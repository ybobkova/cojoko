define(['./ClassReflection', 'lodash'], function (ClassReflection, _) {

  return function (name, spec) {
    var that = this;

    if (typeof(name) === 'object' && spec === undefined) {
      spec = name;
      name = undefined;
    }

    this.name = name;

    this.initReflection = function (spec)  {
      that.reflection = new ClassReflection();

      _.forEach(spec, function (value, key) {
        if (key === 'has' || key === 'properties') {
          _.forEach(value, function (propertySpec, name) {
            that.reflection.addProperty(name, propertySpec);
          });

        } else if (key === 'methods') {
          _.forEach(value, function (body, name) {
            that.reflection.addMethod(name, body);
          });

        } else {
          that.reflection.addMethod(key, value);
        }

      });
    };

    this.initReflection(spec);
  };
});