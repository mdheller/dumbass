"use strict";
{
  const OBJ = "Object properties don't work here.",
    MARKER = hid => {detail: `Insertion point market not found for ${hid}`, hid},
    HID = hid => {detail: `Node or handlers not found for recorded hid ${hid}`, hid},
    LAST_ATTR_NAME = /\s+([\w-]+)\s*=\s*"?\s*$/,
    NEW_TAG = /<\w+/g,
    VOID_ELEMENTS = new Set(["area","base","br","col","command","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"]);

  Object.assign(self,{R,render});

  function R (parts, ...vals) {
    const handlers = {};
    let hid, lastNewTagIndex, lastTagName, str = '';

    parts = [...parts];
    vals = vals.map(parseValue);

    while (parts.length > 1) {
      let part = parts.shift(),
        attrNameMatches = part.match(LAST_ATTR_NAME),
        newTagMatches = part.match(NEW_TAG)
      let val = vals.shift();
      if (newTagMatches) {
        if ( handlers[hid] ) str = markInsertionPoint({str,lastNewTagIndex,lastTagName,hid});
        hid = `hid_${Math.random()}`.replace('.','');
        const lastTag = newTagMatches[newTagMatches.length-1];
        lastNewTagIndex = part.indexOf(lastTag) + str.length;
        lastTagName = lastTag.slice(1);
      }
      if (typeof val === 'function') {
        const attrName = attrNameMatches && attrNameMatches.length > 1
            ? attrNameMatches[1].replace(/^on/,'').toLowerCase()
            : false,
          newPart = part.replace(attrNameMatches[0], '');
        str += attrName ? newPart : part;
        if ( !Array.isArray(handlers[hid]) ) handlers[hid] = [];
        handlers[hid].push({eventName: attrName, handler: val});
      } else if (!!val && !!val.handlers && !!val.str) {
        Object.assign(handlers,val.handlers);
        str += part;
        val = val.str;
        if (attrNameMatches) val = `"${val}"`;
        str += val;
      } else {
        str += part;
        str += attrNameMatches ? `"${val}"` : val;
      }
    }
    if ( handlers[hid] ) str = markInsertionPoint({str,lastNewTagIndex,lastTagName,hid});
    str += parts.shift();
    return {str,handlers};
  }

  function render (r, root, {replace: replace = false} = {}) {
    r = parseR(r);
    const {str,handlers} = r;

    if (replace) {
      root.insertAdjacentHTML('beforeBegin', str);
      root.remove();
    } else {
      root.innerHTML = '';
      root.insertAdjacentHTML('afterBegin', str);
    }

    Object.entries(handlers).forEach(
      ([hid,nodeHandlers]) => addHandlersToMarkedInsertionPoint({hid,nodeHandlers}));
  }

  function join (rs) {
    const H = {},
      str = rs.map(({str,handlers}) => (Object.assign(H,handlers),str)).join('\n');

    if (str) {
      return {str,handlers:H};
    }
  }

  function parseValue(v) {
    if (Array.isArray(v) && v.every(item => !!item.handlers && !!item.str)) {
      return join(v) || '';
    } else if (typeof v === 'object' && !!v) {
      if (!!v.str && !!v.handlers) {
        return v;
      }
      throw {error: OBJ, value: v};
    } else return v === null || v === undefined ? '' : v;
  }

  function parseR(r) {
    if (Array.isArray(r) && r.every(val => !!val.str && !!val.handlers)) r = join(r);
    return r;
  }

  function markInsertionPoint({str,lastNewTagIndex,lastTagName,hid}) {
    const before = str.slice(0,lastNewTagIndex);
    const after = str.slice(lastNewTagIndex);
    return before + 
      `<${lastTagName} id=${hid}>` + 
      (isVoid(lastTagName) ? '' : `</${lastTagName}>`) + 
      after;
  }

  function addHandlersToMarkedInsertionPoint({hid,nodeHandlers}) {
    const hidNode = document.getElementById(hid);
    let node;

    if (!!hidNode) {
      node = hidNode.nextElementSibling;
      hidNode.remove();
    } else throw {error: MARKER(hid)}

    if (!!node && !!nodeHandlers) {
      nodeHandlers.forEach(({eventName,handler}) => node.addEventListener(eventName,handler));
    } else throw {error: HID(hid)} 
  }

  function isVoid(tag) {
    return VOID_ELEMENTS.has(tag.toLowerCase().trim());
  }
}

