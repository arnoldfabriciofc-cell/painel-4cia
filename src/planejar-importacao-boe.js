/* Preparação de importação BO-e em memória, SEM conexão com Supabase.
 * Só valida e propõe ações; não grava nada.
 */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.PainelBoeImportacao=factory();
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const IDENTIDADE=["boe","rso","id","chave_registro","hora_sinistro"];
 function chave(r){
   const b=String(r&&r.boe!=null?r.boe:"").trim();
   if(!/^\d+$/.test(b))throw Error("BO-e inválido: "+b);
   return b;
 }
 function verificarNumero(v,nome,boe){
   if(v===undefined||v===null||v==="")return;
   const n=Number(v);
   if(!Number.isSafeInteger(n)||n<0)throw Error("Contagem inválida: "+nome+" BO-e "+boe);
 }
 function plano(atuais,novos){
   if(!Array.isArray(atuais)||!Array.isArray(novos))throw TypeError("Esperados arrays");
   const existentes=new Map(),vistos=new Set(),erros=[],inserir=[],iguais=[],revisar=[];
   atuais.forEach((r,i)=>{try{const k=chave(r);if(existentes.has(k))erros.push("BO-e duplicado na base atual: "+k);existentes.set(k,r)}catch(e){erros.push("Base atual linha "+(i+1)+": "+e.message)}});
   novos.forEach((r,i)=>{
     try{
       const k=chave(r);
       if(vistos.has(k)){erros.push("BO-e repetido no lote: "+k);return}
       vistos.add(k);
       ["vitimas_leves","vitimas_graves","vitimas_fatais","leve","grave","fatal"].forEach(n=>verificarNumero(r[n],n,k));
       if(r.data_sinistro!==undefined&&!/^\d{4}-\d{2}-\d{2}$/.test(String(r.data_sinistro)))throw Error("Data fora do formato AAAA-MM-DD: "+k);
       const antigo=existentes.get(k);
       if(!antigo){inserir.push(r);return}
       const mudancas={};
       for(const [campo,valor] of Object.entries(r)){
         if(IDENTIDADE.includes(campo)){
           if(antigo[campo]!==undefined&&String(antigo[campo]??"")!==String(valor??""))throw Error("Campo protegido divergente: "+campo+" BO-e "+k);
           continue;
         }
         if(antigo[campo]!==undefined&&String(antigo[campo]??"")!==String(valor??""))mudancas[campo]={antes:antigo[campo],depois:valor};
       }
       if(Object.keys(mudancas).length)revisar.push({boe:k,mudancas});
       else iguais.push(k);
     }catch(e){erros.push("Lote linha "+(i+1)+": "+e.message)}
   });
   return {modo:"SOMENTE SIMULAÇÃO",aprovado:erros.length===0,totais:{atuais:atuais.length,recebidos:novos.length,inserir:inserir.length,iguais:iguais.length,revisar:revisar.length,erros:erros.length},inserir,iguais,revisar,erros};
 }
 return {plano};
});
