import {R,X} from '../../../r.js';

export default select;

function select({
    name,
    options: options = [],
    inline: inline = false,
    value: value = '', 
    label: label = '', 
    round: round = true,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  let input;

  input = X`
    <select name=${name} value="${value}">
      ${options.map(({value,name}) => X`<option value="${value}">${name}</option>`)}
    </select>
  `;

  return X`
    <label>
      <span class=label-text>${label}</span>
      <span class="input ${inline ? 'inline': ''} ${round ? 'round': ''}">
        ${input}
      </span>
    </label>
  `;
}
