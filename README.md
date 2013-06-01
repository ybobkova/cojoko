# Cojoko

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

## Why Cojoko

Okay Joose is great. Knockout is greater. Writing models for Knockout is a little bit verbose. When you already have an model its just a lot of straight forward coding. When you have an Backend-API which has the same model as in youre javascript application, you'll have to write 3 models to get your application up and running: 
  * At least one backend-model, 
  * one model written in Joose
  * one view written in Knockout compatible style. 

Thats a lot typing for one model with mostly the same properties in every class.  
Thats where Cojoko bridges the gap. Cojoko allows you to 
  * compile the model description, which can be easily created with any backend (because you're able to export it as JSON). 
  * have a vanilla javascript model which is fast and easy to understand (no blackbox OOP avaible)
  * derive a Knockout view from it and use it directly in your MVVC architecture
