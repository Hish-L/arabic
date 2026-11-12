import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
function run(command,args,capture=false){const r=spawnSync(command,args,{cwd:root,encoding:'utf8',stdio:capture?'pipe':'inherit'});if(r.error)throw r.error;if(r.status!==0)throw new Error(`${command} ${args.slice(0,2).join(' ')} failed.${capture?' '+r.stderr:''}`);return r.stdout?.trim()}
try {
 const owner=run('gh',['api','user','--jq','.login'],true);
 // This helper only creates a new repository; it never overwrites an existing remote.
 const remote=spawnSync('git',['remote','get-url','origin'],{cwd:root,encoding:'utf8'});
 if(remote.status===0)throw new Error('An origin remote already exists. Use git push and the existing repository instead.');
 run('npm',['test']);run('npm',['run','build:pages']);
 if(!existsSync('.git'))run('git',['init','-b','main']);
 const branch=run('git',['branch','--show-current'],true);
 if(branch!=='main')throw new Error('Switch this checkout to main before publishing.');
 run('git',['add','.']);
 const changed=spawnSync('git',['diff','--cached','--quiet'],{cwd:root});
 if(changed.status===1)run('git',['commit','-m','Build Arabic letter learning game and GitHub Pages deployment']);
 else if(changed.status!==0)throw new Error('Could not check staged changes.');
 run('gh',['repo','create',`${owner}/arabic`,'--private','--source=.','--remote=origin','--description','Arabic letter learning games for children']);
 const pages=spawnSync('gh',['api',`repos/${owner}/arabic/pages`,'--method','POST','-f','build_type=workflow'],{cwd:root,stdio:'inherit'});
 run('git',['push','-u','origin','main']);
 console.log(`Private repository: https://github.com/${owner}/arabic`);
 if(pages.status!==0)throw new Error('Repository pushed, but Pages could not be enabled. Check your GitHub plan and repository Settings → Pages. The repository remains private.');
 console.log(`Deployment started. Track it with: gh run list --repo ${owner}/arabic`);
 console.log(`Site URL after deployment: https://${owner.toLowerCase()}.github.io/arabic/`);
} catch(error){console.error(error.message);process.exitCode=1}
