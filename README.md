# brutal.js

A crazy-small ~framework~file for building brutal/brutalist web applications

## small

110 source lines of code. 2 functions: `R` and `render`

That's just ~3Kb unzipped uminified. Compared to [~10x to 30x that](https://gist.github.com/Restuta/cda69e50a853aa64912d) gzipped minified for big frameworks. 

Basic usage:

```JavaScript
  render(App(), document.getElementById('root'));
```

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

This is R/brutal.js:

```JavaScript
function ButtonWidget({name}) {
  return R`
    <button click=${() => showModal(name)}>
      Show ${name} Modal
    </button>
  `;
}
```

## just how small is it? 

The above function as an arrow in React/JSX:

```JSX
const ButtonWidget = ({name}) => (<button onClick={() => showModal(name)}>Show {name} Modal</button>);
```

That same arrow in R/brutal.js:

```JavaScript
const ButtonWidget = ({name}) => R`<button click=${() => showModal(name)}>Show ${name} Modal</button>`;
```

**brutal.js costs you 1 more character, and saves you around 90Kb of framework to get to that point.**

### Differences to notice

- Event listeners are named by event names directly. No `on-` prefix. So use `click` not `onclick`
- There is never any need to quote an attribute, brutal does it for you, so 
  `title=${title}` never `title="${title}"`
- every bit of HTML is tagged with an R and written with backticks. Technically, this is an ES6 template literal and template tag function.
- Every replaced value is enclosed in `${...}` instead of `{...}`

## Why brutalist?

To me, brutalist means as close to the basic raw HTML/ JavaScript as possible. 
There's more to do on the roadmap, but for many projects, these simple functions are enough. 
For example, take a look at [a working TodoMVC example](https://dosyago-coder-0.github.io/rvanillatodo/) made with brutal.js.
Everything in brutal is "as close to the metal" ( the JS / HTML ) as possible. This is ensured by their being minimal JS code,
minimal opinionation (everything is just HTML elements and event handlers), leaving you free to structure things however you like. 

## roadmap

- Server side rendering / client-server symmetry
- Encourage / macro-ise targeted forms and named iframes ( sooo brutal )
- Encourage / bundle brutalist CSS sheets
- Explore using intercooler-like attributes for async/await fetch

## conclusion

If you know HTML and JS, you know brutal.js. Give it a spin, open an issue, make a PR, and let me know how you're using it, and where you think it should go.

## projects using brutal.js

- [TodoMVC in brutal.js](https://github.com/dosyago-coder-0/rvanillatodo)

### show hn

- [Show HN: Brutal.js – a small framework for building brutalist web applications](https://news.ycombinator.com/item?id=17484253)

--------

## more information 

### case-study: differences with lit-html

Brutal is somewhat similar to [lit-html](https://github.com/Polymer/lit-html). 

It's also much smaller (3Kb compared to ~25kb unzipped unminified) and simpler.

And much more limited. 

Brutal just supports adding event listeners to HTML, and templating values.

It does not support Promises, case-sensitive attribute names, or other "framework"-like complexities. 
If you want fetched data in your HTML output, fetch it before your HTML render, then render.

### why so simple?

With additional features come exponential or gemoetrically more code and bugs and interactions. This is mostly undesirable. 

#### all about development speed (and load speed, and bandwidth cost, and complexity cost...)

Brutal just wants to help you build things in a simple way and quickly. It has all the power of HTML/CSS/JS, just in a convenient JSX like syntax, but without any big files or build steps. Just works in the browser right now.

#### anti-framework framework

In this sense, Brutal.js is an anti-framework. 

But that's not even it's aim.

It's aim is to get as close to the raw material (HTML/CSS/JS) as possible and let you decide how to work with it based on your function. It's meant to make it fast and easy for you to build what you want. 

It doesn't have to be as hard as the frameworks think it does. 

## Make Web Literate Again

Use Brutal to write simple functions that render to HTML right off the bat in all modern browsers, without the burden of massive amounts of code, opinionated conceptual models, learning curves and technical-debt/lock in.

**The simple way the web was meant to be.**

------

# benefits

*Note the following section was adapted from / inspired by the README.md of [lit-html](https://github.com/Polymer/lit-html) an unrelated but syntax-similar framework. Lit-html does not support adding event listeners, and Brutal **does** support adding event listeners.*

## Event-listeners

Any valid DOM/HTML event can be added. Here's a simple literate and working example to create an editable div in Brutal.j: 

```JavaScript
const EditableDiv = content => R`
  <div class=edit dblclick=${editContent} blur=${endEdit}>
    ${content}
  </div>
`;
load = () => render(EditableDiv('hello world'),document.body);

function editContent({dblClick:{srcElement}}) {
  if( srcElement.matches('.edit') ) {
    srcElement.setAttribute("contenteditable","")
  } else {
    srcElement.closest('.edit').setAttribute("contenteditable","");
  }
}
function endEdit({blur:{srcElement}}) {
  srcElement.removeAttribute("contenteditable");
}
```

## Performance

Brutal is designed to be lightweight and fast. It utilizes the built-in JS and HTML parsers - it doesn't include any expression or markup parser of its own.

## Features

### Simple expressions and literals

Anything coercible to strings are supported:

```javascript
const Foo = () => R`foo is ${foo}`;
```

### Attribute-value Expressions

```javascript
const BlueDiv = () => R`<div class="${blue}"></div>`;
```

### Arrays/Iterables

```javascript
const items = [1, 2, 3];
const Items = () => R`<ul>${items.map(i => `<li>${i}</li>`)}</ul>`;
```

### Nested Templates

```javascript
const Header = title => R`<h1>${title}</h1>`;
const App = () => R`
  ${Header('The head')}
  <p>And the body</p>
`;
```

### Composability

These features compose so you can render iterables of functions that return arrays of nested templates, etc...

## Benefits over HTML templates

Brutal has basically all of the benefits of HTML-in-JS systems like JSX, like:

### Lighter weight

There's no need to load an expression parser and evaluator.

### Seamless access to data

Since template literals are evaluated in JavaScript, their expressions have access to every variable in that scope, including globals, module and block scopes, and `this` inside methods.

If the main use of templates is to inject values into HTML, this breaks down a major barrier between templates and values.

### Faster expression evaluation

They're just JavaScript expressions.

### IDE support by default

In a type-checking environment like TypeScript, expressions are checked because they are just regular script. Hover-over docs and code-completion just work as well.

## Benefits over JSX

### Native syntax

No tooling required. Understood by all JS editors and tools.

### CSS-compatible syntax

Because template literals use `${}` as the expression delimiter, CSS's use of `{}` isn't interpreted as an expression. You can include style tags in your templates as you would expect:

```javascript
R`
  <style>
    :host {
      background: burlywood;
    }
  </style>
`
```
