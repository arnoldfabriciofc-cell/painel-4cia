# Preparação do painel para apresentação aos comandantes

> Documento de auditoria. Não altera o painel público, o Supabase nem a rotina de importação.

## Diagnóstico inicial (21/10/2026)

- Repositório: `arnoldfabriciofc-cell/painel-4cia`; branch oficial `main`.
- `index.html` oficial: aproximadamente 23,9 MB. Preservar os módulos de Autuações, Comparativo, Sinistralidade, Geoprocessamento e Base de Dados.
- O arquivo de prévia recebido nesta conversa aponta para `sinistralidade-previa-apresentacao.html` e contém um bloqueio explícito da importação BO-e. **A prévia não é uma rotina de alimentação diária pronta.**
- O código da prévia utiliza um endpoint intermediário Cloudflare Workers para a base central. Validar respostas, permissões e comportamento do painel publicado antes de qualquer migração.
- Não usar login visual ou armazenamento apenas local como proteção da base administrativa. Validar autenticação, regras de acesso no backend e ausência de credenciais privilegiadas no navegador.

## Sinistralidade — conferência já efetuada

- 35 registros BO-e no backup de referência.
- 23 acidentes de trânsito; 12 ocorrências de outras naturezas, que não devem ser contabilizadas como sinistros.
- 35 rodovias, 23 tipos e 3 datas com correções propostas.
- Horários: 35 preservados.
- Vítimas: 17 leves, 3 graves e 2 fatais; BO-e 503994 (2 graves e 2 fatais) confirmado pelo responsável.
- BO-e 504195: conservar o valor original `270/350` no campo de auditoria e confirmar interpretação da rodovia antes de gravar.
- BO-e 504408 e 504414 têm datas de setembro; atualizar também `ano` e `mes` quando autorizado.
- Chave de identidade: BO-e; RSO pode repetir.

## Critérios para disponibilização pública

1. Conferir a versão de produção contra o backup e as planilhas de origem; não usar somente totais de uma prévia.
2. Revisar regras de segurança do backend, incluindo leitura pública de dados agregados e escrita restrita a administradores autorizados.
3. Ensaiar importação em ambiente de teste, com duplicatas, registros já existentes, falhas parciais e validação de totais.
4. Testar backup e restauração reais; simulação local não substitui esse teste.
5. Implementar e verificar o filtro de natureza na origem dos indicadores, inclusive por rodovia, período e pelotão.
6. Conferir os módulos de autuações e comparativos para garantir que não foram afetados.
7. Submeter a nova versão a aprovação antes de alterar `main/index.html` ou executar atualização em produção.

## Estado atual

**Em preparação.** Nenhuma atualização de dados foi executada. A branch de trabalho existe para revisão isolada.
