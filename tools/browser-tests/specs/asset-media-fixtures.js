/* UI01 media import: synthetic functional fixtures only */
function silentWav(){
 const samples=800,rate=8000,dataLength=samples*2;
 const bytes=Buffer.alloc(44+dataLength);
 bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);
 bytes.write('WAVE',8);bytes.write('fmt ',12);bytes.writeUInt32LE(16,16);
 bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);
 bytes.writeUInt32LE(rate,24);bytes.writeUInt32LE(rate*2,28);
 bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);
 bytes.write('data',36);bytes.writeUInt32LE(dataLength,40);
 return bytes;
}
const testEntry='Dies ist ein synthetischer Pokédex-Testeintrag, kein Originalinhalt.';
function textFile(){
 return Buffer.from('# Synthetische Funktionsfixture\n1|'+testEntry+'\n','utf8');
}
module.exports={silentWav,textFile,testEntry};
