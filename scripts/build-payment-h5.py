from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1]
src=root.parent/'wellnesshub-h5-react-demo/dist/client'; dst=root/'h5-payment'
if dst.exists(): shutil.rmtree(dst)
shutil.copytree(src,dst)
# Deployment-only relocation, leaving protected mobile runtime source untouched.
for p in dst.rglob('*'):
 if p.suffix in ('.html','.js','.css'):
  s=p.read_text();s=s.replace('"/assets/','"./assets/').replace("'/assets/","'./assets/").replace('`/assets/','`./assets/').replace('url(/assets/','url(../assets/');p.write_text(s)
print(dst)
