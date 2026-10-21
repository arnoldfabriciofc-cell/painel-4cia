// Gera uma prévia estática corrigida SEM modificar o arquivo de produção.
// Uso: node scripts/gerar-previa-sinistralidade.js
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const entrada=path.join(root,"sinistralidade.html");
const saida=path.join(root,"dist","sinistralidade-previa-filtrada.html");
const html=fs.readFileSync(entrada,"utf8");
const marcador=/\bvar DATA=(\[[\s\S]*?\]);\s*function uniq\(/;
const achado=html.match(marcador);
if(!achado) throw new Error("Estrutura DATA do HTML não encontrada; geração interrompida");
const registros=JSON.parse(achado[1]);
const filtro=require("../src/filtro-sinistralidade.js");
const resumo=filtro.resumo(registros);
if(resumo.duplicados.length) throw new Error("BO-e duplicados; geração interrompida");
const acidentes=filtro.filtrarAcidentes(registros);
// A prévia contém somente acidentes: registros excluídos não são embarcados em DATA_BRUTA.
const novo=html.replace(marcador,()=>{
  return "var DATA="+JSON.stringify(acidentes)+";\nfunction uniq(";
});
if(novo===html) throw new Error("Substituição não aplicada");
fs.mkdirSync(path.dirname(saida),{recursive:true});
fs.writeFileSync(saida,novo,"utf8");
const relatorio={entrada:path.basename(entrada),saida:path.relative(root,saida),
  registrosOriginais:registros.length,acidentes:resumo.acidentes,
  outrasNaturezasExcluidas:resumo.outrasNaturezas,
  vitimas:resumo.vitimas,
  observacao:"Prévia estática; não substitui sincronização com Supabase."};
fs.writeFileSync(path.join(root,"dist","relatorio-previa.json"),JSON.stringify(relatorio,null,2)+"\n");
console.log(JSON.stringify(relatorio,null,2));
