# brutal.js

Minimalist framework for building JS apps.

## Features

- Uses native JS features and requires no transpilation or build step.
- Fully isomorphic, running browser-side or server-side (with builtin hydration).
- Use normal HTML conventions (omit some end tags, omit quotes, lowercase attr names ~ unlike JSX).
- Add event listeners inline using either the lowercased event name, with or without the standard `on` prefix.
- Small, fast and XSS safe. 
- Can be used in place of Deku, lit-html or React.

## Installing

From NPM:

```shell
$ npm i --save brutalist-web
```

Then using on server with CJS:

```JavaScript
  const {R} = require('brutalist-web');
```

Or using on server with ESM:

```JavaScript
  import {R} from 'brutalist-web';
```

Using on client with the Unpkg CDN:

```HTML
  <script type=module src=https://unpkg.com/brutalist-web/r.js></script>
```

Consider relative paths if you want to self-host.
For example, (you probably wouldn't do this): if you were serving your node_modules directory,
at the `/node_modules` path, and the script importing was serving from the `/app` path, you would import like:

`/app/script.js`:

```JavaScript
  import {R} from '../node_modules/brutalist-web/r.js';
```

*Note: The client imports require you to specify `r.js` while the server does not.
This is owing to the current slightly different syntax and semantics of ES imports
between client and server.*

## "React like"

This is React/JSX:

```JSX
  function ButtonWidget(props) {
    return (
      <button onClick={() => showModal(props.name)}>
        Show {props.name} Modal
      </button>
    );
  }
```

This is Brutal.js:

```JavaScript
function ButtonWidget({name}) {
  return R`
    <button click=${() => showModal(name)}>
      Show ${name} Modal
    </button>
  `;
}
```

## More examples

For more extensive examples, see [a TodoMVC app written in Brutal.js](https://github.com/crislin2046/rvanillatodo).


## Roadmap

- Working on a subset that enables SSR without requiring client side JS. The idea is to base it on forms and submit the entire application state to the server at each request. This "monolithic" view can be further factored into targeted forms and named iframes if desired.

## Inspiration

Althought I developed Brutal independently based on my own reflections and observations of what I would want in a good framework to make myself productive and the weaknesses of existing solutions, it turns out there are others, such as [lit-html](https://github.com/Polymer/lit-html) and [HEX](https://medium.com/@metapgmr/hex-a-no-framework-approach-to-building-modern-web-apps-e43f74190b9c) that are thinking similar things. This is good. I hope the next couple years ushers in a new era of web dev where we see a proliferation of smaller frameworks, perhaps implementing something that converges toward some sort of "standard" for web dev.

