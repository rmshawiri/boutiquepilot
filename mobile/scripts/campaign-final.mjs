import sharp from 'sharp';
import {readFile,mkdir,writeFile,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';
// Composition of vector artwork around genuine, unchanged Android screenshots.
const base=resolve('../07 Application Mobile Bêta/03 Captures App');
const out=resolve(base,'Campagne App');const sources=resolve('mobile/resources/campaign-final');
await mkdir(out,{recursive:true});await mkdir(sources,{recursive:true});
const logo=(await readFile('mobile/resources/launch-logo.png')).toString('base64');
const specs=[
 ['01-tableau-de-bord','01-tableau-de-bord',['Votre boutique.','Une vision claire.'],['Suivez votre activité','depuis votre téléphone.'],['Indicateurs clés','Synthèse des ventes','Vue d’ensemble'],'PILOTEZ'],
 ['02-caisse-panier','02-caisse-ventes',['Un panier clair.','Des ventes suivies.'],['Préparez chaque vente','avec les bons articles.'],['Articles et formats','Quantités visibles','Total du panier'],'VENDEZ'],
 ['03-articles-stock','03-articles-stock',['Votre stock,','sous contrôle.'],['Retrouvez vos articles','et leurs conditionnements.'],['Stocks disponibles','Formats de vente','Suivi par article'],'ORGANISEZ'],
 ['04-tarification-marges','04-tarification-marges',['Des prix clairs.','Des marges suivies.'],['Consultez vos coûts','et vos tarifs validés.'],['Coûts et prix','Conditionnements','Marges visibles'],'DÉCIDEZ']
];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
for(const [capture,name,title,benefit,features,verb] of specs){
 const shot=await readFile(resolve(base,'Captures App',capture+'.png'));
 const meta=await sharp(shot).metadata();
 if(!((meta.width===1080&&meta.height===1800)||(meta.width===1920&&meta.height===996)))throw Error('Unexpected Android capture dimensions');
 const image=shot.toString('base64');const screenHeight=500*meta.height/meta.width;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
 <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#153653"/><stop offset="1" stop-color="#081d32"/></linearGradient><linearGradient id="accent"><stop stop-color="#55d5ff"/><stop offset="1" stop-color="#25a8e9"/></linearGradient><filter id="shadow" x="-50%" y="-30%" width="200%" height="180%"><feDropShadow dx="0" dy="22" stdDeviation="20" flood-color="#000" flood-opacity=".38"/></filter><clipPath id="screen"><rect x="512" y="365" width="500" height="${screenHeight}" rx="18"/></clipPath></defs>
 <rect width="1080" height="1350" fill="url(#bg)"/><circle cx="1040" cy="600" r="520" fill="#128dc6" opacity=".13"/><path d="M440 1350L1080 660V1350Z" fill="#1b5070" opacity=".25"/>
 <rect x="54" y="46" width="88" height="88" rx="22" fill="#fff"/><image href="data:image/png;base64,${logo}" x="58" y="50" width="80" height="80"/>
 <g font-family="Segoe UI,Arial,sans-serif"><text x="163" y="88" fill="#fff" font-size="33" font-weight="700">BoutiquePilot</text><text x="165" y="119" fill="#92b7ca" font-size="17" letter-spacing="3">PAR MORA SHAWIRI</text>
 <rect x="777" y="65" width="246" height="46" rx="23" fill="#20455f" stroke="#477087"/><text x="900" y="95" text-anchor="middle" fill="#b9eaff" font-size="20" font-weight="600">BÊTA ANDROID</text>
 ${title.map((s,i)=>`<text x="58" y="${215+i*70}" fill="${i?'#60d5ff':'#fff'}" font-size="62" font-weight="750" letter-spacing="-1.8">${esc(s)}</text>`).join('')}
 <rect x="60" y="356" width="48" height="5" rx="2" fill="#48cfff"/>
 <text x="60" y="411" fill="#69d4ff" font-size="20" letter-spacing="4" font-weight="700">${verb}</text>
 ${benefit.map((s,i)=>`<text x="60" y="${473+i*40}" fill="#fff" font-size="27" font-weight="500">${esc(s)}</text>`).join('')}
 ${features.map((s,i)=>`<circle cx="72" cy="${619+i*76}" r="12" fill="#225671"/><path d="M66 ${619+i*76}l4 4 8-9" fill="none" stroke="#67dcff" stroke-width="2.5" stroke-linecap="round"/><text x="98" y="${627+i*76}" fill="#d7e7ef" font-size="23">${esc(s)}</text>`).join('')}
 <text x="60" y="919" fill="#fff" font-size="26" font-weight="650">Même hors connexion.</text><text x="60" y="956" fill="#a6c1d1" font-size="21">Vos données sur votre appareil.</text>
 <rect x="58" y="1035" width="391" height="76" rx="18" fill="url(#accent)"/><text x="83" y="1082" fill="#09253d" font-size="25" font-weight="750">Découvrez BoutiquePilot</text><path d="M410 1066l9 9-9 9" fill="none" stroke="#09253d" stroke-width="3"/>
 <text x="60" y="1154" fill="#b5d3e2" font-size="20">boutiquepilot.</text><text x="60" y="1183" fill="#b5d3e2" font-size="20">morashawiri.com</text>
 <text x="60" y="1294" fill="#7199b1" font-size="17">Interface Android réelle • Données de démonstration</text></g>
 <rect x="500" y="353" width="524" height="${screenHeight+24}" rx="29" fill="#072237" stroke="#517387" stroke-width="2" filter="url(#shadow)"/>
 <image href="data:image/png;base64,${image}" x="512" y="365" width="500" height="${screenHeight}" clip-path="url(#screen)"/>
 </svg>`;
 if(meta.width>meta.height){
 const portrait=svg;
 const header=portrait.slice(0,portrait.indexOf('<rect x="60" y="356"'));
 svg=header+`
 <text x="60" y="343" fill="#d7e7ef" font-size="28">${benefit.map(esc).join(' ')}</text>
 ${features.map((v,i)=>`<rect x="${60+i*326}" y="383" width="304" height="53" rx="26" fill="#214960"/><text x="${212+i*326}" y="418" text-anchor="middle" fill="#bceaff" font-size="23">${esc(v)}</text>`).join('')}
 <rect x="50" y="474" width="980" height="518" rx="22" fill="#09243a" stroke="#52768b" stroke-width="2" filter="url(#shadow)"/>
 <image href="data:image/png;base64,${image}" x="60" y="484" width="960" height="498"/>
 <text x="60" y="1090" fill="#fff" font-size="27" font-weight="650">Votre boutique vous suit. Même hors connexion.</text>
 <rect x="60" y="1129" width="493" height="76" rx="18" fill="url(#accent)"/><text x="88" y="1178" fill="#09253d" font-size="29" font-weight="750">Découvrez BoutiquePilot</text><path d="M514 1157l9 10-9 10" fill="none" stroke="#09253d" stroke-width="3"/>
 <text x="591" y="1160" fill="#b5d3e2" font-size="22">boutiquepilot.</text><text x="591" y="1192" fill="#b5d3e2" font-size="22">morashawiri.com</text>
 <text x="60" y="1294" fill="#87afc5" font-size="19">Interface Android réelle • Données de démonstration</text></g></svg>`;
 }
 svg=svg.replace(/[ \t]+$/gm,'');
 await writeFile(resolve(sources,name+'.svg'),svg);
 await sharp(Buffer.from(svg)).flatten({background:'#102f4a'}).removeAlpha().png().toFile(resolve(out,name+'.png'));
 await copyFile(resolve(out,name+'.png'),resolve(sources,name+'.png'));
}
console.log('Four campaign PNGs rendered from genuine Android captures.');
