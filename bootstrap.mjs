import {existsSync,readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {createHash,createDecipheriv} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const names=Array.from({length:33},(_,i)=>`demo-parts/part-${String(i).padStart(3,'0')}.b64`);
if(!names.every(existsSync)) throw Error('Incomplete encrypted TerraForge demo payload');
const key=process.env.TF_DEMO_BUNDLE_KEY;
if(!key||!/^[0-9a-f]{64}$/i.test(key)) throw Error('Missing private Render demo package key');
const encrypted=Buffer.concat(names.map(n=>Buffer.from(readFileSync(n,'utf8').trim(),'base64')));
const nonce=encrypted.subarray(0,12),tag=encrypted.subarray(-16),payload=encrypted.subarray(12,-16);
const d=createDecipheriv('aes-256-gcm',Buffer.from(key,'hex'),nonce);d.setAuthTag(tag);
const zip=Buffer.concat([d.update(payload),d.final()]);
const sha=createHash('sha256').update(zip).digest('hex');
if(sha!=='abd973d60ada7660a96ebf310ee956b4b7700c1dc11571abc60d3f0ea92b71bf') throw Error('TerraForge runtime integrity failure');
writeFileSync('.demo-runtime.zip',zip,{mode:0o600});
try{try{execFileSync('unzip',['-q','-o','.demo-runtime.zip','-d',process.cwd()],{stdio:'inherit'});}catch{execFileSync('python3',['-m','zipfile','-e','.demo-runtime.zip',process.cwd()],{stdio:'inherit'});}}finally{unlinkSync('.demo-runtime.zip');}
console.log('Verified TerraForge 4.0 guest test world runtime installed');
