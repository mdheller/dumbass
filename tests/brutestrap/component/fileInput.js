import {R,X} from '../externals.js';

export default fileInput;

function fileInput({
    name,
    text: text = '',
    multiple: multiple = false,
    accept: accept = "*/*",
    inline: inline = false,
    label: label = '', 
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  return X`
    <div class="input ${inline ?'inline':''}">
      <label>
        <span class=label-text>${label}</span>
        <input
          type=file
          title="${text}"
          multiple=${multiple}
          accept=${accept}
        >
      </label>
      ${rightElement ? rightElement: ''}
    </div>
  `;
}
