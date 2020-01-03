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

### Real world example

This is [the core interactive image canvas from this project](https://github.com/dosyago/supreme-architect). 

```javascript
R`
  <canvas
    click=${e => {
      if ( viewState.shouldHaveFocus && document.activeElement != viewState.shouldHaveFocus ) {
        viewState.shouldHaveFocus.focus(); 
      }
    }}
    bond=${[saveCanvas, asyncSizeBrowserToBounds, emulateNavigator, ...canvasBondTasks]}
    touchstart=${retargetTouchScroll}
    touchmove=${[
      e => e.preventDefault(), 
      throttle(retargetTouchScroll, state.EVENT_THROTTLE_MS)
    ]}
    wheel:passive=${throttle(H, state.EVENT_THROTTLE_MS)}
    mousemove=${throttle(H, state.EVENT_THROTTLE_MS)}         
    mousedown=${H}         
    mouseup=${H}         
    pointermove=${throttle(H, state.EVENT_THROTTLE_MS)}         
    pointerdown=${H}         
    pointerup=${H}         
    contextmenu=${subviews.makeContextMenuHandler(state)}
  ></canvas>
`
 ```

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

It's pretty much mature. Could add a state managment abstractionm like single source of truth store, actions that drive a state machine. But who cares about that? Plenty of that around if that's what you need. This is just teh pure viewwww.
