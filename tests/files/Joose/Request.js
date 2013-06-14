define(['joose', 'Psc/Code','Psc/HTTPMessage'], function(Joose) {
  Joose.Class('Psc.Request', {
    isa: Psc.HTTPMessage,
    
    has: {
      // sendAs kann übergeben werden und 'json' sein. dann wird der Request mit content typ application/json gesetzt und der converter auf JSON.stringify gesetzt
      url: { is : 'rw', required: true, isPrivate: true },
      method: { is : 'rw', required: true, isPrivate: true },
  
      body: { is : 'rw', required: false, isPrivate: true },
      format: { is : 'rw', required: false, isPrivate: true, init: 'json' },
      // der contenType der beim Senden gesetzt wird. Wenn nicht gesetzt gilt der jQuery default
      contentType: { is : 'rw', required: false, isPrivate: true },
      converter: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        if (props.method === 'GET') {
          // cleanup url
          this.$$url = this.$$url.replace(/^(.*)\?$/,'$1');
        }
        
        if (props.sendAs) {
          this.sendAs(props.sendAs);
        }
      }
    },
    
    methods: {
      setMethod: function (method) {
        Psc.Code.value(method, 'POST', 'GET', 'PUT', 'DELETE');
        this.$$method = method;
  
        if (method !== 'POST' && method !== 'GET') {
          this.setHeaderField('X-Psc-Cms-Request-Method',method);
        } else {
          this.removeHeaderField('X-Psc-Cms-Request-Method');
        }
      },
      setFormat: function (format) {
        Psc.Code.value(format, 'html','json','xlsx','xls','text');
  
        this.$$format = format;
      },
      initialize: function (props) {
        this.setMethod(props.method);
        
        if (props.format) { this.setFormat(props.format); }
  
        this.SUPER(props);
      },
      
      getConvertedBody: function () {
        var body = this.$$body;
        
        if ($.isFunction(this.$$converter)) {
          body = (this.$$converter)(body);
        }
        
        return body;
      },
      
      sendAs: function (type) {
        if (type === 'json') {
          this.$$contentType = 'application/json';
          this.$$converter = JSON.stringify;
        }
        return this;
      },
      
      /**
       * Gibt an Ob der Request bei getBody() bereits umgewandelt wurde und somit "raw" abgeschickt werden kann
       * @return bool
       */
      isConverted: function() {
        return $.isFunction(this.$$converted);
      },
      
      copy: function () {
        return new Psc.Request({
          url: this.$$url,
          method: this.$$method,
          body: this.$$body,
          format: this.$$format,
          contentType: this.$$contentType,
          converter: this.$$converter
        });
      }
    }
  });
});