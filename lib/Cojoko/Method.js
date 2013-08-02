define(['lodash'], function (_) {

  return function (name, body) {
    var that = this;
    this.name = name;
    
    if (_.isString(body)) {
      this.body = body;
    } else if (_.isFunction(body)) {
      this.body = body.toString();
    } else {
      throw new Error('Invalid argument for body of method. Use string or function (will be converter to string with toString() of function)');
    }

    this.getBodyAsString = function() {
      return this.body;
    };

    /**
     * @param function do function(string code) must return the code for the body (modified)
     */
    this.modifyBody = function(modify) {
      this.body = modify(this.body);
      return this;
    };

    this.setName = function (name) {
      this.name = name;
      return this;
    };

    this.getName = function () {
      return this.name;
    };
  };
});