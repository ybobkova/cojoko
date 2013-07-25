var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
  var keys = [];
  
  for (var key in parent) { 
    if (__hasProp.call(parent, key)) {
      keys.push(key);
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