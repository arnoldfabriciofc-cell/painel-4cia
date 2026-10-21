-- PAINEL 4ª CIA | DIAGNÓSTICO DE PRÉ-PUBLICAÇÃO
-- SOMENTE LEITURA: não atualiza, não insere e não exclui registros.
-- Executar no SQL Editor do Supabase apenas após autorização do administrador.

-- 1. Colunas reais da tabela de sinistralidade.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'sinistralidade'
ORDER BY ordinal_position;

-- 2. Chaves, índices e restrições (incluindo unicidade).
SELECT i.indexname, i.indexdef
FROM pg_indexes i
WHERE i.schemaname = 'public' AND i.tablename = 'sinistralidade'
ORDER BY i.indexname;

-- 3. Políticas de segurança em nível de linha.
SELECT c.relname AS tabela, c.relrowsecurity AS rls_ativo,
       c.relforcerowsecurity AS rls_forcado
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname='sinistralidade';

SELECT policyname, roles, cmd, permissive, qual, with_check
FROM pg_policies
WHERE schemaname='public' AND tablename='sinistralidade'
ORDER BY policyname;

-- 4. Triggers que podem alterar comportamento das atualizações.
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_schema='public' AND event_object_table='sinistralidade'
ORDER BY trigger_name;

-- 5. Totais atuais e chaves repetidas (não depende de classificação por natureza).
SELECT count(*) AS total_registros,
       count(DISTINCT boe) AS boes_distintos,
       count(*) FILTER (WHERE boe IS NULL OR trim(boe)='') AS boes_vazios
FROM public.sinistralidade;

SELECT boe, count(*) AS repeticoes
FROM public.sinistralidade
WHERE boe IS NOT NULL
GROUP BY boe HAVING count(*)>1
ORDER BY repeticoes DESC, boe LIMIT 50;

-- 6. Resumo por natureza com fonte em dados_originais, se houver.
SELECT coalesce(dados_originais->>'natureza','SEM NATUREZA') AS natureza,
       count(*) AS registros
FROM public.sinistralidade
GROUP BY 1 ORDER BY registros DESC;

-- 7. Revisão das três datas divergentes e do identificador 270/350.
SELECT boe, rso, data_sinistro, hora_sinistro, rodovia, ano, mes,
       dados_originais->>'natureza' AS natureza
FROM public.sinistralidade
WHERE boe IN ('504305','504408','504414','504195')
ORDER BY boe;

-- FIM. Nenhum comando de gravação.
