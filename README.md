# :bug: [dumbass](https://github.com/dosyago/dumbass) [![npm](https://img.shields.io/npm/v/dumbass.svg?label=&color=0080FF)](https://github.com/dosyago/dumbass/releases/latest)

> Chosen by toddlers, insects, imbeciles, stupid, lazy coders and boring people.

**Be boring, be dumb.**

Make components from cross-browser web standards without thinking too hard. No JSX, no Shadow DOM, no fancy framworks, no opinions.

- **Just HTML, CSS and JavaScript**—No JSX, no Shadow DOM, no fancy frameworks, no opinions. 
- **Stop learning, stagnate!**—Use the syntax you already know. Stop learning new things. Do more with what's already here.
- **Crazy and fun, but in a serious way**—Dumbass is the tool for people who don't want to think too hard to make UI. 

*To learn more*...oh wait, you already know enough. 

### Gorgeous Dumbass

```javascript     
function Spin(n) {
  return R`  
    <div 
      wheel:passive=${spin}
      touchmove:passive=${move}
    >
      <h1>
        <progress 
          max=1000
          value=${n}
        ></progress>
        <hr>
        <input 
          input=${step}
          type=number 
          value=${n}>
    </div>
  `;
}
```

## Still not bored?

You soon will be. Nothing amazing here: [Play with the full example on CodePen](https://codepen.io/dosycorp/pen/OJPQQzB?editors=1000)

See [even more boring code](https://github.com/dosyago/dumbass/blob/master/tests/rvanillatodo/src/app.js) in a 250 line [TodoMVC test](https://dosyago.github.io/dumbass/tests/rvanillatodo/)

## Install mantras

Install dumbass with npm:

```console
npm i --save dumbass
```

[Parcel](https://parceljs.org) or [Webpack](https://webpack.js.org) dumbass and import:

```js
import { R } from "dumbass"
```

[See a CodeSandbox how-to of above](https://codesandbox.io/s/dumbass-playground-7drzg)

Or import in a module:

```html
<script type="module">
  import { R } from "https://unpkg.com/dumbass"
</script>
```

[See a CodePen how-to of above](https://codepen.io/dosycorp/pen/OJPQQzB?editors=1000)

## Philosophy

Make code you can fix at 2 AM with a hangover. Use tools that let you do that.
