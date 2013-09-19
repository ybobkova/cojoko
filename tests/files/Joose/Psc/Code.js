/*global console:true */
define(['joose', 'JSON', 'Psc/WrongValueException', 'Psc/Exception'], function(Joose) {
  Joose.Class('Psc.Code', {
    
    my: {
      has: {
        logging: { is : 'rw', required: false, init: navigator.userAgent.indexOf('Firefox') !== -1} // alle anderen machen stress
      },
      
      methods: {
        // schneller wäre ein logobject welches dann "leer" ist wenn logging aus ist
        group: function (name, collapsed) {
          if (this.logging) {
            if (collapsed && console.groupCollapsed) {
              console.groupCollapsed(name);
            } else if (console.group) {
              console.group(name);
            }
          }
        },
        endGroup: function () {
          if (this.logging && console.groupEnd) {
            console.groupEnd();
          }
        },
        log: function () {
          if (this.logging && console.log) { 
            (console.log).apply(console, arguments);
          }
        },
        debug: function() {
          if (this.logging && console.debug) { 
            (console.debug).apply(console, arguments);
          }
        },
        error: function () {
          if (this.logging && console.error) {
            (console.error).apply(console, arguments);
          }
        },
        info: function () {
          if (this.logging && console.info) {
            (console.info).apply(console, arguments);
          }
        },
        warn: function () {
          if (this.logging && console.warn) {
            (console.warn).apply(console, arguments);
          }
        },
        warning: function () {
          if (this.logging && console.warn) {
            (console.warn).apply(console, arguments);
          }
        },
        
        value: function () {
          var values = (Array.prototype.slice).apply(arguments), value = values.shift();
          
          if (Joose.A.exists(values, value)) {
            return value;
          } else {
            throw new Psc.WrongValueException("Wert '"+Psc.Code.varInfo(value)+"' ist nicht erlaubt");
          }
        },
        
        /**
         * Überprüft Klassen + Roles
         */
        isInstanceOf: function(obj, constructor) {
          if (!Joose.O.isClass(constructor)) {
            throw new Psc.Exception('isInstanceOf parameter #2 muss ein Constructor einer Joose Class sein. '+Psc.Code.varInfo(constructor)+' wurde übergeben');
          }
          
          if (!Joose.O.isInstance(obj)) {
            return false;
          }
          
          
          if (constructor.meta instanceof Joose.Meta.Role) {
            return obj.meta.does(constructor) ? true : false;
          }
          
          // joose.o. gibt hier undefined zurück deshalb "casten" wir zu bool
          return (obj instanceof constructor) ? true : false;
        },
        
        // fragt auch parents nach "does"
        isRole: function (obj, roleConstructor) {
          if (!Joose.O.isClass(roleConstructor)) {
            throw new Psc.Exception('isRole parameter #2 muss ein Constructor einer Joose Role sein. '+Psc.Code.varInfo(roleConstructor)+' wurde übergeben');
          }
          
          return (Joose.O.isInstance(obj) && obj.meta.does(roleConstructor)) ? true : false;
        },
        
        assertRole: function (obj, roleConstructor, argumentName, context) {
          if (!Psc.Code.isRole(obj, roleConstructor)) {
            throw new Psc.InvalidArgumentException(argumentName, roleConstructor.toString(), obj+' ('+Psc.Code.getRoles(obj)+')', context);
          }
        },
        
        assertClass: function (obj, classConstructor, argumentName, context) {
          if (!Psc.Code.isInstanceOf(obj, classConstructor)) {
            throw new Psc.InvalidArgumentException(argumentName, classConstructor.toString(), obj, context);
          }
        },
        
        assertInteger: function (integer, argumentName, context) {
          if (!Psc.Code.isInteger(integer)) {
            throw new Psc.InvalidArgumentException(argumentName, "integer", integer, context);
          }
        },
    
        assertArray: function (array, argumentName, context) {
          if (!Psc.Code.isArray(array)) {
            throw new Psc.InvalidArgumentException(argumentName, "array", array, context);
          }
        },
        
        // gibt nur die roles des objektes direkt aus (nicht alle der hierarchy)
        getRoles: function (obj) {
          if (Joose.O.isInstance(obj)) {
            return obj.meta.getRoles();
          } else {
            return [];
          }
        },
        
        odump: function(object) {
          if (Joose.O.isInstance(object)) {
            return object.toString();
          } else {
            return JSON.stringify(object);
          }
        },
        varInfo: function (variable) {
          if (typeof variable === 'object') {
            
            if (variable.jquery) {
              if (variable.length === 0) {
                return '[] jQuery("'+variable.selector+'") length: '+variable.length;
              } else {
                return 'jQuery("'+variable.selector+'") length: '+variable.length;
              }
            }
            
            return Psc.Code.odump(variable);
          } else {
            return variable;
          }
        },
        
        isArray: function (variable) {
          return Object.prototype.toString.apply(variable) === '[object Array]';
        },
    
        isInteger: function (variable) {
          return typeof variable === 'number';
        },
        
        isFunction : function (variable) {
          return $.isFunction(variable);
        },
        
        hasSessionStorage: function() {
          var x = "psc-test-string";
          try {
            sessionStorage.setItem( x, x );
            sessionStorage.removeItem( x );
            return true;
          } catch( e ) {
            return false;
          }
        }
      }
    }
  });
});