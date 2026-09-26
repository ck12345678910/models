import {existsSync,readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {createHash,createDecipheriv} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const names=['TerraForge_Demo_Encrypted_Part_1.bin','TerraForge_Demo_Encrypted_Part_2.bin'];
if(!names.every(n=>existsSync(n))){
 console.log('Demo package not yet uploaded: starter page will remain available');
 process.exit(0);
}
const key=process.env.TF_DEMO_BUNDLE_KEY;
if(!key||!/^[0-9a-f]{64}$/i.test(key))throw Error('Missing private Render demo package key');
const encrypted=Buffer.concat(names.map(n=>readFileSync(n)));
const sha=s=>createHash('sha256').update(s).digest('hex');
if(sha(encrypted)!=='d2ee07ca4d5d1bce76545c1ee6cae09c4d289d8b7226dfbdb578cec0dba53594')throw Error('Incomplete or altered encrypted game package');
const nonce=encrypted.subarray(0,12),tag=encrypted.subarray(-16),payload=encrypted.subarray(12,-16);
const d=createDecipheriv('aes-256-gcm',Buffer.from(key,'hex'),nonce);d.setAuthTag(tag);
const zip=Buffer.concat([d.update(payload),d.final()]);
if(sha(zip)!=='abd973d60ada7660a96ebf310ee956b4b7700c1dc11571abc60d3f0ea92b71bf')throw Error('Demo package integrity failure');
writeFileSync('.demo-runtime.zip',zip,{mode:0o600});
try{
 try{execFileSync('unzip',['-q','-o','.demo-runtime.zip','-d',process.cwd()],{stdio:'inherit'});}
 catch{execFileSync('python3',['-m','zipfile','-e','.demo-runtime.zip',process.cwd()],{stdio:'inherit'});}
} finally{unlinkSync('.demo-runtime.zip');}
console.log('Verified TerraForge 4.0 demo installed');
