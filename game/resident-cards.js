/* Keep the fixed resident buttons connected while live status changes. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.ResidentCards=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function createStableResidentCards(container,createCard,updateCard){
    const cards=new Map();
    return function renderResidents(residents){
      for(const resident of residents){
        let card=cards.get(resident.id);
        if(!card){
          card=createCard(resident);
          cards.set(resident.id,card);
          container.append(card);
        }
        // Do not replace, remove, reappend or focus existing cards. Keyboard focus
        // and their one-time click listeners survive agent/task status refreshes.
        updateCard(card,resident);
      }
    };
  }
  return {createStableResidentCards};
});
