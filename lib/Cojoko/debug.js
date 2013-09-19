/*globals console:true */
define(function () {

  return function () {
    if (console && console.log) {
      console.log.apply(this, arguments);
    }
  };

});