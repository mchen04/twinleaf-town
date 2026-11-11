/* Explicit fixed-time lighting preview. This helper never reads a clock or
 * advances source lighting one row at a time. The renderer receives a reset
 * after each valid choice, so its source initial lookup handles arbitrary jumps. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LightingPreview=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function parse(value){
    if(typeof value!=='string'||! /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(value))return null;
    return Number(value.slice(0,2))*3600+Number(value.slice(3,5))*60;
  }
  function validSeconds(seconds){
    if(!Number.isInteger(seconds)||seconds<0||seconds>=86400)throw new RangeError('LightingPreview: seconds must be an integer in 0..86399');
    return seconds;
  }
  function format(seconds){
    validSeconds(seconds);
    return String(Math.floor(seconds/3600)).padStart(2,'0')+':'+String(Math.floor(seconds/60)%60).padStart(2,'0');
  }
  function create(initial){
    var seconds=validSeconds(initial===undefined?43200:initial),revision=0,reset=true;
    var applied=new WeakMap();
    function snapshot(){return {secondsOfDay:seconds,value:format(seconds),revision:revision,resetLighting:reset};}
    function choose(value){
      var next=parse(value);
      if(next===null)return false;
      seconds=next;revision++;reset=true;
      return true;
    }
    function apply(view){
      if(!view||typeof view!=='object'||Array.isArray(view))throw new TypeError('LightingPreview: view must be an object');
      // Preserve any independent map/renderer reset requested by the caller.
      var result=Object.assign({},view,{lightingSecondsOfDay:seconds,resetLighting:reset||!!view.resetLighting,lightingPreviewRevision:revision});
      applied.set(result,revision);
      return result;
    }
    function markRendered(view){
      // Only successful rendering of this exact applied view can consume its
      // reset. Stale completions and views from other controllers cannot do so.
      if(!view||!applied.has(view))return false;
      var renderedRevision=applied.get(view);applied.delete(view);
      if(renderedRevision!==revision)return false;
      reset=false;return true;
    }
    return {choose:choose,snapshot:snapshot,apply:apply,markRendered:markRendered};
  }
  return {parse:parse,format:format,create:create};
});
