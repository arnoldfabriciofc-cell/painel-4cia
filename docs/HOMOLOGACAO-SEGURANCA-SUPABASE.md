# Plano de homologação de autenticação e importação BO-e

**Estado:** especificação; não executada no Supabase e sem credenciais de produção.

## Separação de responsabilidades

- **Consulta pública:** somente indicadores agregados aprovados para divulgação, nunca tabelas brutas contendo dados pessoais.
- **Operador autenticado:** pode enviar arquivo para validação, visualizar prévia agregada e solicitar revisão; não recebe privilégios de gravação direta.
- **Revisor autorizado:** confere divergências e decide correções em ambiente autenticado com trilha de auditoria.
- **Serviço de importação:** somente após autenticação e autorização verificadas no servidor, faz escrita transacional e auditada; nunca confia no campo `gravacao_autorizada` vindo do navegador.
- **Administrador:** gerencia permissões; privilégios elevados não são incluídos em JavaScript distribuído pelo GitHub Pages.

## Portões obrigatórios antes de habilitar escrita

1. Identificar tabelas, colunas, constraints, índices únicos, triggers e políticas RLS reais. Rodar somente os diagnósticos de leitura no SQL dedicado e revisar a saída, sem compartilhar identificadores de sinistros.
2. Garantir RLS efetiva em todas as tabelas com dados restritos. Testar com contas distintas que `anon` não lê dados individuais e que usuário autenticado sem autorização não consegue inserir, atualizar nem excluir.
3. Exigir autorização de escrita **no servidor**, com papéis mínimos e logs de usuário, horário, lote, quantidade e justificativa. Não registrar BO-e ou dados pessoais nos logs públicos.
4. Definir chave única real de identificação de BO-e e política de atualização; divergências exigem revisão, nunca substituição silenciosa.
5. Criar cópia de segurança e ensaiar restauração. Verificar idempotência e rollback em erro no meio do lote.
6. Homologar correções de datas e seus períodos, vítimas e rodovias, confrontando os indicadores 2025 e 2026 antes/depois.
7. Conferir publicação: GitHub Pages deve expor somente arquivos autorizados; **não publicar dados brutos, arquivos de diagnóstico ou interface de administração sem autenticação**.
8. Solicitar aprovação explícita para ativar integração e para publicar nova versão.

## Limites atuais

O protótipo HTML é somente local e **não constitui autenticação**. Os módulos de prévia são executados no navegador e não garantem segurança de uma futura API. Nenhuma política de produção foi inspecionada ou aplicada por este documento. A conexão real com Supabase permanece pendente.
