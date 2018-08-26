import {R,X} from '../../../r.js';

export default textInput;

function textInput({
    name,
    options: options = [],
    placeholder: placeholder = '', 
    handlers: handlers = {},
    inline: inline = false,
    value: value = '', 
    label: label = '', 
    type: type = 'text',
    round: round = true,
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  let input;

  if( type === 'textarea' ) {
    input = X`<textarea handlers=${handlers} value="${value}" name=${name} placeholder="${placeholder}"></textarea>`;
  } else if ( type === 'select' ) {
    input = X`
      <select handlers=${handlers} name=${name} value="${value}">
        ${options.map(o => X`<option value="${o}">${o}</option>`)}
      </select>`;
  } else {
    input = X`<input handlers=${handlers} name=${name} type=${type} placeholder="${placeholder}" value="${value}">`;
  }

  return X`
    <label class="${type=='textarea'?'multiline':''}">
      <span class=label-text>${label}</span>
      <span class="input ${type=='textarea'?'multiline':''} ${inline ? 'inline': ''} ${round ? 'round': ''}">
        ${input}
        <span class=right>
          ${rightElement ? rightElement : ''}
        </span>
      </span>
    </label>
  `;
}
