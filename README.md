# :crayon: crayonz

Crayonz. Code components with cross-browser web standards. No JSX, no Shadow DOM, no fancy framworks, no opinions. 
:crayon:
:crayon:
:crayon:

## Examplez

### Spinner

Here's the first example to get you started: a spinner. 
[Try online here](https://codepen.io/dosycorp/pen/OJPQQzB?editors=1000).

```jsx
<!DOCTYPE html>
<html lang="en">
  <head> 
    <script type="module">
      import { R } from "https://unpkg.com/craydom/r.js";
      
      let state = 500;
      const inc = () => state++;
      const dec = () => state--;
      const spin = e => (e.deltaY > 0 ? inc() : dec(), Spin(state));
      const step = e => (state = e.target.value, Spin(state));
      
      Spin(state).to('body', 'beforeEnd');

      function Spin(n) {
        return R`  
          <div wheel=${spin}>
            <h1>
              <progress 
                max=1000
                value=${n}
              ></progress>
              <hr>
              <input 
                input=${step}
                type=number 
                value=${n}
              >
          </div>
        `;
      }
    </script>
  </head>
  <body>
  </body>
</html>
```

## Installz

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
  <script type=module src=https://unpkg.com/crayonz></script>
```


## Good weird

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


### Roadmap

- Finish some issues
- Watch the sunrise over a grateful universe

It's pretty much mature. Could add a state managment abstraction like single source of truth store, actions that drive a state machine. But who cares about that? Plenty of that around if that's what you need. This is just teh pure viewwww.
