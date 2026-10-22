-- DIAGNÓSTICO SOMENTE LEITURA: executar manualmente no ambiente autorizado.
-- NÃO configura permissões, NÃO altera tabelas, NÃO concede acesso.
-- Substitua nomes de tabelas apenas após conferência do esquema real.
-- 1. Inventário das tabelas de dados (sem consultar linhas de BO-e).
select table_schema,table_name,
       (select c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace
        where n.nspname=t.table_schema and c.relname=t.table_name limit 1) as rls_ativo,
       (select c.relforcerowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace
        where n.nspname=t.table_schema and c.relname=t.table_name limit 1) as rls_forcado
from information_schema.tables t
where t.table_schema='public' and t.table_type='BASE TABLE'
order by table_name;

-- 2. Políticas RLS: somente metadados.
select schemaname,tablename,policyname,permissive,roles,cmd,qual,with_check
from pg_policies where schemaname='public'
order by tablename,policyname;

-- 3. Concessões de acesso a papéis públicos e autenticados.
select table_schema,table_name,grantee,privilege_type
from information_schema.role_table_grants
where table_schema='public'
  and grantee in ('anon','authenticated','PUBLIC')
order by table_name,grantee,privilege_type;

-- 4. Índices exclusivos e chaves para evitar duplicação BO-e.
select schemaname,tablename,indexname,indexdef
from pg_indexes where schemaname='public'
order by tablename,indexname;

-- 5. Triggers existentes: podem modificar dados durante importação.
select event_object_schema,event_object_table,trigger_name,event_manipulation,
       action_timing,action_statement
from information_schema.triggers
where event_object_schema='public'
order by event_object_table,trigger_name;
