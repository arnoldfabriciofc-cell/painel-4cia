const assert=require("node:assert/strict");
const {plano}=require("../src/planejar-importacao-boe.js");
const {resumoSeguro}=require("../src/resumo-seguro-importacao.js");
const {avaliar}=require("../src/portao-importacao-boe.js");
const {simular}=require("../src/previa-segura-boe.js");
const cenarios=[
 {nome:"insercao",atuais:[],novos:[{boe:"900001"}],situacao:"PRONTO PARA CONFERÊNCIA",motivo:null},
 {nome:"historico duplicado",atuais:[{boe:"900001"},{boe:"900001"}],novos:[{boe:"900002"}],situacao:"BLOQUEADO",motivo:"PLANO_NAO_APROVADO"},
 {nome:"lote duplicado",atuais:[],novos:[{boe:"900001"},{boe:"900001"}],situacao:"BLOQUEADO",motivo:"REGISTROS_INVALIDOS"},
 {nome:"alteracao",atuais:[{boe:"900001",rodovia:"330"}],novos:[{boe:"900001",rodovia:"348"}],situacao:"REVISÃO DE ALTERAÇÕES NECESSÁRIA",motivo:"ALTERACOES_PENDENTES"},
 {nome:"lote vazio",atuais:[],novos:[],situacao:"BLOQUEADO",motivo:"LOTE_VAZIO"},
 {nome:"data invalida",atuais:[],novos:[{boe:"900001",data_sinistro:"2026-02-30"}],situacao:"BLOQUEADO",motivo:"REGISTROS_INVALIDOS"}
];
for(const c of cenarios){
 const p=plano(c.atuais,c.novos),resumo=resumoSeguro(p),portao=avaliar(p),previa=simular(c.atuais,c.novos);
 assert.equal(resumo.situacao,c.situacao,c.nome);
 assert.equal(previa.situacao,c.situacao,c.nome);
 assert.equal(previa.gravacao_autorizada,false,c.nome);
 assert.equal(portao.pode_gravar,false,c.nome);
 if(c.motivo)assert.equal(portao.motivos.includes(c.motivo),true,c.nome);
 assert.equal(JSON.stringify(previa).includes("900001"),false,c.nome);
 assert.equal(JSON.stringify(previa).includes("900002"),false,c.nome);
 assert.equal(p.totais.recebidos,p.totais.inserir+p.totais.iguais+p.totais.revisar+p.totais.erros,c.nome);
}
console.log("OK: seis cenários integrados de importação, sem gravação");
