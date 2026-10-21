# Contrato de importação BO-e — proposta para homologação

**Estado:** especificação de segurança, não implementa escrita no Supabase.

## 1. Arquitetura

- Navegador público: consulta somente dados aprovados para publicação.
- Administrador autenticado: solicita pré-visualização de importação por meio de serviço protegido.
- Serviço de importação: valida identidade, permissões, conteúdo e versão da base; registra auditoria; só então realiza transação.
- Banco Supabase: aplica RLS, restrições de unicidade e permissões no servidor. Nunca colocar chave de serviço (`service_role`) no HTML ou no GitHub Pages.

## 2. Entrada e validação

- Importação somente após autenticação real do administrador e autorização explícita da operação.
- BO-e é a chave lógica para deduplicação; RSO não é chave única.
- Proteger `boe`, `rso`, `id`, `chave_registro` e `hora_sinistro`.
- Validar datas de calendário, horário, contagens inteiras não negativas e campos obrigatórios conforme esquema real.
- Para `data_sinistro`, atualizar `ano` e `mes` na mesma transação.
- Normalizar natureza para identificar acidentes sem descartar registros de outras naturezas da base de auditoria.
- Exibir relatório de inserções, registros idênticos, alterações propostas, rejeições e erros antes de confirmar.
- **Conflitos em campos existentes exigem aprovação individual ou regra explicitamente aprovada; nunca sobrescrever silenciosamente.**

## 3. Gravação segura

1. Fazer backup verificável da tabela e registrar versão/contagem inicial.
2. Autenticar administrador no servidor e verificar autorização para escrita.
3. Validar a carga completa e garantir unicidade por BO-e no banco.
4. Gerar plano e token de confirmação com expiração, associado ao usuário e hash da carga.
5. Confirmar plano e gravar por transação atômica com controle de concorrência.
6. Guardar log de auditoria sem publicar dados pessoais.
7. Reconsultar os registros gravados e conferir totais e integridade.
8. Testar restauração em ambiente separado.

## 4. Casos especiais conhecidos

- BO-e 503994: 2 vítimas graves e 2 fatais.
- BO-e 504195: preservar o valor original `270/350`; correção depende de validação.
- BO-e 504305: data proposta 2026-10-03.
- BO-e 504408: data proposta 2026-09-29.
- BO-e 504414: data proposta 2026-09-30.

## 5. Bloqueios de liberação

- Esquema real da tabela `public.sinistralidade`, restrições, índices, gatilhos e RLS ainda não auditados.
- Autenticação e permissão de escrita dos administradores ainda não verificadas.
- Não foi executado teste real de transação, rollback e restauração.
- Não há autorização para gravar as correções na produção.

**Conclusão:** não ativar importação no painel público enquanto os bloqueios persistirem.
