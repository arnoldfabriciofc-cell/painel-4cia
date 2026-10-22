/* Orquestrador de prévia: saída exclusivamente agregada, sem gravação. */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./planejar-importacao-boe.js"),require("./resumo-seguro-importacao.js"),require("./portao-importacao-boe.js"));
 else root.PainelBoePrevia=factory(root.PainelBoeImportacao,root.PainelResumoImportacao,root.PainelBoePortao);
})(typeof globalThis!=="undefined"?globalThis:this,function(importacao,resumos,portao){
 "use strict";
 function simular(atuais,novos){
   const plano=importacao.plano(atuais,novos);
   const resumo=resumos.resumoSeguro(plano);
   const seguranca=portao.avaliar(plano);
   return Object.freeze({
     tipo:"PRÉVIA LOCAL SEM GRAVAÇÃO",
     situacao:resumo.situacao,
     contagens:resumo.contagens,
     conferencia:resumo.conferencia,
     motivos_bloqueio:seguranca.motivos,
     revisao_necessaria:seguranca.requer_revisao,
     gravacao_autorizada:false,
     aviso:"Dados individuais omitidos. Conferência e autenticação reais são necessárias antes de qualquer integração."
   });
 }
 return {simular};
});
