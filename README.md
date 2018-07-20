# brutal.js

A crazy-small framework for building brutal/brutalist web applications

Pure components / state-less components only. :heart_eyes: :gem: :ocean:

Release: 1.2.1 *Speed improvements edition + bug fixes*

## small

153 SLOC ([*or a faster 106 SLOC version without XSS blocking*](https://github.com/dosyago-coder-0/brutal.js/blob/master/no_xss_protection_r.js)). 2 functions: `R` and `render`

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

### differences to notice

- Event listeners are named by event names directly. No `on-` prefix. So use `click` not `onclick`
- There is never any need to quote an attribute, brutal does it for you, so 
  `title=${title}` never `title="${title}"`
- every bit of HTML is tagged with an R and written with backticks. Technically, this is an ES6 template literal and template tag function.
- Every replaced value is enclosed in `${...}` instead of `{...}`

## why brutalist?

To me, brutalist means as close to the basic raw HTML/ JavaScript as possible. 
There's more to do on the roadmap, but for many projects, these simple functions are enough. 
For example, take a look at [a working TodoMVC example](https://dosyago-coder-0.github.io/rvanillatodo/) made with brutal.js.
Everything in brutal is "as close to the metal" ( the JS / HTML ) as possible. This is ensured by there being minimal JS code,
minimal opinionation (everything is just HTML elements and event handlers), leaving you free to structure things however you like. 

## get it

```shell
npm i --save brutalist-web
```

## use it

```HTML
<script src=node_modules/brutalist-web/r.js></script>
```

## roadmap

There isn't one!

Brutal is already perfect!

## perfection

Perfection, in this field, I think &mdash; is complete with regard to its specified purpose.

No design is perfect, there's always tradeoffs. But with regard to implementing it's purpose, it is perfect.
But with regard to *how* it implements it, it's not perfect, and no design is. There's always trade-offs,
and from one perspective, things can be improved, which from another perspective, makes things worse. 

But functionally, brutal.js is perfect. It just does the minimum of what you want it to do. How it does that, can be improved, no doubt! 

If you have an idea, [create a PR!](https://github.com/dosyago-coder-0/brutal.js/pulls)

So it is perfect, except for some bugs. If you find those, [open an issue!](https://github.com/dosyago-coder-0/brutal.js/issues)

## conclusion

If you know HTML and JS, you know brutal.js. Give it a spin, open an issue, make a PR, and let me know how you're using it, and where you think it should go.

## projects using brutal.js

- [TodoMVC in brutal.js](https://github.com/dosyago-coder-0/rvanillatodo)

### show hn

- July 8 2018 [Show HN: Brutal.js – a small framework for building brutalist web applications](https://news.ycombinator.com/item?id=17484253)

--------

## more information 

### case-study: just how small is it? 

The above function as an arrow in React/JSX:

```JSX
const ButtonWidget = ({name}) => (<button onClick={() => showModal(name)}>Show {name} Modal</button>);
```

That same arrow in R/brutal.js:

```JavaScript
const ButtonWidget = ({name}) => R`<button click=${() => showModal(name)}>Show ${name} Modal</button>`;
```

**brutal.js costs you 1 more character, and saves you around 90Kb of framework to get to that point.**

### so, wait, actually how small?

Just ~4Kb unzipped uminified. Compared to [~10x to 30x that](https://gist.github.com/Restuta/cda69e50a853aa64912d) gzipped minified for big frameworks. 

*Note: you can get a [101 SLOC](https://github.com/dosyago-coder-0/brutal.js/blob/master/no_xss_protection_r.js) ~3Kb version without any XSS protection.*


### case-study: differences with lit-html

Brutal is somewhat similar to [lit-html](https://github.com/Polymer/lit-html). 

It's also much smaller (4Kb compared to ~25kb unzipped unminified) and simpler.

And much more limited. 

Brutal just supports adding event listeners to HTML, and templating values.

It does not support Promises, case-sensitive attribute names, or other "framework"-like complexities. 
If you want fetched data in your HTML output, fetch it before your HTML render, then render.

----

## philosophy

### A tool. Not a set of rules.

Some "Frameworks" want to restrict what you can do and "allow" and "disallow" you to do certain things, based on the "opinions" of their creators. Who cares what they think? Do what you want! Decide for yourself! Be a real human with a mind of their own and write your own code. 

Maybe frameworks are just psychological emanations of the desire/need to control and be controlled? But that's not all humans can be/ not all how groups can interact. It's time for some "frameworks" that stop telling you what you can and can't do, and help you do what you want to do.

&lt;/manifesto&gt;

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

# Overview

*Note the following section was adapted from / inspired by the README.md of [lit-html](https://github.com/Polymer/lit-html) an unrelated but syntax-similar framework. Lit-html does not support adding event listeners, and Brutal **does** support adding event listeners.*

## Event-listeners

Any valid DOM/HTML event can be added. Here's a simple, **literate** and working example to create an editable div in Brutal.js: 

```JavaScript

const EditableDiv = content =>
  R`<div class=edit 
       dblclick=${ editContent } 
       blur=${ endEdit }>${content}</div>`;


load = () => render(EditableDiv('hello world'), document.body);


function editContent({ dblClick: { srcElement: el }}) {
  if (el.matches('.edit')) {
    el.setAttribute('contenteditable','');
  } else {
    el.closest('.edit').setAttribute('contenteditable','');
  }
}

function endEdit({ blur: { srcElement: el }}) {
  el.removeAttribute('contenteditable');
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
const Items = () => R`<ul>${items.map(i => R`<li>${i}</li>`)}</ul>`;
```
*Remember: **always** use `R`*

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

### Light weight

There's no need to load an expression parser and evaluator.

### Access to data

Since template literals are evaluated in JavaScript, their expressions have access to every variable in that scope, including globals, module and block scopes, and `this` inside methods.

If the main use of templates is to inject values into HTML, this breaks down a major barrier between templates and values.

### Fast expression eval

They're just JavaScript expressions.

### IDE support by default

In a type-checking environment like TypeScript, expressions are checked because they are just regular script. Hover-over docs and code-completion just work as well.

## Advantages over React

### Not bloatware

Only ~1.5Kb minified gzipped compared to ~100kb for other frameworks. 
If you have 1 million requests per day this will save you 3 terabytes of data a month.

## Benefits over JSX

### Native syntax

No tooling required. Understood by all JS editors and tools.

### CSS-compatible syntax

Because template literals use `${}` as the expression delimiter, CSS's use of `{}` isn't interpreted as an expression. You can include style tags in your templates as you would expect:

```javascript
R`<style>
    :host {
      background: burlywood;
    }
  </style>
`;
```
-----

## news ~ performance enhancements & pure only

In [this commit](https://github.com/dosyago-coder-0/brutal.js/commit/027436398e74518d51d67eefdb96271513a1cc6c) I've made some tweaks that gave a 2x speedup in rendering performance in tests with 10s of thousands of nodes. Some basics were replacing inefficient to array methods (.split, Array.from) with more performant variants ([...i]), and replacing unnecessary .reduces with .maps or loops.

Also, I've decided against the introduction of pinned/stateful components (explored in [#7](https://github.com/dosyago-coder-0/brutal.js/pull/7) because I see that pure components are sufficient. 

Also this is 1.2 minor release.

### work to do 

#### Hashing and Security. 

- Consider if there is a faster and still secure way to do the hashing / verification. Currently we call that multiple times, over the same string sequences, as they are embedded/included in templates higher up in the render/component hierarchy. Basically verify/hash/sign is called for every template, this means that the leaf node values have been hashed/verified multiple times. I'm not sure right now of a way to reduce this work and still keep it secure, but maybe there is. It is worth thinking about as after the performance enhancements hashing/symbytes is now the main performance blocker. 

- Performance and security. The `no_xss_proection_r.js` version is a lot faster than the regular `r.js` version where we sign and verify everything.

  I think there are 2 ways to speed up the regular version:

  - Have a think about how to call sign/verify as few times as possible. Right now, I am sure work is being redone, and I think that is unnecessary.
  - Replace signing and verifying with another faster XSS mitigation strategy. 

  In addition I think I need to really analyse if signing and verifying works as intended. Is it really the right solution? I am unahppy with the performance overhead it adds to the no_xss_protection version when doing tens of thousands of nodes. Perhaps this is an unrealistic benchmark, but I think a valid performance issue is highlighted. 

## news ~ removing ESlint

[ESlint compromised](https://github.com/eslint/eslint-scope/issues/39) in an attempt to steal credentials.

This is terrible. And it is the ESlint that comes with Babel. Another **great** reason to not use 
enormous/bloated toolchains/transpilation and things like JSX/Babel/React. Just use small code you can read.

Brutal.js! FTW :smile:
