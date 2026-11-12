import {spawnSync} from 'node:child_process';
import {mkdtemp,readFile,writeFile,mkdir,rename,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const directory=fileURLToPath(new URL('../public/audio/',import.meta.url));
const clips=[['seen','seen'],['sheen','sheen'],['sa','sah'],['sha','shah']];
function hasAudio(b){
 if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WAVE')return false;
 for(let p=12;p+8<=b.length;){const size=b.readUInt32LE(p+4);if(p+8+size>b.length)return false;if(b.toString('ascii',p,p+4)==='data'){if(size<4000)return false;let peak=0;for(let n=p+8;n+1<p+8+size;n+=2)peak=Math.max(peak,Math.abs(b.readInt16LE(n)));return peak>100}p+=8+size+(size%2)}return false;
}
if((await Promise.all(clips.map(async([id])=>{try{return hasAudio(await readFile(path.join(directory,id+'.wav')))}catch{return false}}))).every(Boolean)){console.log('Pronunciation clips ready.');process.exit(0)}
if(process.platform!=='darwin'){console.error('Create the four clips on a Mac using npm run audio:setup, then copy public/audio with the project.');process.exit(1)}
const temporary=await mkdtemp(path.join(tmpdir(),'seen-sheen-audio-'));
try{
 await mkdir(directory,{recursive:true});
 for(const [id,text] of clips){
  const aiff=path.join(temporary,id+'.aiff'),wav=path.join(temporary,id+'.wav');
  const voice=spawnSync('/usr/bin/say',['-v','Samantha','-r','125','-o',aiff,text],{encoding:'utf8'});
  if(voice.status!==0)throw new Error('The Mac voice could not run.');
  const conversion=spawnSync('/usr/bin/afconvert',['-f','WAVE','-d','LEI16',aiff,wav],{encoding:'utf8'});
  if(conversion.status!==0)throw new Error('The voice recording could not be converted.');
  const bytes=await readFile(wav);
  if(!hasAudio(bytes))throw new Error(`The ${id} recording is empty or silent. Run this command in your Mac Terminal, outside the restricted agent environment.`);
 }
 for(const [id] of clips)await rename(path.join(temporary,id+'.wav'),path.join(directory,id+'.wav'));
 await writeFile(path.join(directory,'README.txt'),'Built-in macOS Samantha voice. English approximations: seen, sheen, sah, shah. Generated locally; no API or browser speech dependency.\n');
 console.log('Saved four pronunciation clips in public/audio.');
}catch(error){console.error(error.message);process.exitCode=1}finally{await rm(temporary,{recursive:true,force:true})}
