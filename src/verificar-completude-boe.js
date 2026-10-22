/* Verificação adicional para novos BO-e: não altera o plano nem grava dados. */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.PainelBoeCompletude=factory();
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function verificar(atuais,novos){
  if(!Array.isArray(atuais)||!Array.isArray(novos))throw TypeError("Esperados arrays");
  const chaves=new Set(atuais.map(r=>String((r&&r.boe)??"").trim()));
  let novosSemData=0,novosIdentificados=0;
  for(const r of novos){
   const boe=String((r&&r.boe)??"").trim();
   if(!/^\d+$/.test(boe)||chaves.has(boe))continue;
   novosIdentificados++;
   if(typeof r.data_sinistro!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(r.data_sinistro))novosSemData++;
  }
  return Object.freeze({
   tipo:"VERIFICAÇÃO COMPLEMENTAR DE NOVOS REGISTROS",
   novos_identificados:novosIdentificados,
   novos_sem_data:novosSemData,
   completo:novosSemData===0,
   gravacao_autorizada:false
  });
 }
 return {verificar};
});
