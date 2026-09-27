import {chromium} from 'playwright';
import http from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const server=http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const path=pathname==='/web'?resolve('../public/beta/BoutiquePilot.html'):resolve('www',pathname==='/'?'index.html':'.'+pathname);
  if(!path.startsWith(resolve('www'))&&pathname!=='/web'){res.writeHead(404);res.end();return;}
  try{const data=await readFile(path);res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':'text/html');res.end(data);}catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`,b=await chromium.launch({channel:'chrome'}),errors=[],external=[];
await mkdir('artifacts',{recursive:true});
try{
 const nativeContext=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 await nativeContext.addInitScript(()=>{
  window.io={mode:'ok',saved:null,selected:null,printed:0,exitRequests:0};
  window.Capacitor={isNativePlatform:()=>true,Plugins:{BoutiqueFiles:{
   saveJSON:async value=>{if(io.mode==='error')throw Error('I/O');if(io.mode==='cancel')return {cancelled:true};io.saved=value;return {cancelled:false};},
   openJSON:async()=>io.selected||{cancelled:true},
   printTicket:async()=>{io.printed++;},
   launchReady:async()=>{setTimeout(()=>window.dispatchEvent(new Event("boutiquepilot-launch")),300);},
   requestExit:async()=>{io.exitRequests++;}
  }}};
 });
 const app=await nativeContext.newPage();app.on('pageerror',e=>errors.push(e.message));app.on('request',r=>{if(!r.url().startsWith(url))external.push(new URL(r.url()).origin);});
 app.on('dialog',d=>d.accept());await app.goto(url);
 await app.screenshot({path:'artifacts/launch-browser-preview.png'});
 await app.waitForFunction(()=>document.querySelector('#android-launch.playing'));
 const started=Date.now();
 const line=await app.locator('#android-launch i').evaluate(e=>getComputedStyle(e).transform);
 await app.waitForTimeout(1500);
 assert.equal(await app.locator('#android-launch').count(),1);
 assert.notEqual(await app.locator('#android-launch i').evaluate(e=>getComputedStyle(e).transform),line);
 await app.waitForFunction(()=>!document.getElementById('android-launch'));
 const launchMs=Date.now()-started;assert.ok(launchMs>=2800&&launchMs<3800,launchMs);
 await app.getByRole('button',{name:'☰ Modules'}).tap();
 await app.getByRole('button',{name:'Quitter l’application',exact:true}).tap();
 assert.equal(await app.evaluate(()=>io.exitRequests),1);
 const modules=await app.locator('#nav [data-v]').evaluateAll(a=>a.map(x=>x.dataset.v));assert.equal(modules.length,14);
 for(const module of modules){await app.evaluate(v=>show(v),module);assert.ok((await app.locator('#content').innerText()).length>0);assert.equal(await app.locator('#android-exit').count(),1);}
 await app.evaluate(()=>transact(d=>{d.store.name='Contrôle Android local';d.customers.push({id:code(d,'CLI'),name:'Client test Android',active:true});}));
 await app.reload();assert.equal(await app.evaluate(()=>db.store.name),'Contrôle Android local');
 await app.evaluate(()=>show('backup'));await app.getByRole('button',{name:'Télécharger la sauvegarde',exact:true}).tap();
 await app.waitForFunction(()=>io.saved!==null);const androidExport=await app.evaluate(()=>io.saved);
 assert.match(androidExport.name,/^BoutiquePilot_SAUV_\d{2}-\d{2}-\d{4}_\d+\.json$/);
 const saved=JSON.parse(androidExport.text);assert.equal(saved.version,3);
 const webContext=await b.newContext(),web=await webContext.newPage();web.on('dialog',d=>d.accept());await web.goto(url+'/web');assert.equal(await web.locator('#android-exit').count(),0);await web.evaluate(()=>show('backup'));
 await web.locator('#backupFile').setInputFiles({name:androidExport.name,mimeType:'application/json',buffer:Buffer.from(androidExport.text)});
 await web.waitForFunction(()=>db.store.name==='Contrôle Android local');assert.deepEqual(await web.evaluate(()=>JSON.parse(JSON.stringify(db))),saved);
 await web.evaluate(()=>transact(d=>d.store.name='Retour navigateur'));
 const download=web.waitForEvent('download');await web.getByRole('button',{name:'Télécharger la sauvegarde',exact:true}).click();const file=await download;
 const text=await readFile(await file.path(),'utf8');
 await app.evaluate(data=>io.selected=data,{cancelled:false,name:file.suggestedFilename(),text});
 await app.locator('label').filter({hasText:'Importer une sauvegarde'}).tap();
 await app.waitForFunction(()=>db.store.name==='Retour navigateur');assert.deepEqual(await app.evaluate(()=>JSON.parse(JSON.stringify(db))),JSON.parse(text));
 const before=await app.evaluate(()=>localStorage.getItem(KEY));
 await app.evaluate(()=>{io.selected={cancelled:false,name:'corrompu.json',text:'{broken'};});
 await app.locator('label').filter({hasText:'Importer une sauvegarde'}).tap();await app.waitForTimeout(100);assert.equal(await app.evaluate(()=>localStorage.getItem(KEY)),before);
 await app.evaluate(()=>{io.mode='cancel';});await app.getByRole('button',{name:'Télécharger la sauvegarde',exact:true}).tap();await app.waitForTimeout(100);assert.equal(await app.locator('#toast').innerText(),'Enregistrement annulé.');
 await app.evaluate(()=>{io.mode='error';});await app.getByRole('button',{name:'Télécharger la sauvegarde',exact:true}).tap();await app.waitForTimeout(100);assert.ok((await app.locator('#toast').innerText()).includes('impossible'));
 await app.evaluate(()=>{document.body.classList.add('printing');window.print();});await app.waitForTimeout(100);assert.equal(await app.evaluate(()=>io.printed),1);assert.equal(await app.locator('body').evaluate(e=>e.classList.contains('printing')),false);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const result={scope:'Browser with mocked native I/O — NOT an Android device test',launchMs,exitBinding:true,modules:modules.length,roundTripJSON:true,persistenceBrowser:true,invalidImportPreserved:true,cancelAndError:true,printAdapter:true,externalRequests:external,errors};
 await writeFile('artifacts/adapters.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await b.close();server.close();}
