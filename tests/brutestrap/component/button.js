import {R,X} from '../externals.js';
import spinner from './spinner.js';

export default button;

function addActiveClass(clickEvent) {
  const {currentTarget} = clickEvent;

  currentTarget.classList.add('active');
}

function button({
    name,
    value: value = 'submit', 
    type: type = 'submit',
    text: text = '',
    spinnerOnActive: spinnerOnActive = false
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  let input;

  return X`
    <button 
      click=${addActiveClass}
      type=${type}
      name=${name}
      value="${value}"
    >
      ${text}
      ${spinnerOnActive ? spinner() : ''}
    </button>
  `;
}
