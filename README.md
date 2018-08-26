# brutal.js (1.6.0)

Minimalist framework for building JS apps.

## News

New minor release (1.6.0).

Updates in this:

- Handlers object can be passed to templates on browser-side (tested) and server-side (untested) to dynamically add handlers.

Example:

```JavaScript
const handlers = {
  click: e => console.log(e),
  mouseover: e => alert(e)
};
R`<input handlers=${handlers}>`
```

is equivalent to:
```JavaScript
R`<input click=${e => console.log(e)} mouseover=${e => alert(e)}>`;
```

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

## Simple Example

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


