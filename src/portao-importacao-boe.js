/* Portão de segurança para o planejamento BO-e.
 * Não grava no banco, não aprova alterações e não retorna registros.
 */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.PainelBoePortao=factory();
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function avaliar(plano){
   if(!plano||plano.modo!=="SOMENTE SIMULAÇÃO"||!plano.totais)throw TypeError("Plano inválido");
   const t=plano.totais;
   for(const nome of ["atuais","recebidos","inserir","iguais","revisar","erros"]){
     if(!Number.isSafeInteger(t[nome])||t[nome]<0)throw TypeError("Contagem inválida");
   }
   const completo=t.recebidos===t.inserir+t.iguais+t.revisar+t.erros;
   const motivos=[];
   if(!t.recebidos)motivos.push("LOTE_VAZIO");
   if(t.erros)motivos.push("REGISTROS_INVALIDOS");
   if(!completo)motivos.push("CONTAGENS_INCONSISTENTES");
   if(plano.aprovado!==true)motivos.push("PLANO_NAO_APROVADO");
   if(t.revisar)motivos.push("ALTERACOES_PENDENTES");
   return Object.freeze({
     simulacao_valida:motivos.length===0,
     requer_revisao:motivos.includes("ALTERACOES_PENDENTES"),
     pode_gravar:false,
     operacao:"NENHUMA",
     motivos:Object.freeze(motivos)
   });
 }
 return {avaliar};
});
