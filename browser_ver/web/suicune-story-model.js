/* Suicune profile of the shared story model.
 * Pure candidates only. Native code and the existing controller own writes.
 */
(function(root){
 'use strict';
 const pilot=typeof module==='object'&&module.exports?
  require('./zapdos-story-model.js'):root.TPZapdosModel;
 const api=pilot.forStory('suicune');
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.TPSuicuneModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
