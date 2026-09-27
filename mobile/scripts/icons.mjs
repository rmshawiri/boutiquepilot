import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const source='resources/icon.png',res='android/app/src/main/res';
// Technical scaling/padding only: the supplied official artwork is not redrawn.
for(const [density,size] of Object.entries({mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})){
  const dir=`${res}/mipmap-${density}`;await mkdir(dir,{recursive:true});
  for(const name of ['ic_launcher','ic_launcher_round'])await sharp(source).resize(size,size).png().toFile(`${dir}/${name}.png`);
  const canvas=Math.round(size*108/48),art=Math.round(canvas*0.66);
  const inset=await sharp(source).resize(art,art).png().toBuffer();
  await sharp({create:{width:canvas,height:canvas,channels:4,background:'#ffffff00'}}).composite([{input:inset,gravity:'centre'}]).png().toFile(`${dir}/ic_launcher_foreground.png`);
}
await sharp(source).resize(288,288).png().toFile(`${res}/drawable/boutiquepilot_splash.png`);
await writeFile(`${res}/values/ic_launcher_background.xml`,'<?xml version="1.0" encoding="utf-8"?><resources><color name="ic_launcher_background">#FFFFFF</color></resources>\n');
console.log('Official artwork scaled for Android launcher and splash.');
