const path=require('node:path');
const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./specs',fullyParallel:false,workers:1,timeout:60000,retries:0,maxFailures:5,failOnFlakyTests:!!process.env.CI,
 expect:{timeout:15000},forbidOnly:!!process.env.CI,
 reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report'}]],
 use:{baseURL:'http://127.0.0.1:8765',viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'de-DE',timezoneId:'Europe/Berlin',serviceWorkers:'block',acceptDownloads:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium-mobil',use:{browserName:'chromium'}},{name:'webkit-mobil',use:{browserName:'webkit'}}],
 webServer:{command:'node tools/browser-tests/server.cjs --root browser_ver/web --port 8765',cwd:path.resolve(__dirname,'../..'),url:'http://127.0.0.1:8765/',reuseExistingServer:false,timeout:30000}
});
