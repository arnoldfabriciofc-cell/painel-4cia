const assert=require("node:assert/strict");
const {plano}=require("../src/planejar-importacao-boe.js");
const atual=[
 {boe:"503994",rso:"100",hora_sinistro:"12:10",rodovia:"000/330",vitimas_graves:2,vitimas_fatais:2},
 {boe:"504195",rso:"101",hora_sinistro:"13:00",rodovia:"270/350"}
];
const lote=[
 {boe:"503994",rso:"100",hora_sinistro:"12:10",rodovia:"000/330",vitimas_graves:2,vitimas_fatais:2},
 {boe:"504195",rso:"101",hora_sinistro:"13:00",rodovia:"000/350"},
 {boe:"504999",rso:"101",hora_sinistro:"14:00",rodovia:"000/330",vitimas_leves:1}
];
const p=plano(atual,lote);
assert.equal(p.aprovado,true);
assert.deepEqual(p.totais,{atuais:2,recebidos:3,inserir:1,iguais:1,revisar:1,erros:0});
assert.equal(p.revisar[0].boe,"504195");
assert.equal(p.revisar[0].mudancas.rodovia.antes,"270/350");
assert.equal(p.revisar[0].mudancas.rodovia.depois,"000/350");
assert.equal(plano(atual,[lote[2],lote[2]]).aprovado,false);
assert.equal(plano(atual,[{boe:"503994",rso:"OUTRO"}]).aprovado,false);
assert.equal(plano(atual,[{boe:"503994",hora_sinistro:"22:00"}]).aprovado,false);
assert.equal(plano(atual,[{boe:"504888",vitimas_graves:-1}]).aprovado,false);
assert.equal(plano(atual,[{boe:"504888",data_sinistro:"31/10/2026"}]).aprovado,false);
assert.equal(plano([{boe:"123"},{boe:"123"}],[]).aprovado,false);
assert.equal(plano(atual,[{boe:"504888",data_sinistro:"2026-02-29"}]).aprovado,false);
assert.equal(plano(atual,[{boe:"504888",data_sinistro:"2026-09-29",ano:2026,mes:10}]).aprovado,false);
assert.equal(plano(atual,[{boe:"504888",data_sinistro:"2026-09-29",ano:2026,mes:9}]).aprovado,true);
assert.equal(plano(atual,[]).aprovado,false);
assert.equal(plano(atual,[]).erros.some(x=>x.includes("Lote vazio")),true);
const baseData=[{boe:"504408",data_sinistro:"2026-10-05",ano:2026,mes:10}];
assert.equal(plano(baseData,[{boe:"504408",data_sinistro:"2026-09-29"}]).aprovado,false);
assert.equal(plano(baseData,[{boe:"504408",data_sinistro:"2026-09-29",ano:2026}]).aprovado,false);
const correcao=plano(baseData,[{boe:"504408",data_sinistro:"2026-09-29",ano:2026,mes:9}]);
assert.equal(correcao.aprovado,true);
assert.equal(correcao.totais.revisar,1);
assert.equal(correcao.revisar[0].mudancas.mes.depois,9);
console.log("OK: inserções, revisão, duplicatas, campos protegidos, datas e lote vazio");
