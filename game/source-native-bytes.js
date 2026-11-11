(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.SourceNativeBytes=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const K=new Int32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
 const ByteArray=Uint8Array,typed=Object.getPrototypeOf(ByteArray.prototype),get=name=>Object.getOwnPropertyDescriptor(typed,name).get,brand=get(Symbol.toStringTag),buffer=get('buffer'),offset=get('byteOffset'),size=get('byteLength'),length=get('length'),bufferSize=Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,'byteLength').get,put=Object.getOwnPropertyDescriptor(typed,'set').value;
 function storage(value){
  try{
   const type=brand.call(value);if(type!=='Uint8Array'&&type!=='Uint8ClampedArray')return null;
   const data=buffer.call(value),start=offset.call(value),bytes=size.call(value),count=length.call(value),capacity=bufferSize.call(data);
   if(bytes!==count||start+bytes>capacity)return null;
   return new ByteArray(data,start,bytes);
  }catch(error){return null;}
 }
 function isBytes(value){return storage(value)!==null;}
 function copy(value){
  const source=storage(value);if(!source)throw Error('Native byte verifier requires unshared RGBA8 byte storage');
  const n=length.call(source);if(n>0x1fffffff)throw Error('Native byte verifier bounded input exceeded');
  const result=new ByteArray(n);put.call(result,source);return result;
 }
 function rotate(v,n){return (v>>>n)|(v<<(32-n));}
 function sha256(bytes){
  const source=storage(bytes);if(!source)throw Error('Native byte verifier requires unshared RGBA8 byte storage');
  const n=length.call(source);
  if(n>0x1fffffff)throw Error('Native byte verifier bounded input exceeded');
  const size=Math.ceil((n+9)/64)*64,padded=new ByteArray(size),view=new DataView(padded.buffer),w=new Int32Array(64);
  put.call(padded,source);padded[n]=128;view.setUint32(size-8,Math.floor(n/0x20000000));view.setUint32(size-4,(n*8)>>>0);
  const h=new Int32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
  for(let offset=0;offset<size;offset+=64){
   for(let i=0;i<16;i++)w[i]=view.getInt32(offset+i*4);
   for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2],s0=rotate(a,7)^rotate(a,18)^(a>>>3),s1=rotate(b,17)^rotate(b,19)^(b>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)|0;}
   let a=h[0],b=h[1],c=h[2],d=h[3],e=h[4],f=h[5],g=h[6],q=h[7];
   for(let i=0;i<64;i++){const s1=rotate(e,6)^rotate(e,11)^rotate(e,25),ch=(e&f)^(~e&g),t1=(q+s1+ch+K[i]+w[i])|0,s0=rotate(a,2)^rotate(a,13)^rotate(a,22),maj=(a&b)^(a&c)^(b&c),t2=(s0+maj)|0;q=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
   h[0]=(h[0]+a)|0;h[1]=(h[1]+b)|0;h[2]=(h[2]+c)|0;h[3]=(h[3]+d)|0;h[4]=(h[4]+e)|0;h[5]=(h[5]+f)|0;h[6]=(h[6]+g)|0;h[7]=(h[7]+q)|0;
  }
  return Array.from(h,v=>(v>>>0).toString(16).padStart(8,'0')).join('');
 }
 function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
 return Object.freeze({sha256,isBytes,copy,freeze});
});
