var __hasProp = {}.hasOwnProperty;
var __mixin = function(baseClass, mixins) {
  for (var i = mixins.length - 1, mixin; i >= 0; i--) {
    mixin = mixins[i];
    for (var key in mixin) { 
      if (__hasProp.call(mixin, key)) {
        baseClass.prototype[key] = mixin[key];
      }
    }
  }
};
var __extends = function(child, parent) {

  for (var key in parent) { 
    if (__hasProp.call(parent, key)) {
      child[key] = parent[key]; 
    }
  }

  function Ctor() {
    this.constructor = child; 
  }

  Ctor.prototype = parent.prototype; 
  child.prototype = new Ctor(); 
  child.__super__ = parent.prototype; 

  return child; 
};