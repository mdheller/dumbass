# brutestrap (v1.0.3)

A port of Blueprint/React-Bootstrap UI kit components to Brutal.js and CSS Grid, energized by the pursuit of minimalist code and minimalist design in all things.

```JavaScript
[...new Set([...Blueprint, ...Bootstrap])].map(convertTo(Brutal.js, CSSGrid)).filter(minimalistCode)
```

## Roadmap / TODO list

*Note: the choice of whether the component is from Blueprint or Bootstrap depends on which I think looks more like what I want.*

### Simple input components
- ~Blueprint text inputs~
- ~Blueprint tag inputs~
- ~Blueprint file inputs~
- ~Spinner~
- ~Button with spinner~

### Data Presentation Components
- Table (defined by three functions, column_header(i), row_header(j), cell_data(i,j))
- Datalist (defined by 1 function data(i)) and can include options like "autocomplete" which is a fuzzy search

### Layout Components
- Modal (of various kinds)
- Drawer
- Toast
- Dialog
- Menu

### Advanced Input components
- Live updating fuzzy search input (e.g: "type your city...", "skill...", "topic...")
- Group of inputs (group of observations of a particular input, either listed, or mapped) "higher order component" that takes any imput component, and either "list" or "map" type (map types will just support string keys for now)

### Improvements
- Form layout
- Form states: invalid, required (but no custom validation messages probably just use built in to save work on i18n))

## Design required

- Think about how to do i18n: What sort of parameters ( a map of messages ? ) How to tell a component what language to render in? 
- I think like "message files" should be factorable and importable by components in order to render whatever messages they want.
- Brutestrap should provide some built in message files in English that can be expanded into other high value languages (the BRICS countries + German, French, Japanese and Korean, plus one high value African language + one high value Eastern Europe language).
- Initially translations will be done by hand using Google translate / its API, using a script. Later can be "improved" by contractors / contributors. 


