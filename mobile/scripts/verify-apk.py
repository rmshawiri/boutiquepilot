"""Check APK structure and exact offline payload; does not pretend to run Android."""
from pathlib import Path
import hashlib, sys, zipfile

apk=Path(sys.argv[1])
with zipfile.ZipFile(apk) as z:
    assert z.testzip() is None, 'Corrupt APK entry'
    names=set(z.namelist())
    assert 'AndroidManifest.xml' in names and 'classes.dex' in names
    for name in ['index.html','android.js','android.css','android-icon.png']:
        assert z.read('assets/public/'+name)==(Path('www')/name).read_bytes(), name
    source=z.read('assets/public/index.html').decode('utf-8')
    source=source.replace('<link rel="stylesheet" href="android.css">\n','').replace('<script src="android.js"></script>\n','')
    assert hashlib.sha256(source.encode('utf-8')).hexdigest()=='4ecb9146067438df0da2fa74e367118dc3e0b28496f5e7fda076fcced4dbb6e5'
    assert not any(n.endswith(('.jks','.keystore','.pem','.env')) or 'Informations des comptes' in n for n in names)
    assert not any(n.startswith('lib/') for n in names), 'Review native library alignment before delivery'
print('APK ZIP/DEX/manifest and exact local payload: OK; no signing key or confidential file packaged.')
