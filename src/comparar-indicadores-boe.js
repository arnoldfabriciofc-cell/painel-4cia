/* Comparação de indicadores agregados BO-e, sem registros individuais. */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.PainelBoeComparativo=factory();
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const CAMPOS=Object.freeze(["sinistros","vitimas_leves","vitimas_graves","vitimas_fatais"]);
 function normalizar(obj){
  if(!obj||typeof obj!=="object"||Array.isArray(obj))throw TypeError("Indicadores inválidos");
  const saida={};
  for(const c of CAMPOS){
   if(!Number.isSafeInteger(obj[c])||obj[c]<0)throw TypeError("Indicador inválido: "+c);
   saida[c]=obj[c];
  }
  return saida;
 }
 function comparar(antes,depois){
  const a=normalizar(antes),b=normalizar(depois);
  const diferencas={};
  for(const c of CAMPOS)diferencas[c]=b[c]-a[c];
  const alterou=CAMPOS.some(c=>diferencas[c]!==0);
  return Object.freeze({
   tipo:"CONFERÊNCIA AGREGADA DE INDICADORES",
   antes:a,depois:b,diferencas,
   alteracoes_detectadas:alterou,
   revisao_necessaria:alterou,
   gravacao_autorizada:false,
   aviso:"Diferenças exigem conferência de origem e aprovação humana. Nenhum registro individual é exibido."
  });
 }
 return {CAMPOS,comparar};
});
