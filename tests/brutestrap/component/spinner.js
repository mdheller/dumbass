import {R,X} from '../externals.js';

export default spinner;

function spinner() {
  return X`
    <div class=spinner>
      <div class=mover></div>
    </div>
  `;
}
