# Types of Properties

In Cojoko a property can be typed. This is especially useful for building knockout models. Because Cojoko needs to know when you have a property which is a collection (to use `ko.observableArray` instead of `ko.observable`).

Lets have a look at properties definition in cojoko with types for properties:
```javascript
has: {
  code: { is : 'gs', required: true, type: Cojoko.Integer },
  reason: { is : 'gs', required: false, type: Cojoko.String, init: null },
  body: { is : 'gs', required: false, init: null, type: Cojoko.Object }

  headers: { is: 'gsk', required: false, type: Cojoko.Collection(Cojoko.String)}
}
```


