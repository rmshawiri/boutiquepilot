/* Platform adapters only. The source's calculations, database schema and validators are reused. */
(() => {
  if (!window.Capacitor?.isNativePlatform()) return;
  const native = Capacitor.Plugins.BoutiqueFiles;
  const launch = document.createElement('div');
  launch.id='android-launch';launch.setAttribute('aria-hidden','true');
  launch.innerHTML='<img src="android-icon.png" alt=""><p>VERSION BÊTA · MORA SHAWIRI</p><i></i>';
  document.body.append(launch);setTimeout(()=>launch.remove(),1000);

  let saving=false,opening=false;
  async function saveJSON(name,text){
    const result=await native.saveJSON({name,text});
    if(result.cancelled)toast('Enregistrement annulé.');
    else toast('Sauvegarde enregistrée : '+name);
  }
  window.exportData=async function(){
    if(saving)return;saving=true;
    try{const backup=backupData();render();await saveJSON(backup.name,backup.text);}
    catch{toast('Enregistrement impossible. Réessayez dans un emplacement accessible.');}
    finally{saving=false;}
  };
  window.exportRaw=async function(){
    if(!storageText||saving)return;saving=true;
    try{await saveJSON('BoutiquePilot_DONNEES_ORIGINALES.json',storageText);}
    catch{toast('Enregistrement impossible. Réessayez dans un emplacement accessible.');}
    finally{saving=false;}
  };
  document.addEventListener('click',async event=>{
    if(event.target.id!=='backupFile')return;
    event.preventDefault();if(opening)return;opening=true;
    try{
      const result=await native.openJSON();
      if(!result.cancelled)await importData({target:{files:[new File([result.text],result.name,{type:'application/json'})]}});
    }catch{toast('Lecture impossible. Choisissez un fichier JSON présent sur cet appareil.');}
    finally{opening=false;}
  },true);
  window.print=async function(){
    try{await native.printTicket();}
    catch{toast('Impression indisponible sur cet appareil.');}
    finally{document.body.classList.remove('printing');}
  };
})();
