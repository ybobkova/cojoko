# converting joose 2 cojoko

a raw Joose class (loaded with AMD) looks like this

```javascript
define(['joose', 'Psc/HTTPMessage'], function (Joose) {
  Joose.Class('Psc.Response', {
    isa: Psc.HTTPMessage,
  
    has: {
      code: { is : 'rw', required: true },
      reason: { is : 'rw', required: false, init: null },
      body: { is : 'rw', required: false, init: null }
      // headers die headers als string (werden dann geparsed)
    },
    
    after: {
      initialize: function (props) {
        if (props.headers) {
          this.parseHeader(props.headers);
        }
        
        if (typeof(this.getCode()) === 'string') {
          this.setCode(parseInt(this.$$code, 10));
        }
      }
    },
  
    methods: {
      toString: function () {
        return '[Psc.Response Code: '+this.$$code+']';
      },
      
      isValidation: function() {
        return this.getHeaderField('X-Psc-Cms-Validation') === 'true';
      }
    }
  });
});
```

We plan to do the following tasks:

  * extract `has`  (properties)
  * extract `isa:` (inheritance)
  * extract `does` (Traits)
  * extract `define` (dependencies)
  * save the code in `methods`  _as is_ (e.g. correctly indented)
    * convert this.$$property to this.property
    * convert this.SUPER calls? (low prio)
  * extract `after: { initialize: function () }` and convert it to `init: function` in cojoko
  * fix possible constructors (low prio, refactor Joose, first)
  * compile the Joose file into Cojoko
    * copy and modify the properties
      * change `is: 'rw'` into `is: 'gs'`
    * copy inheritance and traits

So after all this the Cojoko file would look like this:

```javascript
define(['cojoko', 'Psc/HTTPMessage'], function (Cojoko, HTTPMessage) {
  Cojoko.Class('Psc.Response', {

    isa: HTTPMessage,
  
    has: {
      code: { is : 'gs', required: true },
      reason: { is : 'gs', required: false, init: null },
      body: { is : 'gs', required: false, init: null }
    },
    
    init: function (props) {
      if (props.headers) {
        this.parseHeader(props.headers);
      }
        
      if (typeof(this.getCode()) === 'string') {
        this.setCode(parseInt(this.code, 10));
      }
    },
  
    toString: function () {
      return '[Psc.Response Code: '+this.code+']';
    },
      
    isValidation: function() {
      return this.getHeaderField('X-Psc-Cms-Validation') === 'true';
    }
  });
});
```
