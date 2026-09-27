import sharp from 'sharp';
// 288 dp canvas; 128 dp logo square fits entirely within the 192 dp safe circle.
const input=await sharp('resources/launch-logo.png').resize(384,384,{fit:'contain',background:'#ffffff00'}).png().toBuffer();
await sharp({create:{width:864,height:864,channels:4,background:'#ffffff00'}}).composite([{input,gravity:'centre'}]).png().toFile('android/app/src/main/res/drawable/boutiquepilot_splash.png');
console.log('Complete transparent logo fitted inside Android splash safe circle.');
