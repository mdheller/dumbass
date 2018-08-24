import {R,X} from '../../../r.js';
//import {R,X} from 'https://unpkg.com/brutalist-web/r.js';

export default spinner;

function spinner() {
  return X`
    <div class=spinner>
      <div class=mover></div>
    </div>
  `;
}
