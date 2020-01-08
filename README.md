# :crayon:crayonz

Crayonz. Code components with cross-browser web standards. No JSX, no Shadow DOM, no fancy framworks, no opinions. 

## Examples

### Counter

Here's the first example to get you started: a counter that can go up or down. You can try it online [here](https://jsfiddle.net/10sjw4Lx/1/).

```html
<!DOCTYPE html>
<html lang="en">
  <head> 
    <script type="module">
      import { R } from "https://unpkg.com/craydom/r.js";
      
      let state = 0;
      const inc = () => state = state + 1;
      const dec = () => state = state - 1;
      const render = () => Counter(state);
      
      render().to('body', 'beforeEnd');

      function Counter(n) {
        return R`  
          <div wheel=${e => (e.deltaY > 0 ? inc() : dec(), render())}>
            <h1>${n}</h1>
          </div>
        `;
      }
    </script>
  </head>
  <body>
  </body>
</html>
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

## Installing

From NPM:

```shell
$ npm i --save crayonz
```

Then using on server with CJS:

```JavaScript
  import {R,X} from 'crayonz';
```

Using on client with the Unpkg CDN:

```HTML
  <script type=module src=https://unpkg.com/crayonz/r.js></script>
```

## Simple Example

This is crayonz:

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
