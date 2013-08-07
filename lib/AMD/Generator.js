define(['lodash', 'ast-types'], function (_) {
  var n = require("ast-types").namedTypes;
  var b = require("ast-types").builders;

  return function () {

    this.generateDefine = function(definition, innerStatements) {
      innerStatements = innerStatements || [];

      return b.callExpression(
        b.identifier('define'),
        this.generateDefineArguments(definition, innerStatements)
      );

    };

    this.generateDefineArguments = function(definition, innerStatements) {
      var defineArgs = [], paths = [], args = [];

      if (!definition.isAnonymous()) {
        defineArgs.push(b.literal(definition.getName()));
      }

      var depsWithoutAlias = [];
      _.forEach(definition.getDependencies(), function(dependency) {
        if (dependency.hasAlias()) {
          paths.push(
            b.literal(dependency.getPath())
          );
          args.push(b.identifier(dependency.getAlias()));
        } else {
          depsWithoutAlias.push(dependency);
        }
      });

      _.forEach(depsWithoutAlias, function (dependency) {
        paths.push(b.literal(dependency.getPath()));
      });

      defineArgs.push(b.arrayExpression(paths));
      defineArgs.push(b.functionExpression(null, args, b.blockStatement(innerStatements)));

      return defineArgs;
    };
  };
});