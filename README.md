# cojoko

Cojoko stands for **Co**mpiling **Jo**ose with **K**nock **o**ut.  
It's an compiled advanced meta object system (Joose) for javascript which supports the generation of view models for [Knockout](http://knockoutjs.com).

## Introduction

I really like the idea of Joose: It lets you create OOP classes for real javascript oo-models without knowing anyything about prototypes and everything else. That might scare you, but it leads to very declarative code:

```javascript
define('joose', function (Joose) {

  return Joose.Class('Person', {
    
    has : {
      firstName : { is : 'rw' },
      lastName : { is : 'rw' }
    },
    
    methods : {
      getFullName: function () {
        return this.$$firstName+' '+this.$$lastName;
      }
    }
    
  });

});
```

You can do normal OOP and sophisticated OOP with Joose:

```javascript
define('joose', './Person', './Identifyable', function (Joose, Person, Identifyable) {

  return Joose.Class('User', {
    
    isa: Person,
    
    does: [Identifyable]
    
    has : {
      email: { is : 'rw' }
    },
    
    methods : {
      login: function () {
        ...
      }
    }
    
  });

});
```
