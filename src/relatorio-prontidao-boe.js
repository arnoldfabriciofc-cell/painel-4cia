/* Relatório agregado de prontidão; não é autorização de implantação. */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./previa-segura-boe.js"),require("./checklist-homologacao-boe.js"),require("./verificar-completude-boe.js"));
 else root.PainelBoeProntidao=factory(root.PainelBoePrevia,root.PainelBoeHomologacao,root.PainelBoeCompletude);
})(typeof globalThis!=="undefined"?globalThis:this,function(previa,homologacao,completude){
 "use strict";
 function gerar(atuais,novos,evidencias){
  const lote=previa.simular(atuais,novos);
  const seguranca=homologacao.avaliar(evidencias);
  const campos=completude.verificar(atuais,novos);
  const impedimentos=[];
  if(lote.situacao==="BLOQUEADO")impedimentos.push("LOTE_INVALIDO_OU_BASE_INCONSISTENTE");
  if(lote.revisao_necessaria)impedimentos.push("ALTERACOES_EXIGEM_REVISAO");
  if(!campos.completo)impedimentos.push("NOVOS_REGISTROS_INCOMPLETOS");
  if(!seguranca.checklist_completo)impedimentos.push("HOMOLOGACAO_INCOMPLETA");
  return Object.freeze({
   tipo:"RELATÓRIO DE PRONTIDÃO — SIMULAÇÃO",
   importacao:lote,
   completude:campos,
   homologacao:Object.freeze({total:seguranca.total,confirmados:seguranca.confirmados,pendentes:seguranca.pendentes}),
   impedimentos:Object.freeze(impedimentos),
   pronto_para_analise:impedimentos.length===0,
   gravacao_autorizada:false,
   aviso:"Relatório declarativo e local. Não valida permissões reais nem permite escrita."
  });
 }
 return {gerar};
});
