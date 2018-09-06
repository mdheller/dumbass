import {R,X} from '../externals.js';

export default select;

function select({
    name,
    options: options = [],
    inline: inline = false,
    value: value = '', 
    label: label = '', 
    multiple: multiple = false,
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  let input;

  input = X`
    <select
      name=${name}
      value="${value}" 
      ${multiple?'multiple':''}
    >
    ${options.map(({value,name}) => X`
      <option value="${value}">${name}</option>
    `)}
    </select>
  `;

  return X`
    <div class="input ${inline ? 'inline': ''} ${multiple? 'multiline': ''}">
      <label>
        <span class=label-text>${label}</span>
        ${input}
      </label>
      ${rightElement? rightElement: ''}
    </div>
  `;
}
