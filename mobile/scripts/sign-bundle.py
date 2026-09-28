"""Sign/verify an AAB locally, paired with the already delivered APK version."""
from pathlib import Path
import argparse,json,os,re,subprocess,hashlib,tempfile,shutil,zipfile,xml.etree.ElementTree as ET
p=argparse.ArgumentParser()
for name in ['input','jdk','bundletool','output']:p.add_argument('--'+name,type=Path,required=True)
p.add_argument('--vault',type=Path,default=Path.home()/'.boutiquepilot-signing');a=p.parse_args()
root=Path(__file__).resolve().parents[1];identity=json.loads((root/'resources/signing-identity.json').read_text());config=json.loads((a.vault/'signing-private.json').read_text());receipt=json.loads((a.vault/'last-delivery.json').read_text())
assert not a.output.exists(),'Never overwrite a delivered bundle'
assert identity['certificateSha256']==receipt['certificateSha256']
env=os.environ.copy();env['BP_STORE_PASSWORD']=config['storePassword'];env['BP_KEY_PASSWORD']=config['keyPassword']
def run(tool,args):
 exe=a.jdk/'bin'/(tool+('.exe' if os.name=='nt' else ''))
 result=subprocess.run([str(exe),*args],env=env,capture_output=True,text=True,encoding='utf-8',errors='replace')
 if result.returncode:raise RuntimeError(tool+' failed; bundle not delivered (exit '+str(result.returncode)+')')
 return result.stdout
xml=run('java',['-jar',str(a.bundletool),'dump','manifest','--bundle='+str(a.input)])
manifest=ET.fromstring(xml);android='{http://schemas.android.com/apk/res/android}'
assert manifest.attrib['package']==identity['applicationId']
assert int(manifest.attrib[android+'versionCode'])==receipt['versionCode']
assert manifest.attrib[android+'versionName']==receipt['versionName']
assert manifest.find('uses-sdk').attrib[android+'minSdkVersion']=='24'
with tempfile.TemporaryDirectory(prefix='boutiquepilot-bundle-') as tmp:
 signed=Path(tmp)/'signed.aab'
 run('jarsigner',['-J-Duser.language=en','-J-Duser.country=US','-keystore',str(a.vault/'boutiquepilot-app.p12'),'-storetype','PKCS12','-storepass:env','BP_STORE_PASSWORD','-keypass:env','BP_KEY_PASSWORD','-sigalg','SHA256withRSA','-digestalg','SHA-256','-signedjar',str(signed),str(a.input),identity['alias']])
 proof=run('jarsigner',['-J-Duser.language=en','-J-Duser.country=US','-verify','-strict','-keystore',str(a.vault/'boutiquepilot-app.p12'),'-storetype','PKCS12','-storepass:env','BP_STORE_PASSWORD',str(signed)])
 assert 'jar verified.' in proof
 cert=run('keytool',['-J-Duser.language=en','-J-Duser.country=US','-printcert','-jarfile',str(signed)])
 fingerprint=re.search(r'SHA256:\s*([0-9A-F:]+)',cert).group(1).replace(':','').lower();assert fingerprint==identity['certificateSha256']
 validation=run('java',['-jar',str(a.bundletool),'validate','--bundle='+str(signed)])
 with zipfile.ZipFile(signed) as z,zipfile.ZipFile(a.input) as original:
  assert z.testzip() is None
  for n in original.namelist():assert original.read(n)==z.read(n),n
 a.output.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(signed,a.output)
 digest=hashlib.sha256(a.output.read_bytes()).hexdigest()
 a.output.with_suffix('.sha256').write_text(digest+'  '+a.output.name+'\n')
 a.output.with_suffix('.verification.txt').write_text(proof+'\n'+cert+'\n'+validation)
 print(json.dumps({'aab':a.output.name,'sha256':digest,'certificateSha256':fingerprint,'versionCode':receipt['versionCode']},indent=2))
