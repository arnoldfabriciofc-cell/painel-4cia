# Plano de implantação e reversão — BO-e / 4ª Cia

**Situação:** roteiro de homologação; NÃO autoriza operação em produção.

## 1. Pré-requisitos
- Validar o esquema real, índices únicos, triggers e RLS no Supabase autorizado.
- Testar acesso de `anon`, operador sem privilégio de escrita e revisor autorizado.
- Comprovar cópia de segurança e **restauração ensaiada** em ambiente isolado.
- Confirmar critérios de duplicidade, proteção de identificadores e correção de data/ano/mês.
- Obter aprovação explícita do responsável pela publicação e pelo banco.

## 2. Ensaio em ambiente separado
1. Preparar dados sintéticos e uma base descartável com esquema equivalente ao real.
2. Registrar totais de sinistros e vítimas antes do ensaio.
3. Simular lote com inserção, registro idêntico, divergência, duplicidade e erro de data.
4. Validar que somente o serviço autenticado pode escrever e que falhas geram rollback integral.
5. Reexecutar lote idêntico e confirmar idempotência (sem duplicação).
6. Comparar os totais após o ensaio e justificar cada diferença.
7. Conferir trilha de auditoria sem expor dados individuais em logs públicos.

## 3. Implantação controlada — somente após aprovação
1. Registrar versão do código, versão do esquema, janela e responsável.
2. Fazer backup verificável imediatamente antes da operação.
3. Implantar inicialmente com escrita desabilitada; validar consultas e permissões.
4. Habilitar escrita apenas no serviço autorizado, com escopo mínimo e proteção contra repetição.
5. Executar lote pequeno autorizado; verificar resultados e logs.
6. Liberar processamento diário somente após aceite documentado.

## 4. Condições para interrupção
- Falha de autenticação/RLS, divergência de BO-e protegido, duplicação, inconsistência de datas, erro de transação, alteração inesperada dos indicadores ou ausência de backup.
- Suspender novas gravações, preservar evidências e comunicar o responsável.
- Não tentar corrigir a base de produção manualmente sem autorização.

## 5. Reversão
1. Desabilitar novas gravações e identificar a versão/lote responsável.
2. Avaliar reversão transacional ou restauração a partir do backup **testado**.
3. Validar integridade, totais e permissões após a recuperação.
4. Registrar incidente, decisões e aprovação para eventual retomada.

## 6. Dependência ainda aberta
A estrutura real e as permissões do Supabase **não foram verificadas** neste projeto. Não inserir URLs privadas, senhas, tokens, chaves `service_role` ou dados individuais BO-e em commits ou conversas. Solicitar acesso por meio de conexão autorizada, quando disponível.
