define(['qunit-assert', 'test-setup'], function(t, testSetup) {
  
  module("<%= testName %>");

  var setup = function (test) {
    var <%= testOnlyName %> = {};
    
    return t.setup(test, {<%= testOnlyName %>: <%= testOnlyName %>});
  };
  
  test("", function() {
    var that = setup(this);
  });
});