"""Capture the unchanged signed beta 4 APK in an Android emulator, using Android UI only."""
import subprocess,time,pathlib,hashlib,json,xml.etree.ElementTree as ET,re
out=pathlib.Path('capture-output');out.mkdir(exist_ok=True)
def adb(*args):return subprocess.check_output(['adb',*args],timeout=90)
def shell(*args):return adb('shell',*args).decode().strip()
def capture(name):
 (out/(name+'.png')).write_bytes(adb('exec-out','screencap','-p'))
 shell('uiautomator','dump','/sdcard/window.xml')
 xml=adb('exec-out','cat','/sdcard/window.xml');(out/(name+'.xml')).write_bytes(xml)
 return ET.fromstring(xml)
def tap_text(text):
 root=capture('navigation-state')
 for n in root.iter('node'):
  if text in (n.get('text','')+' '+n.get('content-desc','')):
   b=list(map(int,re.findall(r'\d+',n.get('bounds'))))
   if b[2]>b[0] and b[3]>b[1]:
    shell('input','tap',str((b[0]+b[2])//2),str((b[1]+b[3])//2));time.sleep(2);return
 raise RuntimeError('Visible Android control not found: '+text)
shell('wm','size','1080x1920');shell('wm','density','400')
shell('settings','put','global','sysui_demo_allowed','1')
shell('am','broadcast','-a','com.android.systemui.demo','-e','command','clock','-e','hhmm','1000')
shell('am','broadcast','-a','com.android.systemui.demo','-e','command','notifications','-e','visible','false')
shell('am','broadcast','-a','com.android.systemui.demo','-e','command','battery','-e','level','100','-e','plugged','false')
adb('install','/tmp/beta4.apk')
shell('am','start','-n','com.morashawiri.boutiquepilot/.MainActivity');time.sleep(12)
capture('01-tableau-de-bord')
(out/'provenance.json').write_text(json.dumps({'apkSHA256':hashlib.sha256(pathlib.Path('/tmp/beta4.apk').read_bytes()).hexdigest(),'android':shell('getprop','ro.build.version.release'),'api':shell('getprop','ro.build.version.sdk'),'fingerprint':shell('getprop','ro.build.fingerprint'),'capture':'adb exec-out screencap -p','data':'Fresh install with integrated demonstration data','display':shell('wm','size'),'density':shell('wm','density')},indent=2))
tap_text('Modules');capture('modules')
