import sharp from 'sharp';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const input=resolve(process.argv[2] || 'artifacts/android/capture-third'),dest=resolve('../07 Application Mobile Bêta/03 Captures App/Captures App'),tracked=resolve('mobile/resources/android-captures');
await mkdir(tracked,{recursive:true});
const provenance=JSON.parse(await readFile(resolve(input,'provenance.json'),'utf8'));
provenance.workflow='https://github.com/rmshawiri/boutiquepilot/actions/runs/36392107514';
provenance.commit='eaabbb467f1fbd6324e4e99c30731b6495a81a96';
provenance.method='Unchanged signed release APK installed in Android 15 emulator; adb UI gestures and screencap. Only status/navigation system bands cropped. No browser, UI edits, compositing or generative imagery in screenshots.';
provenance.cart={products:['Sardines à l’huile','Biscuits ABC'],quantities:[1,1],totalKMF:250,saleCompleted:false};
provenance.screenshots={};
for(const name of ['01-tableau-de-bord','02-caisse-panier','03-articles-stock','04-tarification-marges']){
 const original=await readFile(resolve(input,name+'.png'));const meta=await sharp(original).metadata();
 const crop=meta.width===1080?{left:0,top:60,width:1080,height:1800}:{left:0,top:36,width:1920,height:996};
 if(!(await sharp(original).stats()).isOpaque)throw Error('Unexpected transparent screenshot');
 const result=await sharp(original).extract(crop).removeAlpha().png().toBuffer();
 const raw=await sharp(result).raw().toBuffer();const expected=await sharp(original).extract(crop).removeAlpha().raw().toBuffer();if(!raw.equals(expected))throw Error('Screenshot pixels changed');
 await writeFile(resolve(dest,name+'.png'),result);await writeFile(resolve(tracked,name+'.png'),result);
 provenance.screenshots[name+'.png']={originalSize:[meta.width,meta.height],androidDensity:meta.width===1080?400:240,crop,originalSha256:createHash('sha256').update(original).digest('hex'),sha256:createHash('sha256').update(result).digest('hex'),applicationPixelsUnchanged:true};
}
await writeFile(resolve(tracked,'provenance.json'),JSON.stringify(provenance,null,2)+'\n');
await writeFile(resolve(dest,'Provenance-Android.json'),JSON.stringify(provenance,null,2)+'\n');
console.log('Four genuine screenshots: only Android system bands removed; app pixels exactly preserved.');
