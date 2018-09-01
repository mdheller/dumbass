import component from './index.js';
import {R,X} from '../../r.js'

const spot = ['#tests', 'beforeEnd'];

onload = testAll;

function testAll() {
  testTextInput();
  testTagInput();
  testFileInput();
  testSelect();
  testSelect({multiple:true});
  testDateInput();
  testTextareaInput();
  testDatalist();
}

function testSelect({multiple:multiple=false}={}) {
  const s = component.select;

  s({
    name: 'select',
    multiple,
    label: 'Option',
    value: 'option-1',
    options: [
      {
        name: 'Option 1',
        value: 'option-1',
      },
      {
        name: 'Option 2',
        value: 'option-2'
      },
      {
        name: 'Option 3',
        value: 'option-3'
      }
    ]
  }).to(...spot);
}

function testButton() {
  const b = component.button;

  b({
    spinnerOnActive: true, 
    name: 'btn',
    value: 'ButtonValue',
    text: 'Button Text',
    type: 'submit',
    intent: undefined
  }).to(...spot);
}

function testSpinner() {
  const s = component.spinner;

  s().to(...spot);
}

function testDateInput() {
  const ti = component.textInput;

  ti({
    round: false,
    spaced: true,
    name: 'month',
    label: R.skip('Month (spaced)'),
    type: 'month',
    rightElement: component.button({name:'btn', text:'Go',spinnerOnActive:true})
  }).to(...spot);

  ti({
    round: false,
    name: 'date',
    label: R.skip('Date'),
    type: 'date',
    rightElement: component.button({name:'btn', text:'Go',spinnerOnActive:true})
  }).to(...spot);

  ti({
    round: false,
    name: 'datetime-local',
    label: R.skip('Date & Time'),
    type: 'datetime-local',
    rightElement: component.button({name:'btn', text:'Go',spinnerOnActive:true})
  }).to(...spot);
}

function testTextInput() {
  const ti = component.textInput;

  ti({
    round: false,
    handlers: {
      mouseover: e => console.log(e),
      click: e => console.log(e.target.localName + ' clicked')
    },
    name: 'text',
    placeholder: 'Your textual input',
    label: 'Text',
    type: 'text',
    rightElement: component.button({name:'btn', text:'Search',spinnerOnActive:true})
  }).to(...spot);
}

function testTagInput() {
  const ti = component.tagInput;

  ti({
    round: false,
    name: 'tags',
    label: 'Tags',
    values: [],
    placeholder: 'Starting tagging.',
    separator: /[,\n\r]/,
  }).to(...spot);
}

function testFileInput() {
  const fi = component.fileInput;

  fi({
    round: false,
    name: 'files',
    label: 'Files',
    multiple: false,
    text: 'Choose an image to upload',
    accept: 'image/*',
  }).to(...spot);
}

function testTextareaInput() {
  const ti = component.textInput;

  ti({
    round: false,
    name: 'textarea',
    placeholder: 'Your multiline textual input',
    label: 'Textarea',
    type: 'textarea',
    rightElement: component.button({name:'btn', text:'Search',spinnerOnActive:true})
  }).to(...spot);
}

function testDatalist() {
  const dl = component.datalist;

  const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const listFunction = i => i < Alphabet.length ? 'Agent ' + Alphabet[i] + '.' : null;

  dl({
    round: false,
    name: 'datalist',
    placeholder: "Relax its cool to have a codename",
    label: 'Pick your agent name (datalist)',
    type: 'text',
    list: listFunction,
    rightElement: component.button({name:'save-btn', text:'Save',spinnerOnActive:true})
  }).to(...spot);
}
