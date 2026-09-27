const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../www/index.html'),'utf8');
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes("const KEY='boutique-pilot-kmf'"));
if(!script)throw Error('Business script not found');
const end=script.indexOf("loadDB();$('nav').innerHTML");
if(end<0)throw Error('Startup boundary not found');
module.exports=script.slice(0,end);
