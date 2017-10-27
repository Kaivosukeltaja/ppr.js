[![Coverage Status](https://coveralls.io/repos/github/Houston-Inc/ppr.js/badge.svg?branch=master)](https://coveralls.io/github/Houston-Inc/ppr.js?branch=master)
[![Build Status](https://travis-ci.org/Houston-Inc/ppr.js.svg?branch=master)](https://travis-ci.org/Houston-Inc/ppr.js)

# Introduction

PPR.js is a JavaScript library for hydrating a statically rendered HTML page. It is designed to be used with CMS generated pages with lots of variation and different components. PPR.js works well together with RequireJS to load only the functionality and dependencies of the components present on the page.

PPR.js uses jQuery to search all elements on the page with the `data-component="exampleComponent"` attribute set. It then finds the JS code associated with the name `exampleComponent` and builds it.

```html
<div class="test" data-component="exampleComponent">
  <button>Click me</button>
</div>
```

```javascript
import BasePrototype from 'ppr.component.baseprototype';

export default class ExampleComponent extends BasePrototype {
  build() {
    this.node.find('button').click(() => {
      alert('Hello world!');
    });
  }
}
```

## Installation

To use PPR.js in your project, first install it using NPM or yarn:

    npm install ppr-js --save

or

    yarn add ppr-js

## Building

To build minimized javascript

    gulp build:dist

## TODO

* Improve documentation
