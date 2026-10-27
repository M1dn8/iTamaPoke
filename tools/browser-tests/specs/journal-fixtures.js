'use strict';
function withUnread(buffer,unread,total=1000){
 if(!Number.isInteger(unread)||unread<0||unread>200||total<unread)
  throw Error('Invalid journal fixture');
 const entries=new Map();let p=4;
 for(let i=0;i<buffer.readUInt32LE(0);i++){
  const n=buffer[p++],key=buffer.toString('utf8',p,p+n);p+=n;
  const type=buffer[p++],size=buffer.readUInt32LE(p);p+=4;
  entries.set(key,{type,value:Buffer.from(buffer.subarray(p,p+size))});p+=size;
 }
 if(p!==buffer.length)throw Error('Invalid source fixture');
 function number(key,value){
  const bytes=Buffer.alloc(8);bytes.writeBigInt64LE(BigInt(value));
  entries.set(key,{type:1,value:bytes});
 }
 number('jruver',1);number('jrutot',total);number('jruseen',total-unread);
 const count=Buffer.alloc(4);count.writeUInt32LE(entries.size);
 return Buffer.concat([count,...Array.from(entries,([key,{type,value}])=>{
  const k=Buffer.from(key),size=Buffer.alloc(4);size.writeUInt32LE(value.length);
  return Buffer.concat([Buffer.from([k.length]),k,Buffer.from([type]),size,value]);
 })]);
}
module.exports={withUnread};
