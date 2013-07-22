define(['joose'], function(Joose) {
  /**
   * Ein Trait für ein Objekt welches einen EventManager benutzt
   * 
   */
  Joose.Role('Psc.EventDispatching', {
    
    has: {
      eventManager: { is : 'rw', required: false, isPrivate: true }
    },
    
    before: { // after ist bissl schlecht, weil main z.b. den eventmanager schon beim after: initialize braucht, ich weiss aber nicht wie ich steuern kann, welches "after" zuerst ausgeführt wird?, before scheint aber erstmal gut zu laufen
      initialize: function (props) {
        if (!props.eventManager) {
          this.$$eventManager = {};
        }
      }
    },
  
    methods: {
      toString: function() {
        return "[Psc.EventDispatcher]";
      }
    }
  });
});