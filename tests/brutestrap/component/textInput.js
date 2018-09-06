import {R,X} from '../externals.js';

export default textInput;

function textInput({
    name,
    placeholder: placeholder = '', 
    handlers: handlers = {},
    inline: inline = false,
    value: value = '', 
    label: label = '', 
    size: size = 16,
    spaced: spaced = false,
    type: type = 'text',
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  let input;

  if( type === 'textarea' ) {
    input = X`
      <textarea
        handlers=${handlers}
        value="${value}"
        name=${name}
        placeholder="${placeholder}"
      >${value}</textarea>
    `;
  } else {
    input = X`
      <input
        handlers=${handlers}
        name=${name}
        type=${type}
        size=${size} 
        style="${type == 'number' ? `
          width: ${size}em;
        `: ''}"
        placeholder="${placeholder}"
        value="${value}"
      >
    `;
  }

  return X`
    <div class="input ${type=='textarea'?'multiline':''} ${inline?'inline':''} ${spaced?'spaced':''}">
      <label>
        <span class="label-text">${label}</span>
        ${input}
      </label>
      ${rightElement ? rightElement : ''}
    </div>
  `;
}
