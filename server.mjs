import http from 'node:http';
const port=Number(process.env.PORT||10000);
http.createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.url==='/api/health'){
  res.writeHead(200,{'Content-Type':'application/json'});
  return res.end(JSON.stringify({ok:false,state:'awaiting_demo_bundle',message:'Temporary demo package upload not yet completed'}));
 }
 res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
 res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>TerraForge Test Server</title><body style="background:#08141b;color:#e4f8ef;font:16px system-ui;padding:30px;max-width:540px;margin:auto"><h1>TerraForge 4.0</h1><p>Temporary server provisioned. The encrypted game package has not been uploaded yet.</p><p>The complete game will appear here after the two files are uploaded and the deployment completes.</p></body>');
}).listen(port,'0.0.0.0',()=>console.log('TerraForge staging server on port '+port));
