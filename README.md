# :bug: [dumbass](https://github.com/dosyago/dumbass) [![npm](https://img.shields.io/npm/v/dumbass.svg?label=&color=0080FF)](https://github.com/dosyago/dumbass/releases/latest)

> Chosen by toddlers, insects, imbeciles and stupid coders.

Code components with cross-browser web standards. No JSX, no Shadow DOM, no fancy framworks, no opinions. 

- **Just HTML, CSS and JavaScript**—No JSX, no Shadow DOM, no fancy frameworks, no opinions. 
- **Stop learning, stagnate!**—Use the syntax you already know. Stop learning new things. Do more with what's already here.
- **Crazy and fun, but in a serious way**—Crayonz lifts HTML+CSS+JS to make it productive for building web app UIs. 

*To learn more*...oh wait, you already know enough. Read on to see 1 example and install mantras.

## Quickstart

Install dumbass with npm:

```console
npm i --save dumbass
```

Use [Parcel](https://parceljs.org) or [Webpack](https://webpack.js.org) and import:

```js
import { R, X } from "dumbass"
```

Or import in a module:

```html
<script type="module">
  import { R, X } from "https://unpkg.com/dumbass"
</script>
```

### Spinner Example

Here's the last example you'll ever need:
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
          <div wheel:passive=${spin}>
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

