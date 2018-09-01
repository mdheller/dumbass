import {R,X} from '../../../r.js';

export default tagInput;

function startNewTagIfEmpty(inputEvent) {
  const {target:contentEditable} = inputEvent;

  if ( contentEditable.children.length === 0 ) {
    X`<span class=tag></span>`.to(contentEditable,'innerHTML');

    const newTagRange = document.createRange();

    newTagRange.setStart(contentEditable.children[0], 0);
    newTagRange.collapse(true);

    const caret = getSelection();
    caret.removeAllRanges();
    caret.addRange(newTagRange);
  }
}

function focusEditable(clickEvent) {
  const {target,currentTarget} = clickEvent;
  if ( ! target.matches('[contenteditable]') ) {
    currentTarget.querySelector('[contenteditable]').focus(); 
  }
}

function tagInput({
    name,
    inline: inline = false,
    label: label = '',
    placeholder: placeholder = '',
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  return X`
    <div class="multiline input ${inline ? 'inline': ''}" click=${focusEditable}>
      <label>
        <span class=label-text>
          ${label}
        </span>
        <div input=${startNewTagIfEmpty} class=tag-editor contenteditable name=${name}>
          <span class=tag>${placeholder}</span>
        </div>
      </label>
      ${rightElement ? rightElement : ''}
    </div>
  `;
}
