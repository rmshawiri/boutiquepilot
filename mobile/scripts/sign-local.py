"""Sign a CI-built APK locally. Passwords stay in the private vault and child environment."""
from pathlib import Path
import argparse, hashlib, json, os, re, shutil, subprocess, tempfile, zipfile

parser=argparse.ArgumentParser()
parser.add_argument('--input',type=Path,required=True)
parser.add_argument('--apksigner',type=Path,required=True)
parser.add_argument('--java',type=Path,required=True)
parser.add_argument('--output',type=Path,required=True)
parser.add_argument('--vault',type=Path,default=Path.home()/'.boutiquepilot-signing')
a=parser.parse_args()
root=Path(__file__).resolve().parents[1]
identity=json.loads((root/'resources/signing-identity.json').read_text())
config=json.loads((a.vault/'signing-private.json').read_text())
assert config['applicationId']==identity['applicationId']
assert config['alias']==identity['alias']
assert not a.output.exists(), 'Never overwrite a delivered APK'
build=(root/'android/app/build.gradle').read_text()
version=int(re.search(r'versionCode (\d+)',build).group(1))
version_name=re.search(r'versionName "([^"]+)"',build).group(1)
assert identity['applicationId'] in build
package=(a.input.parent/'package.txt').read_text()
for text in ["name='"+identity['applicationId']+"'",f"versionCode='{version}'",f"versionName='{version_name}'","sdkVersion:'24'"]:
 assert text in package,text
assert 'application-debuggable' not in package
state=a.vault/'last-delivery.json'
if state.exists():
 previous=json.loads(state.read_text())
 assert previous['certificateSha256']==identity['certificateSha256']
 assert version>previous['versionCode'],'versionCode must increase for every signed delivery'
env=os.environ.copy()
env['BP_STORE_PASSWORD']=config['storePassword'];env['BP_KEY_PASSWORD']=config['keyPassword']
def run(args):
 result=subprocess.run([str(a.java),'-jar',str(a.apksigner),*args],env=env,capture_output=True,text=True)
 if result.returncode:raise RuntimeError('apksigner failed; no APK delivered (exit '+str(result.returncode)+')')
 return result.stdout
with tempfile.TemporaryDirectory(prefix='boutiquepilot-sign-') as tmp:
 signed=Path(tmp)/'signed.apk'
 run(['sign','--ks',str(a.vault/'boutiquepilot-app.p12'),'--ks-type','PKCS12','--ks-key-alias',identity['alias'],'--ks-pass','env:BP_STORE_PASSWORD','--key-pass','env:BP_KEY_PASSWORD','--min-sdk-version','24','--out',str(signed),str(a.input)])
 proof=run(['verify','--verbose','--print-certs','--min-sdk-version','24','--max-sdk-version','36',str(signed)])
 fingerprint=re.search(r'Signer #1 certificate SHA-256 digest: ([0-9a-f]+)',proof).group(1)
 assert fingerprint==identity['certificateSha256'],'Unexpected signing identity'
 with zipfile.ZipFile(signed) as z,zipfile.ZipFile(a.input) as original:
  assert z.testzip() is None
  for n in original.namelist():assert original.read(n)==z.read(n),n
  assert not any(n.endswith(('.p12','.jks','.keystore','.pem','.env')) for n in z.namelist())
 a.output.parent.mkdir(parents=True,exist_ok=True)
 shutil.copyfile(signed,a.output)
 digest=hashlib.sha256(a.output.read_bytes()).hexdigest()
 a.output.with_suffix('.signature.txt').write_text(proof)
 a.output.with_suffix('.sha256').write_text(digest+'  '+a.output.name+'\n')
 receipt={'applicationId':identity['applicationId'],'versionCode':version,'versionName':version_name,'certificateSha256':fingerprint,'apkSha256':digest}
 state.write_text(json.dumps(receipt,indent=2)+'\n')
 print(json.dumps(receipt,indent=2))
