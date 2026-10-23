# Build through tools/package_study.py, which stages validated web assets.
import os
from pathlib import Path
import sys

root = Path(SPECPATH).parent
web = Path(os.environ['NETWORK_STUDY_WEB_DIR'])
folder = os.environ['NETWORK_STUDY_BUNDLE_MODE'] == 'onedir'
a = Analysis(
    [str(root / 'tools/serve_study.py')],
    pathex=[], binaries=[], datas=[(str(web), 'web')],
    hiddenimports=[], hookspath=[], hooksconfig={}, runtime_hooks=[], excludes=[],
    noarchive=False,
)
pyz = PYZ(a.pure)
options = dict(name='network-study', debug=False, strip=False, upx=False,
               console=sys.platform not in ('win32', 'darwin'))
if folder:
    exe = EXE(pyz, a.scripts, [], exclude_binaries=True, **options)
    collected = COLLECT(exe, a.binaries, a.datas, strip=False, upx=False, name='network-study')
    if sys.platform == 'darwin':
        app = BUNDLE(collected, name='Network Study.app', bundle_identifier='org.networkstudy.local',
                     version=os.environ['NETWORK_STUDY_VERSION'].split('-')[0],
                     info_plist={'NSHighResolutionCapable': True})
else:
    exe = EXE(pyz, a.scripts, a.binaries, a.datas, [], **options)
