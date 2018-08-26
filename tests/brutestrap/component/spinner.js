import {R,X} from '../../../r.js';

export default spinner;

function spinner() {
  return X`
    <div class=spinner>
      <div class=mover></div>
    </div>
  `;
}
