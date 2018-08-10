// types
  //Build
  import {T} from '../jtype-system/t.js';
  //Dev
  //import {T} from './node_modules/jtype-system/t.js';

  // T

    export default T;

  // Both SSR and Browser

    export const TKey = T.def('Key', null, {verify: v => typeof v === "object" &&  !!((v.key||'')+'') });

  // Browser side

    export const TBrutalLikeObject = T.def('BrutalLikeObject', {
      code: T`String`,
      externals: T`Array`,
      nodes: T`Array`,
      to: T`Function`,
      update: T`Function`,
      v: T`Array`
    });

    export const TBrutalObject = T.def('BrutalObject', {
      code: T`String`,
      externals: T`Array`,
      nodes: T`Array`,
      to: T`Function`,
      update: T`Function`,
      v: T`Array`
    }, {verify: v => verify(v)});

    export const TBrutalArray = T.defCollection('BrutalArray', {
      container: T`Array`,
      member: T`BrutalObject`
    });

  // SSR

    export const TSBrutalObject = T.def('SBrutalObject', {
      str: T`String`,
      handlers: T`Object`
    });

    export const TSBrutalArray = T.defCollection('SBrutalArray', {
      container: T`Array`,
      member: T`SBrutalObject`
    });

  // export

  export const BS = {TKey,TBrutalObject,TBrutalLikeObject,TBrutalArray};

  export const SSR = {TKey,TSBrutalObject,TSBrutalArray};

  export const Types = {BS,SSR};
