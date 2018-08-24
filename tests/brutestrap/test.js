import component from './index.js';
import {R,X} from '../../r.js';

const spot = ['#tests', 'beforeEnd'];

onload = testAll;

function testAll() {
  testSpinner();
  testButton();
  testTextInput();
  testTagInput();
  testFileInput();
  testSelect();
}

function testSelect() {
  const s = component.select;

  s({
    name: 'select',
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

function testTextInput() {
  const ti = component.textInput;

  ti({
    round: false,
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
