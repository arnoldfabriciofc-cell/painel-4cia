-- Auditoria de leitura do esquema da sinistralidade (Supabase/Postgres).
-- SOMENTE SELECT: executar no SQL Editor por operador autorizado.
-- Não execute DDL nem divulgue resultados com dados pessoais.
select column_name,data_type,is_nullable,column_default
from information_schema.columns
where table_schema='public' and table_name='sinistralidade'
order by ordinal_position;

select indexname,indexdef
from pg_indexes
where schemaname='public' and tablename='sinistralidade'
order by indexname;

select conname,contype,pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid='public.sinistralidade'::regclass
order by conname;

select policyname,cmd,roles,qual,with_check
from pg_policies
where schemaname='public' and tablename='sinistralidade'
order by policyname;

select relrowsecurity,relforcerowsecurity
from pg_class
where oid='public.sinistralidade'::regclass;

select tgname,pg_get_triggerdef(oid) as definition
from pg_trigger
where tgrelid='public.sinistralidade'::regclass and not tgisinternal
order by tgname;
