# :crayon:dom

Get the craydom.

Do the calculation.

The craydom is best.

```math
craydom = pure view + (minimal diffing) - (virtual DOM)
```

## Features

- Minimal DOM updates without "Virtual DOM" overhead
- Keyed, singleton (from `R` tag), and clone (from `X` tag) components
- Pinned DOM locations
- Uses native JS features and requires no transpilation or build step.
- Fully isomorphic, running browser-side or server-side (with builtin hydration).
- Use normal HTML conventions (omit some end tags, omit quotes, lowercase attr names ~ unlike JSX).
- Concise, declarative, literate syntax using tagged template literals.
- Add event listeners inline using the lowercased event name, like `click`, `keydown`, etc.
- Small, fast and XSS safe. 
- Can be used in place of Deku, lit-html, AppRun or React.
- Namespaced event attributes add flags to addEventListener like `capture`, `passive` and `once`.

## 2 line tutorial

1. Install :crayon:dom
2. Write views with template tag functions: R`...html...` for pinned/keyed components, X`...html...` for clone/duplicate components.

## Examples

### Counter

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { R } from "https://unpkg.com/craydom/r.js";
      
      let state = 0;
      const inc = () => state = state + 1;
      const dec = () => state = state - 1;
      
      Counter(state).to('#app');

      function Counter(state) {
        return R`
          <h1>${state}</h1>
          <button click=${() => {dec(); Counter(state)}}>-</button>
          <button click=${() => {inc(); Counter(state)}}>+</button>
        `;
      }
    </script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>
```

### Projects Using Craydom

It's used for the view UI for [this project](https://github.com/dosyago/supreme-architect). 

## Installing

From NPM:

```shell
$ npm i --save craydom
```

Then using on server with CJS:

```JavaScript
  import {R,X} from 'craydom';
```

Using on client with the Unpkg CDN:

```HTML
  <script type=module src=https://unpkg.com/craydom/r.js></script>
```

## Simple Example

This is craydom:

```JavaScript
function ButtonWidget({name}) {
  return R`
    <button click=${() => showModal(name)}>
      Show ${name} Modal
    </button>
  `;
}
```

### Other similar/inferior/related projects

- [lit-html](https://github.com/Polymer/lit-html)

### Current version

v2.3.6

### Roadmap

- Finish some issues
- Watch the sunrise over a grateful universe

It's pretty much mature. Could add a state managment abstraction like single source of truth store, actions that drive a state machine. But who cares about that? Plenty of that around if that's what you need. This is just teh pure viewwww.
