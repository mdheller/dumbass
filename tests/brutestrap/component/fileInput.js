import {R,X} from '../../../r.js';

export default fileInput;

function fileInput({
    name,
    text: text = '',
    multiple: multiple = false,
    accept: accept = "*/*",
    round: round = true,
    placeholder: placeholder = '', 
    inline: inline = false,
    label: label = '', 
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  return X`
    <label>
      <span class=label-text>${label}</span>
      <span class="input ${inline ? 'inline': ''} ${round ? 'round': ''}">
        <input type=file title="${text}" multiple=${multiple} accept=${accept}>
      </span>
    </label>
  `;
}
