import { cpSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const [source, destination] = process.argv.slice(2);
if (!source || !destination || !existsSync(path.join(source, 'index.html'))) throw new Error('Valid build source and destination required');
if (existsSync(destination)) throw new Error('Destination must be new');
cpSync(source, destination, {recursive:true});
// Adapt only generated assets; keep the protected mobile runtime unchanged.
const prefix='/visbody-demo/wellnesshub-h5/assets/';
function walk(dir){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())walk(file);
    else if(/\.(html|js|css)$/.test(entry.name)){
      writeFileSync(file,readFileSync(file,'utf8').replaceAll('/assets/',prefix));
    }
  }
}
walk(destination);
