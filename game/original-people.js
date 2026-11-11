(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./original-people-data.js'),require('./original-motion.js'));else root.OriginalPeople=factory(root.OriginalPeopleData,root.OriginalMotion);})(typeof globalThis!=='undefined'?globalThis:this,function(data,motion){
'use strict';
if(!motion)throw new Error('OriginalMotion must load before OriginalPeople');
function create(){return data.actors.map(a=>motion.attach({...a,location:a.header===411?'town':'interior',roomHeader:a.header===411?null:a.header,fromX:a.x,fromY:a.y,toX:a.x,toY:a.y,progress:1,step:0}));}
// Collision reserves current logical destination and the in-flight origin.
// Use targetAt for interaction: the source looks up current logical X/Z only.
return{data,create,frame:motion.frame,at:motion.at,targetAt:motion.targetAt,tileReserved:motion.tileReserved,createMotion:motion.createController};
});
