import {R,X,inputClassName} from '../externals.js';

export default textInput;

function textInput({
    name,
    id: id = '',
    style: style = '',
    placeholder: placeholder = '', 
    required: required = false,
    handlers: handlers = {},
    inline: inline = false,
    value: value = '', 
    label: label = '', 
    multiline: multiline = false,
    size: size = 16,
    classNames: classNames = [],
    spaced: spaced = false,
    type: type = 'text',
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};
  if ( ! classNames.includes(inputClassName) ) classNames.push(inputClassName);

  let input;

  if( type === 'textarea' ) {
    input = X`
      <textarea
        id=${id}
        ${required?'required':''}
        handlers=${handlers}
        style="${style}"
        value="${value}"
        name=${name}
        placeholder="${placeholder}"
      >${value}</textarea>
    `;
  } else {
    input = X`
      <input
        ${id?`id=${id}`:''}
        ${required?'required':''}
        handlers=${handlers}
        mousedown=${[e => console.log(e), ({clientX,clientY}) => console.log({clientX,clientY})]}
        mouseup=${R.guardEmptyHandlers([])}
        name=${name}
        type=${type}
        size=${size} 
        style="${style}"
        placeholder="${placeholder}"
        value="${value}"
      >
    `;
  }

  return X`
    <div class="input ${type=='textarea' || multiline?'multiline':''} ${
        inline?'inline':''} ${spaced?'spaced':''} ${
        classNames.join(' ')}">
      <label>
        <span class="label-text">${label}</span>
        ${input}
      </label>
      ${rightElement ? rightElement : ''}
    </div>
  `;
}
