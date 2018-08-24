import {R,X} from '../../../r.js';
//import {R,X} from 'https://unpkg.com/brutalist-web/r.js';

export default textInput;

function textInput({
    name,
    options: options = [],
    placeholder: placeholder = '', 
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
    input = X`<textarea value="${value}" name=${name} placeholder="${placeholder}"></textarea>`;
  } else if ( type === 'select' ) {
    input = X`
      <select name=${name} value="${value}">
        ${options.map(o => X`<option value="${o}">${o}</option>`)}
      </select>`;
  } else {
    input = X`<input name=${name} type=${type} placeholder="${placeholder}" value="${value}">`;
  }

  return X`
    <label>
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
