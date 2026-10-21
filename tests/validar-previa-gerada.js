// Confere se o HTML gerado contém somente acidentes e mantém indicadores consistentes.
// Uso: node tests/validar-previa-gerada.js
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const filtro=require("../src/filtro-sinistralidade.js");
const root=path.join(__dirname,"..");
const original=fs.readFileSync(path.join(root,"sinistralidade.html"),"utf8");
const previa=fs.readFileSync(path.join(root,"dist","sinistralidade-previa-filtrada.html"),"utf8");
function extrair(html){
  const m=html.match(/\bvar DATA=(\[[\s\S]*?\]);\s*function uniq\(/);
  assert(m,"DATA ausente do HTML");
  return JSON.parse(m[1]);
}
const antes=extrair(original),depois=extrair(previa);
const esperado=filtro.filtrarAcidentes(antes);
assert.equal(depois.length,esperado.length);
assert.deepEqual(depois,esperado);
assert(depois.every(filtro.ehAcidente),"Prévia contém outra natureza");
assert(!previa.includes("DATA_BRUTA"),"Prévia não deve incluir cópia integral da base");
const relatorio=JSON.parse(fs.readFileSync(path.join(root,"dist","relatorio-previa.json"),"utf8"));
assert.equal(relatorio.registrosOriginais,antes.length);
assert.equal(relatorio.acidentes,depois.length);
assert.equal(relatorio.outrasNaturezasExcluidas,antes.length-depois.length);
assert.equal(antes.length,2502);
assert.equal(depois.length,2269);
console.log("OK: prévia contém apenas "+depois.length+" acidentes; "+(antes.length-depois.length)+" outras naturezas removidas do HTML gerado");
