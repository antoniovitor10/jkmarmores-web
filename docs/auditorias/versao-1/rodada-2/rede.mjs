import fs from 'node:fs/promises';
import ts from 'typescript';
import vm from 'node:vm';
const source=await fs.readFile('src/lib/motion-network.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const sample=(ttfb,body,bytes=22130)=>({startTime:0,responseStart:ttfb,responseEnd:ttfb+body,encodedBodySize:bytes,transferSize:bytes+300});
const cases=[
 {name:'Chrome público: downlink 1.45, transferência rápida',connection:{saveData:false,effectiveType:'4g',downlink:1.45},nav:sample(119,39),expected:'allowed'},
 {name:'Save-Data prevalece sobre transferência rápida',connection:{saveData:true,effectiveType:'4g',downlink:10},nav:sample(119,39),expected:'slow-connection'},
 {name:'3g explícito permanece estático',connection:{saveData:false,effectiveType:'3g',downlink:10},nav:sample(119,39),expected:'slow-connection'},
 {name:'Resposta lenta com estimativa otimista',connection:{saveData:false,effectiveType:'4g',downlink:10},nav:sample(800,39),expected:'slow-response'},
 {name:'Transferência efetivamente lenta',connection:{saveData:false,effectiveType:'4g',downlink:10},nav:sample(100,1000),expected:'slow-response'},
 {name:'Estimativa baixa sem amostra suficiente',connection:{saveData:false,effectiveType:'4g',downlink:1.45},nav:sample(100,100,1000),expected:'slow-connection'},
 {name:'Sem API de rede, amostra rápida',nav:sample(119,39),expected:'allowed'},
 {name:'Sem API nem medição',expected:'unmeasured'},
];
const results=cases.map(test=>{const exports={};vm.runInNewContext(code,{exports,performance:{getEntriesByType:type=>type==='navigation'&&test.nav?[test.nav]:[]}});const actual=exports.motionNetworkPolicy(test.connection);return {name:test.name,expected:test.expected,actual,passed:actual===test.expected};});
await fs.writeFile('docs/auditorias/versao-1/rodada-2/rede.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));if(results.some(result=>!result.passed))process.exitCode=1;
