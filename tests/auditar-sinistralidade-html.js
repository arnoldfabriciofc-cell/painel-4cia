// Audita os dados embutidos no sinistralidade.html oficial (somente leitura).
// Uso: node tests/auditar-sinistralidade-html.js
const fs=require("node:fs");
const assert=require("node:assert/strict");
const path=require("node:path");
const filtro=require("../src/filtro-sinistralidade.js");
const file=path.join(__dirname,"..","sinistralidade.html");
const html=fs.readFileSync(file,"utf8");
const match=html.match(/\bvar\s+DATA\s*=\s*(\[[\s\S]*?\])\s*;/);
assert(match,"Não foi possível localizar o array DATA do HTML");
const registros=JSON.parse(match[1]);
const resumo=filtro.resumo(registros);
const porAno={};
for(const r of registros){
  const ano=String(r.data||"").slice(0,4);
  if(!porAno[ano]) porAno[ano]={registros:0,acidentes:0,outrasNaturezas:0};
  porAno[ano].registros++;
  if(filtro.ehAcidente(r)) porAno[ano].acidentes++;
  else porAno[ano].outrasNaturezas++;
}
const relatorio={
  fonte:"sinistralidade.html (branch em análise)",
  modo:"somente leitura",
  registros:registros.length,
  ...resumo,
  porAno
};
console.log(JSON.stringify(relatorio,null,2));
if(resumo.duplicados.length) {
  console.error("ERRO: BO-e duplicados detectados");
  process.exitCode=1;
}
if(!registros.length) {
  console.error("ERRO: base vazia");
  process.exitCode=1;
}
