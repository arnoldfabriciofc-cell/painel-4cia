/* Avaliação de evidências de homologação, sem conexão com Supabase.
 * Apenas valores booleanos explícitos === true contam como evidência.
 * Não é autenticação nem autorização de escrita.
 */
(function(root,factory){
 if(typeof module==="object"&&module.exports)module.exports=factory();
 else root.PainelBoeHomologacao=factory();
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const ITENS=Object.freeze([
  "esquema_conferido",
  "rls_validada",
  "anon_sem_acesso_individual",
  "operador_sem_escrita_direta",
  "autorizacao_servidor_validada",
  "unicidade_boe_validada",
  "triggers_conferidos",
  "backup_restauracao_testados",
  "rollback_testado",
  "auditoria_validada",
  "indicadores_conferidos",
  "publicacao_revisada",
  "aprovacao_explicita_registrada"
 ]);
 function avaliar(evidencias){
  if(!evidencias||typeof evidencias!=="object"||Array.isArray(evidencias))throw TypeError("Evidências inválidas");
  const pendentes=ITENS.filter(item=>evidencias[item]!==true);
  return Object.freeze({
   tipo:"CHECKLIST DE HOMOLOGAÇÃO",
   total:ITENS.length,
   confirmados:ITENS.length-pendentes.length,
   pendentes:Object.freeze(pendentes),
   checklist_completo:pendentes.length===0,
   gravacao_autorizada:false,
   aviso:"Checklist declarativo. Requer verificação independente no servidor e aprovação de implantação."
  });
 }
 return {ITENS,avaliar};
});
