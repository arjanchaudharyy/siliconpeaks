import './build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Export only public assets. The upstream Cloudflare configuration is unchanged.
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output=path.join(root,'dist');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
for(const file of ['index.html','companies','startups','investors','assets','logos','sitemap.xml','llms.txt','llms-full.txt','lms.txt','humans.txt']){
 fs.cpSync(path.join(root,file),path.join(output,file),{recursive:true});
}
// This deployment is a review copy. Canonicals still identify siliconpeaks.com.
fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('Built the isolated Vercel review site in dist/.');
