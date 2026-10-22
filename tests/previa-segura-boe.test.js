const assert=require("node:assert/strict");
const {simular}=require("../src/previa-segura-boe.js");
const base=[{boe:"123456",rodovia:"330",data_sinistro:"2026-10-01",ano:2026,mes:10}];
const limpo=simular(base,[{boe:"123456",rodovia:"330",data_sinistro:"2026-10-01",ano:2026,mes:10},{boe:"123457",data_sinistro:"2026-10-02",ano:2026,mes:10}]);
assert.equal(limpo.contagens.inserir,1);
assert.equal(limpo.contagens.iguais,1);
assert.equal(limpo.gravacao_autorizada,false);
assert.deepEqual(limpo.motivos_bloqueio,[]);
const revisar=simular(base,[{boe:"123456",rodovia:"348"}]);
assert.equal(revisar.revisao_necessaria,true);
assert.equal(revisar.gravacao_autorizada,false);
assert.equal(revisar.motivos_bloqueio.includes("ALTERACOES_PENDENTES"),true);
const invalido=simular([], [{boe:"123456"},{boe:"123456"}]);
assert.equal(invalido.motivos_bloqueio.includes("REGISTROS_INVALIDOS"),true);
for(const resultado of [limpo,revisar,invalido]){
 const serial=JSON.stringify(resultado);
 assert.equal(serial.includes("123456"),false);
 assert.equal(serial.includes("123457"),false);
 assert.equal(serial.includes("rodovia"),false);
 assert.equal(serial.includes("data_sinistro"),false);
}
console.log("OK: prévia consolidada anônima, bloqueios e sem gravação");
