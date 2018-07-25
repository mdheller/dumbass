# New branch changes coming

Breaking changes. Slated for next minor release. 

## Proposed API

Call a render function 1 time, you can put the nodes into the DOM. Call it a second time? Those nodes get updated if any state changes.

Singleton templates don't have a key property.

Instance templates are identified by including `{key:<id>}` object in their template, as *any* value. 

So, some code to demonstrate:

```JavaScript

const Singleton = S => R`<header><h1>${S.title}</h1><h2>${S.byline}</h2></header>`;
const Instance = S => R`<p>${S.p[0]}</p><p><img src=${S.imgsrc}>${S.p[1]}</p><p><blockquote>${S.bq}</blockquote>${S.p[2]}</p>${{key:S.id}}`;
```

And

```JavaScript
const Instance2 = S => `${{key:S.id}}<p>${S.p[0]}</p><p><img src=${S.imgsrc}>${S.p[1]}</p><p><blockquote>${S.bq}</blockquote>${S.p[2]}</p>`;
```

Are equivalent, even tho the key object is in different positions, it is treated as a *meta value* and not an actual template value. 

Now, for instance:

```JavaScript
const A1 = Instance(A1State);
const A2 = Instance2(A2State);

A1.to('main#app p', {replace:true});
A2.to('main#app p', {afterEnd:true}); // beforeBegin, afterBegin, beforeEnd, afterEnd, replace are all valid and exclusive.

// Now, watch this.

A2State.p[1] = newA2p1;
A2State.imgsrc = newImgSrc;

A2(A2State);

// boom, A2 updates.
// and crucially, it is just as efficient as React diffing
// and we do not update the whole subtree, only those attributes, text values, elements that have changed.
// we apply the absolute minimal change set.
// and to calculate these "diffs" there is actually no complex algorithm overhead.
// so it is very, very fast. As fast as manually finding the elements by selectors and setting their properties
// but it is all handled *automagically*.

```

You can watch the progress of these changes in the [diff branch](https://github.com/dosyago-coder-0/brutal.js/tree/diff)

To summarise, `render` is going, and `R` is becoming more powerful.

**Final note of importance**

```JavaScript

A2(A2State);

// which updates the nodes
// is actually equivalent to, calling
//

Instance2(A2State);
// a second time. 
```

In both cases the information about where the nodes associated with that template and that instance are, and how to update them, should a value in their state change, is cached behind the scenes. And the appropriate update functions are called when that template, with that instance's key are called again. 

