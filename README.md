# Cojoko [![Build Status](https://travis-ci.org/pscheit/cojoko.png?branch=master)](https://travis-ci.org/pscheit/cojoko)

It's an compiled advanced meta object system (inspired by Joose) for javascript which supports the generation of view models for [Knockout](http://knockoutjs.com).

## Introduction

Cojoko is heavily inspired by Joose. But it is compiled to VanillaScript, kept up to date and is delivered as AMD.  
I really liked the idea of Joose: It lets you create OOP classes for real javascript oo-models without knowing anyything about prototypes and inheritance in javascript. That might scare you first, but it leads to very declarative code:

```javascript
define('cojoko', function (Cojoko) {

  return Cojoko.Class('Person', {
    
    properties: {
      firstName : { is : 'gs' },
      lastName : { is : 'gs' }
    },
    
    methods : {
      getFullName: function () {
        return this.firstName+' '+this.lastName;
      }
    }
  });
});
```

You can do normal OOP and sophisticated OOP with Cojoko:

```javascript
define('cojoko', './Person', './Identifyable', function (Cojoko, Person, Identifyable) {

  return Cojoko.Class('User', {
    
    'extends': Person,
    
    mixins: [Identifyable],
    
    properties: {
      email: { is : 'gs', required: true }
    },
    
    methods: {
      login: function () {
        // ...
      }
    }

  });

});
```

## Why Cojoko

Okay the way of writing code like this is great. But Knockout is greater, isn't it? Writing models for Knockout is a little bit verbose. When you already have some model it's just a lot of straight forward coding. When you have an Backend-API which has the same model as in you're javascript application, you'll have to write 3 models to get your application up and running: 

  * At least one backend-model, 
  * one model written in Joose
  * one view written in Knockout compatible style. 

Thats a lot typing for one model with mostly the same properties in every class.  
Thats where Cojoko bridges the gap. Cojoko allows you to 

  * compile the model description, which can be easily created with any backend (because you're able to export it as JSON). 
  * have a vanilla javascript model which is fast and easy to understand (no blackbox OOP avaible)
  * derive a Knockout view from it and use it directly in your MVVC architecture

## Dependencies

Cojoko is build on these great libraries:

  * Esprima ([esprima.org](http://esprima.org), BSD license)
  * Escodegen ([escodegen](http://github.com/Constellation/escodegen))
  * AST Types ([ast-types](https://github.com/benjamn/ast-types))
  * uses the [Mozilla Parser API](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API)

## License

Copyright (c) 2013 ps-webforge.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
