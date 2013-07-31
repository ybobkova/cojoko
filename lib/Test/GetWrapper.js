/*
Copyright 2012 Thorsten Lorenz.
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*jshint laxcomma:true */
define(['esprima'], function (esprima) {
  'use strict';
  
  var syntax = esprima.Syntax, parse  = esprima.parse;

  function getReturnStatement(body) {
    // only finds top level return statements (i.e. only one)
    // no conditional returns are (i.e. inside if/else block) are considered
    var returns = body
      .map(function (node) {
        if (node.type !== syntax.ReturnStatement) return null;
        
        var arg = node.argument;
        if (!arg) return null;

        return {
            argument: { type: arg.type, start: arg.range[0], end: arg.range[1] }
          , start: node.range[0]
          , end: node.range[1]
        };
      })
      .filter(function (x) { return x; });

    return returns.length ? returns[0] : null;
  }

  function getWrapper(ast, getReturn) {
    /* TODO: currently not handling:
     *  - define({ .. }) "Simple Name/Value Pairs" case (http://requirejs.org/docs/api.html#defsimple)
     *  - define(function(require, exports, module) {
            var a = require('a');
          }) - Simplified CommonJs Wrapper (http://requirejs.org/docs/api.html#cjsmodule)
    */

    var wrappers = ast.body
      .map(function (node) {
        if (node.type !== syntax.ExpressionStatement) return null;


        var expression = node.expression;
        if (!expression) return null;
        if (expression.type !== syntax.CallExpression) return null;

        var name = expression.callee.name;
        if (name !== 'define' && name !== 'require') return null;

        var args = expression['arguments'];
        if (!args.length) return null;

        // we found a requirejs wrapper
        var paths, fn, moduleName;
        if (args[0].type === syntax.FunctionExpression) {
          // define(callback)
          paths = [];
          fn = args[0];
        } else if(args[0].type === syntax.Literal) {
          // define('moduleName', [..], callback)
          moduleName = args[0].value;

          paths = args[1].elements.map(function (x) { return x.value; });
          fn = args[2];

        } else {
          // define([..], callback)

          // require('./foo');  - commonjs require -> no upgrade needed
          if (!args[0] || !args[0].elements) return null;

          paths = args[0].elements.map(function (x) { return x.value; });
          fn = args[1];
        }

        var params = fn && fn.params ? fn.params.map(function (x) { return x.name; }) : [];
        var fnInnerBody = fn && fn.body ? fn.body.body : null;

        var returnStmt;
        if (getReturn && fnInnerBody) {
          returnStmt = getReturnStatement(fnInnerBody);
        }

        var headEnd, tailStart;

        if (fn && fn.body) {
          headEnd = fn.body.range[0] + 1;
          tailStart = fn.body.range[1] - 1;
        } else {
          /* E.g.:
           * require([ 'handlebars-templates', 'router' ]);
           */
          headEnd = expression.range[1] + 1;
          tailStart = expression.range[1] + 2;
        }

        return { 
            name: name
          , moduleName: moduleName
          , paths: paths
          , params: params
          , 'returns': returnStmt
          , body: fnInnerBody
          , head: { start: expression.range[0], end: headEnd }
          , tail: { start: tailStart, end: expression.range[1] + 1 }
        };
      })
      .filter(function (x) { return x; });
    return wrappers.length ? wrappers[0] : null;
  }

  return function (code, getReturn) {
    try {
      var ast = parse(code, { range: true });
      return getWrapper(ast, getReturn);
    } catch (ex) {
      throw ex;
    }
  };

});