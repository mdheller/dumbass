# brutal.js (2.2.2)

**Brutal.JS has gone PRIVATE**

Minimalist framework for building JS apps. Aims to be more efficient than React, Vue or Angular, both for rendering and development.

[Tests](https://thiscris.com/brutal.js/tests/)

## Features

- Minimal DOM updates without "Virtual DOM" overhead
- Keyed and singleton components
- Only specify a component's position 1 time, every subsequent 
render invocation automagically updates the right nodes. 
- Uses native JS features and requires no transpilation or build step.
- Fully isomorphic, running browser-side or server-side (with builtin hydration).
- Use normal HTML conventions (omit some end tags, omit quotes, lowercase attr names ~ unlike JSX).
- Add event listeners inline using the lowercased event name, like `click`, `keydown`, etc.
- Small, fast and XSS safe. 
- Can be used in place of Deku, lit-html, AppRun or React.

## Examples

You can see the below test working [here](https://thiscris.com/brutal.js/tests/example_test.html).

This demonstrates minimal DOM updating, and keyed and singleton 'DOM pinning' of components/templates.

```jsx

  import {R,$} from '../r.js';

  self.firsth1 = null;
  self.secondh1 = null;


  // A brutal template uses the `R` template tag:
  let sayHello = (name) => R`<h1 bond=${el => firsth1 = el}>Hello ${name}</h1>`;

  // It's rendered with the `to()` function:
  sayHello('World').to(document.body, 'afterBegin');

  // And re-renders only update the data that changed, without
  // VDOM diffing!
  // And it automagically knows WHERE to update those nodes. 
  setTimeout(() => sayHello('Everyone'), 1000);

  setTimeout(() => { 
    secondh1 = document.querySelector('h1'); 
    alert(firsth1 === secondh1) 
  }, 3000);


  // the automagical updating even works with keys, 
  // just include a template value that's an object with a 'key' property

  let keyedSayHello = (name, key) => $`${{key}} <p>I am ${name}</p>`;

  keyedSayHello('Peter', 1).to(document.body, 'beforeEnd');
  keyedSayHello('Adam', 2).to(document.body, 'beforeEnd');
  setTimeout(() => keyedSayHello('Michael-Peter', 1), 4000);
  setTimeout(() => keyedSayHello('Cain & Abel', 2), 3000);
```

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

For more extensive examples, [the tests listed above](https://thiscris.com/brutal.js/tests/), or see [a TodoMVC app written in Brutal.js](https://github.com/crislin2046/rvanillatodo). Also take a look at the component code in [Brutestrap UI Kit](https://github.com/crislin2046/brutestrap), a UI Kit being built with Brutal.js (and incorporating [C3S](https://github.com/crislin2046/c3s) for scoping styles to components).

## Basic documentation

### Handlers 

There's two ways to add event handlers to your markup. 

Either directly in the template string with `eventName=${functionValue}` syntax or by passing an object with 
`handlers=${handlersObj}` syntax.

The handlers object must map event names to function values. 

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

### Multiple listeners per event

In order to add multiple listeners, use an array of functions:

```JSX
R`<button click=${[
    e => console.log(e), 
    f => { if ( f.target.matches('[value="clear"]') ) f.target.closest('form').reset() }
  ]}>Clear Form</button>`;
  ```

## Issues

### Syntax noise

Brutal.js:

```jsx
function view(state) {
  return $`
    <article class="media ${state.profile?"profile":""}">
        ${ArticleHeader(state)}
        ${
          state.byline?
            $`<p class=byline>${state.byline}</p>` :
            $`<p class=tags>${state.tags}</p>`
        }
        ${
          state.paragraphs.map(p => $`<p>${p}</p>`)
        }
    </article>
  `;
}
```

React.JS:

```jsx
function view(state) {
  return (
    <article classNames="media {state.profile?"profile":""}">
      <ArticleHeader props={state}></ArticleHeader>
      {
        state.byline?
          <p classNames="byline">{state.byline}</p> :
          <p classNames="tags">{state.tags}</p>
      }
      {
        state.paragraphs.map(p => <p>{p}</p>)
      }
  );
}
```

You can decide which syntax noise you prefer. For my part, I prefer the Brutal.JS one, and especially prefer how no transpiler / toolchain is required to use it.

I also particularly like how the `$` alias designates the "boundary" between markup and code. It indicates when we "go in" to markup, 
via `` $` `` and indicates when we "go out" of markup, via `${`.

## Other information

### Where does Brutal come from?

Brutal is a project to build a minimal framework for JS apps in non-transpiled pure ECMAScript. 

It does minimal DOM updates without the use of a virtual DOM. It uses template literals instead of JSX. The main file (r.js) is just 500 SLOC. 

It came out of two projects I did to attempt to build a React-like API without using React's source code or JSX at all. I followed the React Tutorial and built the minimal amount of code to copy the demos given in the tutorial. The projects (with live demos as GitHub pages) are:

- [Racked.js - React without Babel in 500 lines](https://github.com/crislin2046/racked-js-react-without-babel-in-500-lines)
- [Explore React without React](https://github.com/crislin2046/explore-react-without-react)

### Other similar/related projects

- [lit-html](https://github.com/Polymer/lit-html)

