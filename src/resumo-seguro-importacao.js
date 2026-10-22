/* Resumo seguro do planejamento: sem BO-e, RSO ou dados individuais.
 * Não conecta ao Supabase e não autoriza gravação.
 */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.PainelResumoImportacao=factory();
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function resumoSeguro(plano){
   if(!plano||plano.modo!=="SOMENTE SIMULAÇÃO"||!plano.totais)throw TypeError("Plano de simulação inválido");
   const t=plano.totais;
   const campos=["atuais","recebidos","inserir","iguais","revisar","erros"];
   for(const campo of campos){
     if(!Number.isSafeInteger(t[campo])||t[campo]<0)throw TypeError("Contagem inválida: "+campo);
   }
   const consistente=t.recebidos===t.inserir+t.iguais+t.revisar+t.erros;
   const bloqueado=t.erros>0||t.recebidos===0||!consistente||plano.aprovado!==true;
   const pendencias=t.revisar>0;
   return {
     tipo:"RESUMO ANÔNIMO DE SIMULAÇÃO",
     situacao:bloqueado?"BLOQUEADO":pendencias?"REVISÃO DE ALTERAÇÕES NECESSÁRIA":"PRONTO PARA CONFERÊNCIA",
     gravacao_autorizada:false,
     contagens:Object.fromEntries(campos.map(c=>[c,t[c]])),
     conferencia:{lote_nao_vazio:t.recebidos>0,sem_erros:t.erros===0&&plano.aprovado===true,contagens_consistentes:consistente,alteracoes_pendentes:pendencias},
     aviso:"Não contém registros individuais e não executa importação."
   };
 }
 return {resumoSeguro};
});
