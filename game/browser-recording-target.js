/* Explicit in-memory target for bounded capture. No automatic download or upload. */
(function(root){'use strict';let activeUrl=null;
root.BrowserRecordingTarget=Object.freeze({create(link){
 // Preserve any previously accepted download until a new complete buffer is published.
 if(!activeUrl){link.hidden=true;link.removeAttribute('href');}
 let blob=new Blob([],{type:'video/webm'}),closed=false,writing=false;const stamp=Date.now();
 return Object.freeze({name:'review buffer (not yet downloaded)',
 async getFile(){return {size:blob.size,lastModified:stamp};},
 async createWritable(){if(writing||closed)throw Error('Review buffer already used');writing=true;let pending=null;return {
 async write(value){if(!(value instanceof Blob)||value.size>4194304)throw Error('Invalid bounded recording');pending=value;},
 async close(){if(!pending)throw Error('No complete recording');blob=pending;pending=null;closed=true;},
 async abort(){pending=null;blob=new Blob([]);}
 };},
 publish(){if(!closed||!blob.size||blob.size>4194304)throw Error('Recording not accepted');const nextUrl=URL.createObjectURL(blob),priorUrl=activeUrl;try{link.href=nextUrl;link.hidden=false;link.textContent='Download accepted WebM ('+blob.size+' bytes)';activeUrl=nextUrl;}catch(error){URL.revokeObjectURL(nextUrl);throw error;}if(priorUrl)URL.revokeObjectURL(priorUrl);}
 });
}});})(window);
