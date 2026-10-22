const assert=require("node:assert/strict");
const {gerar}=require("../src/relatorio-prontidao-boe.js");
const {ITENS}=require("../src/checklist-homologacao-boe.js");
const ok=Object.fromEntries(ITENS.map(k=>[k,true]));
const novo=[{boe:"900001",data_sinistro:"2026-10-01"}];
const pendente=gerar([],novo,{});
assert.equal(pendente.pronto_para_analise,false);
assert.equal(pendente.homologacao.pendentes.length,ITENS.length);
assert.equal(pendente.impedimentos.includes("HOMOLOGACAO_INCOMPLETA"),true);
const pronto=gerar([],novo,ok);
assert.equal(pronto.pronto_para_analise,true);
assert.equal(pronto.completude.completo,true);
assert.equal(pronto.gravacao_autorizada,false);
const revisar=gerar([{boe:"900001",rodovia:"330"}],[{boe:"900001",rodovia:"348"}],ok);
assert.equal(revisar.impedimentos.includes("ALTERACOES_EXIGEM_REVISAO"),true);
const invalido=gerar([], [{boe:"900001"},{boe:"900001"}],ok);
assert.equal(invalido.impedimentos.includes("LOTE_INVALIDO_OU_BASE_INCONSISTENTE"),true);
for(const item of [pendente,pronto,revisar,invalido]){
 assert.equal(item.gravacao_autorizada,false);
 assert.equal(JSON.stringify(item).includes("900001"),false);
 assert.equal(JSON.stringify(item).includes("rodovia"),false);
}
const incompleto=gerar([],[{boe:"900005"}],ok);
assert.equal(incompleto.completude.novos_sem_data,1);
assert.equal(incompleto.impedimentos.includes("NOVOS_REGISTROS_INCOMPLETOS"),true);
assert.equal(incompleto.pronto_para_analise,false);
console.log("OK: relatório agregado de prontidão, pendências e bloqueio permanente de escrita");
