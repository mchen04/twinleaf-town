/* Source-derived map/warp data. Collision interpretation and projection remain provisional. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./source-world-data.js'));else root.TownWorld=factory(root.SourceWorldData);})(typeof globalThis!=='undefined'?globalThis:this,function(D){
'use strict';
const TILE=16,COLS=32,ROWS=32;
const houses=[{"id":"scout","name":"Rival’s house · northwest","resident":"Pikachu","role":"Fable 5.2 · session 1","x":5,"y":5,"w":6,"h":5,"doorX":9,"doorY":11,"color":"#a96c47","roof":"#689a9c","note":"NORTHWEST HOUSE · SOURCE HEADER 412","task":"Fix the flaky test","text":"Fable 5.2 here, session 1 of 4. I read your whole repo while you walked over. Want me to fix the flaky test?","result":"Flaky test: fixed.\nCause: it read the real clock.\nFix: a fake clock. Six lines.\n185 tests pass. The PR is open.","furnishing":"maps","header":412},{"id":"maker","name":"Northeast house","resident":"Psyduck","role":"Fable 5.2 · session 2","x":22,"y":7,"w":5,"h":4,"doorX":20,"doorY":11,"color":"#776bb0","roof":"#649194","note":"NORTHEAST HOUSE · SOURCE HEADER 416","task":"Build the feature","text":"Psy? Fable 5.2, session 2 of 4. My head hurts because the whole codebase is in it. Shall I build the feature?","result":"Feature: built.\nOne small diff. No new dependencies.\nI tested it end to end.\nMerged at ultra fast.","furnishing":"workshop","header":416},{"id":"keeper","name":"Southwest house","resident":"Pachirisu","role":"Fable 5.2 · session 3","x":6,"y":14,"w":5,"h":4,"doorX":10,"doorY":21,"color":"#59907a","roof":"#6e9c98","note":"SOUTHWEST HOUSE · SOURCE HEADER 417","task":"Review the PR","text":"Fable 5.2, session 3 of 4. I review code. I am polite, but I do find the bug. Want a review?","result":"Review: done.\nOne real bug. An off-by-one in the loop.\nThe rest is fine. I checked.","furnishing":"library","header":417},{"id":"home","name":"Player’s house · southeast","resident":"Buneary","role":"Fable 5.2 · session 4","x":21,"y":14,"w":6,"h":5,"doorX":20,"doorY":21,"color":"#c38655","roof":"#699b99","note":"SOUTHEAST HOUSE · SOURCE HEADER 414","task":"Write the report","text":"Welcome home! Fable 5.2, session 4 of 4. I write the report. Five sentences or fewer. Want one?","result":"Report.\nIt works. I verified it.\nNothing needs you.","furnishing":"home","header":414}];
const getHouse=id=>houses.find(h=>h.id===id);
const getHeader=id=>D.headers.find(h=>h.header===Number(id));
const getScene=header=>D.scenes[String(getHeader(header).cells[0].land)];
const signs=[{x:16,y:14,kind:'town',sourceGraphicsId:91}];
const mailboxes=[{x:13,y:11,house:'scout',sourceGraphicsId:92},{x:18,y:21,house:'home',sourceGraphicsId:92}];
function blockedForHeader(x,y,header=411){
 if(x<0||y<0||x>=32||y>=32)return true;
 const scene=getScene(header);
 if(!scene.candidate_walkable_rows[y][x])return true;
 if(header===411){if(y<1)return true;if([...signs,...mailboxes].some(o=>o.x===x&&o.y===y))return true;}
 return false;
}
const townBlocked=(x,y)=>blockedForHeader(x,y,411);
function interiorBlocked(x,y,houseOrHeader){const h=getHouse(houseOrHeader);return blockedForHeader(x,y,h?h.header:Number(houseOrHeader)||412);}
function heightAt(header,x,y){const scene=getScene(header),values=scene.tile_center_heights[Math.max(0,Math.min(31,Math.round(y)))][Math.max(0,Math.min(31,Math.round(x)))];return values.length?values[0]:0;}
function project(header,x,y){const scene=getScene(header),wx=x*16-248,wz=y*16-248,wy=heightAt(header,x,y);return {x:wx+scene.screen_origin[0],y:(wz-wy)/Math.SQRT2+scene.screen_origin[1],depth:(wz+wy)/Math.SQRT2};}
function roomWarp(header,index=0){return getHeader(header).events.warps.find(w=>w.index===index);}
function pickRoomSpot(header,index=0){const candidates=[[5,6],[7,6],[4,6],[8,6],[6,7],[5,7],[7,7],[3,6],[8,7]];const walk=candidates.filter(([x,y])=>!blockedForHeader(x,y,header));return{x:walk[index%walk.length][0],y:walk[index%walk.length][1]};}
function createNPCs(){return houses.map((h,i)=>{const x=h.doorX+(h.id==='home'?2:0),y=h.doorY+2;return{id:h.id,x,y,fromX:x,fromY:y,toX:x,toY:y,progress:1,facing:'down',wait:1+i*.6,step:0,location:'town',houseId:null,roomHeader:null,targetHouse:h.id,visitIndex:i,indoorTime:0};});}
  function findPath(start,goal,blocked=townBlocked) {
    const key=(x,y)=>x+','+y,queue=[{x:start.x,y:start.y,path:[]}],seen=new Set([key(start.x,start.y)]);
    for(let i=0;i<queue.length;i++){
      const p=queue[i];if(p.x===goal.x&&p.y===goal.y)return p.path;
      for(const [dx,dy,dir]of [[0,-1,'up'],[0,1,'down'],[-1,0,'left'],[1,0,'right']]){
        const x=p.x+dx,y=p.y+dy,k=key(x,y);
        if(x<0||y<0||x>=COLS||y>=ROWS||seen.has(k)||blocked(x,y))continue;
        seen.add(k);queue.push({x,y,path:p.path.concat(dir)});
      }
    }
    return null;
  }
  function tileReserved(actor,x,y) {
    return actor.x===x&&actor.y===y || actor.progress<1&&actor.toX===x&&actor.toY===y;
  }
  function usesNativeKey(tagName,key,isContentEditable=false) {
    const tag=String(tagName||'').toUpperCase();
    if(isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(tag))return true;
    return (tag==='BUTTON'||tag==='A'||tag==='SUMMARY')&&(key===' '||key==='Enter');
  }
  function taskDialogView(status) {
    return status==='ready'
      ? {text:'Done and verified. The tests pass and the PR is open. Read my report when you’re ready.',label:'Read the report',disabled:false,action:'result'}
      : {text:'Working on it now. Keep exploring. I report when it is verified, not before.',label:'Session running…',disabled:true,action:'waiting'};
  }
  function taskState(start,now) { return now-start>=4400?'ready':now-start>=1100?'working':'queued'; }

return {TILE,COLS,ROWS,houses,getHouse,getHeader,getScene,sourceData:D,signs,mailboxes,townBlocked,interiorBlocked,blockedForHeader,heightAt,project,roomWarp,pickRoomSpot,createNPCs,findPath,tileReserved,usesNativeKey,taskDialogView,taskState};
});
