/* Arktos profile of the shared P06 pilot model.
 * No independent persistence or combat authority.
 */
(function(root){
 'use strict';
 const pilot=typeof module==='object'&&module.exports?
  require('./zapdos-story-model.js'):root.TPZapdosModel;
 const api=pilot.forStory('articuno');
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPArktosModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
