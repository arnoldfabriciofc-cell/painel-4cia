/* Módulo isolado para validar BO-e antes de calcular indicadores.
 * Não altera o HTML oficial nem faz chamadas ao Supabase.
 * Formato UMD: disponível em window.PainelSinistralidadeFiltro ou require().
 */
(function(root,factory){
  if(typeof module==="object" && module.exports) module.exports=factory();
  else root.PainelSinistralidadeFiltro=factory();
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function normalizar(texto){
    return String(texto==null?"":texto).normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"").trim().toUpperCase().replace(/\s+/g," ");
  }
  function ehAcidente(registro){
    if(!registro || typeof registro!=="object") return false;
    var natureza=normalizar(registro.natureza);
    // Classificação positiva: nunca inferir natureza pelo número de vítimas ou tipo.
    return /^ACIDENTE DE TRANSITO(?:\b|$)/.test(natureza);
  }
  function filtrarAcidentes(registros){
    if(!Array.isArray(registros)) throw new TypeError("Esperado array de registros BO-e");
    return registros.filter(ehAcidente);
  }
  function resumo(registros){
    var acidentes=filtrarAcidentes(registros);
    var vistos=new Set(),duplicados=[];
    var vitimas={leves:0,graves:0,fatais:0};
    acidentes.forEach(function(r){
      var boe=String(r.boe==null?"":r.boe).trim();
      if(!boe) throw new Error("Acidente sem BO-e");
      if(vistos.has(boe)) duplicados.push(boe);
      vistos.add(boe);
      [["leve","leves"],["grave","graves"],["fatal","fatais"]].forEach(function(pair){
        var valor=Number(r[pair[0]]);
        if(!Number.isSafeInteger(valor)||valor<0) throw new Error("Contagem inválida: "+pair[0]+" BO-e "+boe);
        vitimas[pair[1]]+=valor;
      });
    });
    return {acidentes:acidentes.length,outrasNaturezas:registros.length-acidentes.length,vitimas:vitimas,duplicados:duplicados};
  }
  return {normalizar:normalizar,ehAcidente:ehAcidente,filtrarAcidentes:filtrarAcidentes,resumo:resumo};
});
