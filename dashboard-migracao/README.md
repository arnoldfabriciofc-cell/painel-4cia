# Dashboard Operacional — 4ª Cia | Preparação

Esta branch prepara a migração de visualização para Looker Studio. **Não altera o painel público**.

## Arquitetura prevista
- Fonte: relatório Excel DER, importado diariamente (opcional) ou mensalmente.
- Banco: Supabase, com tabela de staging e tabela consolidada.
- Identificação: chave única do auto de infração, a confirmar no cabeçalho do relatório DER.
- Visualização: Looker Studio por conector compatível, sujeito a teste de atualização e controle de acesso.
- Consulta: apenas dados autorizados para compartilhamento; evitar expor dados pessoais em dashboards públicos.

## Regras para a importação
1. Conferir colunas e tipos do arquivo antes de importar.
2. Registrar nome, data, hash do arquivo, contagem de linhas e resultado.
3. Validar chave de autuação; bloquear importação sem chave válida.
4. Fazer upsert por chave de autuação; não somar linhas de relatórios acumulados.
5. Comparar totais por dia, mês, companhia e pelotão antes de confirmar.
6. Permitir reprocessamento seguro e manter histórico de execução.
7. Tratar correções ou cancelamentos conforme a situação do auto e o escopo do relatório.
8. Não colocar credenciais de serviço do Supabase no HTML ou em repositório público.

## Próximas verificações
- Esquema real dos relatórios DER e sinistralidade.
- Tabelas existentes, políticas RLS e permissões no Supabase.
- Viabilidade do conector Looker Studio, custo, cache e autenticação.
- Modelo de acesso por visualizador para o efetivo.
- Reconciliação de 2025/2026 e validação dos indicadores.

**Status:** planejamento técnico; importação, conector e dashboard ainda não implantados.
