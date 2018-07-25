"use strict";

const bondCache = {};
let templateCount = 0;

const diff = {
  makeBond, df
};

export default diff;
  function makeBond(parts,vals,instanceKey='singleton') {
    let firstCall;
    const bondKey = parts.join('<link rel=join>');
    let bond = bondCache[bondKey];
    if ( ! bond ) {
      firstCall = true;
      const templateId = templateCount;
      const instanceCount = 1;
      const instances = {
        [instanceKey]: {parts:[...parts],vals:[...vals],funcs:[],instanceKey}
      };
      bond = bondCache[bondKey] = {templateId,instances,instanceCount};
      initializeBond(bond,instanceKey);
      templateCount += 1;
    } else {
      const instances = bond.instances;
      let keyedInstance = instances[instanceKey];
      if ( ! keyedInstance ) {
        firstCall = true;
        bond.instanceCount += 1;
        instances[instanceKey] = {parts:[...parts],vals:[...vals],funcs:[],instanceKey};
      } else {
        firstCall = false;
      }
    }
    return {bond,firstCall};
  }

  function createValReplacements(bond,key) {
    const instance = bond.instances[key];
    let {parts,vals} = instance;
    const tempKey = Math.random()+'';
    const replacer = instance.replacer = id => `rep-${tempKey}-${id}`;
    const valMap = instance.valMap = {};
    vals = vals.map((val,index) => {
      const valReplacer = replacer(index);
      valMap[valReplacer] = {index,val};
      return valReplacer;
    });
    return vals;
  }

  function initializeBond(bond,key) {
    const instance = bond.instances[key];
    const tempVals = createValReplacements(bond,key);
    const {parts} = instance;
    let str = parts.shift();
    while( tempVals.length ) {
      str += tempVals.shift(); 
      str += parts.shift();
    }
    const frag = df(str);
    frag.normalize();
    const walker = document.createTreeWalker(frag,NodeFilter.SHOW_ALL);
    const allNodes = [];
    while(walker.nextNode()) allNodes.push(walker.currentNode);
    allNodes.forEach(node => generateBondFunctions(node,instance));
    const nodes = [...frag.childNodes];
    instance.nodes = nodes;
  }

  function generateBondFunctions(node,instance) {
    switch(node.nodeType) {
      case Node.ELEMENT_NODE:
        generateElementBondFunctions({el:node,instance});
        break;
      case Node.TEXT_NODE:
        generateTextBondFunctions({text:node,instance});
        break;
    }
  }

  function generateElementBondFunctions({el,instance}) {
    const search = instance.replacer('');
    const instanceSlot = new RegExp(search+'(\\d+)','gm');
    const attrs = [...el.attributes];
    attrs.forEach(({name,value:str}) => {
      let result;
      while(result = instanceSlot.exec(str)) {
        const [valKey,valIndex] = result;
        const {index} = result;
        const getValue = () => instance.vals[valIndex];
        const setValue = (newValue) => {
          let value = instance.vals[valIndex];
          const oldStr = el.getAttribute(name);
          const newStr = oldStr.slice(0,index) + newValue + oldStr.slice(index+value.length); 
          value = newValue;
          el.setAttribute(name,newStr);
        };
        let replacers = instance.funcs[valIndex];
        if ( replacers == undefined ) {
          replacers = instance.funcs[valIndex] = [];
        }
        replacers.push({getValue,setValue});
      }
    });
  }

  /**
    Issues: what if replacer has value of R object? 
    Setting a text node to that won't work.
  **/

  function generateTextBondFunctions({text,instance}) {
    const search = instance.replacer('');
    const instanceSlot = new RegExp(search+'(\\d+)','gm');
    const str = text.wholeText;
    let result;
    while(result = instanceSlot.exec(str)) {
      const [valKey,valIndex] = result;
      const {index} = result;
      let value = instance.vals[valIndex];
      const getValue = () => value;
      const setValue = (newValue) => {
        value = newValue;
        text.nodeValue = text.wholeText.slice(0,index) + value + text.wholeText.slice(index);
      };
      let replacers = instance.funcs[valIndex];
      if ( replacers == undefined ) {
        replacers = instance.funcs[valIndex] = [];
      }
      replacers.push({getValue,setValue});
    }
  }

  function df( t ) {
    return (new DOMParser).parseFromString(`<template>${t}</template>`,"text/html").head.firstChild.content;
  }

