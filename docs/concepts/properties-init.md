# Init values of properties

In Cojoko a property can have an init value. It is given as the "init" key of the property specification. If init is left out `undefined` is used.


Lets have a look at properties definition in cojoko with init for properties:

```javascript
    has: {
      num: { is : 'gs', required: true, init: 200, type: "Integer" },
      flag: { is : 'gs', required: false, type: "Boolean", init: false },
  
      content: { is : 'gs', required: false, init: {}, type: "Object" }

      struct: { is: 'gsk', required: false, init: ["inside"], type: "Array<String>"}
    }
```

Notice: Using `{}` or arrays like `[1, 2]` in the init key have a special meaning: Cojoko clones these object types and assigns it to the object on initialisation.
If Cojoko would not clone these structures they would be common for all instances of the Cojoko class, which is not directly what you would expect:

(init-object-properties.example)
```javascript
  var Person = Cojoko.Class({
    names: { is: 'gw', required: false, init: [], type: "Array" },

    methods: {
      addNamePart: function (part) {
        this.names.push(part);

        return this;
      }
    }
  });

  var bob = new Person();
  bob.addNamePart("Bob").addNamePart("Kelzow");
  // bob.getNames() == ["Bob", "Kelzow"]


  var anna = new Person();
  anna.addNamePart("Anna");
  // anna.getNames() == ["Anna"]
```
You would always expect that annas names are `["Anna"]` but if Cojoko would not clone the array given in `init` the names property for anna would be: `["Bob", "Kelzow", "Anna"]`. The prototype chain would inherit the property and so both instances would point to the array from init and therefore  push would modify the array in both instances. Because this is not what you expected in most progarmming languages Cojoko does the cloning for you.

## the init() function 

every CojokoClass can have one init() function for initializing the state of the object. The function is called with the parameters given to the constructor as an object hash. The parameters are the unfiltered and unaltered. The init values given to a property are  applied to the class member variables before.

```javascript
  var Person = Cojoko.Class({
    name: { is: 'gw', required: false, init: 'P', type: "String" },
    lastName: { is: 'gw', required: false, init: 'Sc', type: "String" },

    methods: {
      init: function (props) {

        // when props.name is === undefined this.name is 'P'
        // when props.lastName is === undefined this.name is 'Sc'

        // when props.name is !== undefined as 'foo' this.name is 'foo'
        // when props.lastName is !== undefined as 'foo' this.lastName is 'foo'
      }
    }

  });
```