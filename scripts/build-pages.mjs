import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const result=spawnSync(process.execPath,[fileURLToPath(new URL('../node_modules/next/dist/bin/next',import.meta.url)),'build','--webpack'],{cwd:root,stdio:'inherit',env:{...process.env,GITHUB_PAGES:'true'}});
if(result.error)throw result.error;
process.exit(result.status??1);
