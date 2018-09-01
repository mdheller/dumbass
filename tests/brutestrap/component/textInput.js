import {R,X} from '../../../r.js';

export default textInput;

function textInput({
    name,
    placeholder: placeholder = '', 
    handlers: handlers = {},
    inline: inline = false,
    value: value = '', 
    label: label = '', 
    spaced: spaced = false,
    type: type = 'text',
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  let input;

  if( type === 'textarea' ) {
    input = X`<textarea handlers=${handlers} value="${value}" name=${name} placeholder="${placeholder}">${value}</textarea>`;
  } else {
    input = X`<input handlers=${handlers} name=${name} type=${type} placeholder="${placeholder}" value="${value}">`;
  }

  return X`
    <div class="input ${type==='textarea'?'multiline':''} ${inline?'inline':''} ${spaced?'spaced':''}">
      <label>
        <span class="label-text">${label}</span>
        ${input}
      </label>
      ${rightElement ? rightElement : ''}
    </div>
  `;
}
