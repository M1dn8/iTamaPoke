#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'../..');
const H=require(path.join(ROOT,'tools/browser-tests/specs/helpers.js'));
const T=require(path.join(ROOT,'browser_ver/web/storage-tools.js'));
const P=require(path.join(ROOT,'browser_ver/web/suicune-source-preview.js'));
(async()=>{
 const downloads=path.join(os.homedir(),'Downloads');fs.mkdirSync(downloads,{recursive:true});
 const folder=fs.mkdtempSync(path.join(downloads,'iTamaPoke-P07a-Suicune-Preview-'));
 fs.chmodSync(folder,0o700);
 for(const item of P.cases){
  const raw=H.fixture(0);
  const sealed=await T.seal(raw,{purpose:'P07a visual prototype',case:item.name});
  const decoded=await T.decode(sealed);
  assert(Buffer.from(decoded.raw).equals(raw));
  fs.writeFileSync(path.join(folder,item.name+'.tpsave'),sealed,{mode:0o600});
 }
 fs.writeFileSync(path.join(folder,'review.json'),JSON.stringify({
  schema:1,story:'suicune-preview',names:P.cases.map(c=>c.name)
 },null,2),{mode:0o600});
 console.log('Acht überprüfte Vorschau-Ausgangsstände:',folder);
 console.log('Nur visuelle Ausgangsfälle, keine gespeicherten Suicune-Storyabschlüsse.');
})().catch(error=>{console.error(error);process.exitCode=1;});
