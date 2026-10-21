// Execute: node tests/filtro-sinistralidade.test.js
const assert=require("node:assert/strict");
const filtro=require("../src/filtro-sinistralidade.js");
const base=[
  {boe:"1",natureza:"ACIDENTE DE TRÂNSITO COM VÍTIMA",leve:1,grave:0,fatal:0},
  {boe:"2",natureza:"Acidente de Transito sem vitima",leve:0,grave:0,fatal:0},
  {boe:"3",natureza:"DANO MATERIAL",leve:0,grave:0,fatal:0},
  {boe:"4",natureza:"OUTRA OCORRÊNCIA",leve:0,grave:0,fatal:0},
  {boe:"5",natureza:"ACIDENTE DE TRÂNSITO COM VÍTIMA",leve:0,grave:2,fatal:2}
];
assert.deepEqual(filtro.resumo(base),{
  acidentes:3,outrasNaturezas:2,
  vitimas:{leves:1,graves:2,fatais:2},duplicados:[]
});
assert.equal(filtro.ehAcidente({natureza:"NÃO ACIDENTE DE TRÂNSITO"}),false);
assert.equal(filtro.ehAcidente({natureza:"DANO MATERIAL",tipo:"Colisão",grave:1}),false);
assert.equal(filtro.ehAcidente({natureza:""}),false);
assert.deepEqual(filtro.resumo([base[0],base[0]]).duplicados,["1"]);
assert.throws(()=>filtro.resumo([{boe:"6",natureza:"ACIDENTE DE TRÂNSITO",leve:-1,grave:0,fatal:0}]),/Contagem inválida/);
assert.throws(()=>filtro.filtrarAcidentes({}),/array/);
console.log("OK: classificação, exclusões, vítimas, duplicatas e validação");
