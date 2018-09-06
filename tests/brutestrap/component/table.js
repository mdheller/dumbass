import {R,X} from '../externals.js';

export default table;

function table({
    name,
    rowHeader,
    columnHeader,
    cell,
    placeholder: placeholder = '', 
    handlers: handlers = {},
    inline: inline = false,
    value: value = '', 
    label: label = '', 
    spaced: spaced = false,
    type: type = 'text',
    inputSize: inputSize = 5,
    rightElement: rightElement = undefined,
  } = {}) {

  if ( ! name ) throw {error: `All inputs must specify name`};

  if ( ! (rowHeader && columnHeader && cell) ) throw {
    error: `All table inputs must specify columnHeader, rowHeader and cell properties of type Function`
  };
 
  const tableCode = 'table-'+Math.random();
  const firstCellId = 'first-cell-'+tableCode;
  
  return X`
    <div class="input flex-col multiline ${inline?'inline':''} ${spaced?'spaced':''}">
      <label for=${firstCellId}>
        <span class="label-text">${label}</span>
      </label>
      <table>
        ${TableHeader({columnHeader,tableCode})}
        <tbody>
          ${Rows({rowHeader,columnHeader, tableCode, cellTd, firstCellId})}
        </tbody>
      </table>
      ${rightElement ? rightElement : ''}
    </div>
  `;
    
  function cellTd ({i,j, id:id = ''}) {
    const style = type == 'number' ? `
      width: ${inputSize}em;
    `:''

    return X`
      <td>
        <input
          id=${id}
          type=${type}
          handlers=${handlers}
          placeholder=${placeholder}
          size=${inputSize}
          style="${style}"
          value=${cell(i,j)}
        >
      </td>
    `;
  }
}

function TableHeader({columnHeader,tableCode}) {
  const values = getValues(columnHeader);
      
  return  X`
    <thead>
      <tr>
        <th><!-- top left corner placeholder cell--></th>
        ${values.map((ch,i) => X`<th><a href=#col-${i}-${tableCode}>${ch}</a></th>`)}
      </tr>
    </thead>
  `;
}

function Rows({rowHeader,columnHeader, tableCode,cellTd, firstCellId}) {
  const values = getValues(rowHeader);
  const cvalues = getValues(columnHeader);
  return values.map((rh,i) => row({rh,i,cvalues,tableCode,cellTd,firstCellId}));
}

function row({rh,i, cvalues, cellTd, firstCellId, tableCode}) {
  return X`
    <tr>
      <td><a href=#row-${i}-${tableCode}>${rh}</a></td>
      ${cvalues.map((_,j) => cellTd({i,j,  id: i == 0 && j == 0 ? firstCellId : ''}))}
    </tr>
  `;
}

function getValues(indexFunc) {
  const values = [];
  let valIndex = 0, value;
  while(value=indexFunc(valIndex)) {
    values.push(value);
    valIndex++;
  }
  return values;
}
