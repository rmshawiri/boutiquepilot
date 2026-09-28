"""Create separate public Play and private maintenance archives. Never include passwords."""
from pathlib import Path
import argparse,subprocess,zipfile,io,json,hashlib
p=argparse.ArgumentParser()
for n in ['delivery','tools']:p.add_argument('--'+n,type=Path,required=True)
p.add_argument('--vault',type=Path,default=Path.home()/'.boutiquepilot-signing')
a=p.parse_args();root=Path(__file__).resolve().parents[2]
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
assert not subprocess.check_output(['git','status','--porcelain'],cwd=root).strip(),'Commit source changes before archiving'
reference='Repository: https://github.com/rmshawiri/boutiquepilot\nBranch: android/beta\nSnapshot commit: '+head+'\nBinary build commit: 60705006510a77e26b7b9cecdc33890c135b9ab9\n'
play=a.delivery/'Google-Play-Package';public_zip=a.delivery/'BoutiquePilot-Google-Play-Package.zip';private_dir=a.vault/'Archives';private_dir.mkdir(exist_ok=True);private_zip=private_dir/'BoutiquePilot-Android-MAINTENANCE-MASTER-PRIVE.zip'
assert not public_zip.exists() and not private_zip.exists(),'Do not silently replace archives'
secret=json.loads((a.vault/'signing-private.json').read_text())
secrets=[secret['storePassword'].encode(),secret['keyPassword'].encode()]
def check_public(name,data):
 assert not any(s in data for s in secrets),'Secret found'
 assert not name.lower().endswith(('.p12','.jks','.keystore','.pem','.env'))
 assert 'signing-private' not in Path(name).name.lower() and 'informations des comptes' not in name.lower()
 if name.lower().endswith(('.apk','.aab','.zip')):
  with zipfile.ZipFile(io.BytesIO(data)) as nested:
   for n in nested.namelist():
    if not n.endswith('/'):check_public(n,nested.read(n))
(play/'GIT-REFERENCE.txt').write_text(reference)
public_items={p.relative_to(play).as_posix():p.read_bytes() for p in play.rglob('*') if p.is_file()}
for name,data in public_items.items():check_public(name,data)
def write_zip(path,items):
 hashes=''.join(hashlib.sha256(data).hexdigest()+'  '+name+'\n' for name,data in sorted(items.items()))
 with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for name,data in sorted(items.items()):z.writestr(name,data)
  z.writestr('CONTENTS-SHA256.txt',hashes)
 with zipfile.ZipFile(path) as z:assert z.testzip() is None
write_zip(public_zip,public_items)
source=subprocess.check_output(['git','archive','--format=zip',head,'mobile','public/beta/BoutiquePilot.html','package.json','package-lock.json','.github/workflows/android-apk.yml','.gitignore'],cwd=root)
items={'GIT-REFERENCE.txt':reference.encode(),'A-LIRE-AVANT-TOUTE-FUTURE-MISE-A-JOUR.md':(root/'mobile/docs/11-maintenance-restauration.md').read_bytes()}
with zipfile.ZipFile(io.BytesIO(source)) as z:
 for n in z.namelist():
  if not n.endswith('/'):
   data=z.read(n);check_public(n,data);items['Sources/'+n]=data
for name in ['apksigner.jar','bundletool.jar']:items['Outils/'+name]=(a.tools/name).read_bytes()
for name in ['boutiquepilot-app.p12','last-delivery.json']:items['Coffre/'+name]=(a.vault/name).read_bytes()
items['NE-JAMAIS-PUBLIER.txt']=b'PRIVATE OWNER ARCHIVE. Encrypted PKCS12 included. Passwords are NOT included. Store passwords separately. Never put this ZIP in Git or the Play package.\n'
for name,data in items.items():assert not any(s in data for s in secrets),'Password must not enter maintenance archive'
write_zip(private_zip,items)
manifest=[]
for path in [a.delivery/'BoutiquePilot-Android-1.0.0-beta.4.apk',a.delivery/'BoutiquePilot-Android-1.0.0-beta.4.aab',public_zip,private_zip]:manifest.append(hashlib.sha256(path.read_bytes()).hexdigest()+'  '+path.name)
(a.delivery/'SHA256SUMS-FINAL.txt').write_text('\n'.join(manifest)+'\n')
private_zip.with_suffix('.zip.sha256').write_text(manifest[-1]+'\n')
print('Both archives created and CRC-checked; passwords excluded; public archive excludes private material.')
print('\n'.join(manifest))
