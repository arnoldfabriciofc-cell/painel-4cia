const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const sql=fs.readFileSync(path.join(__dirname,"../sql/diagnostico-seguranca-supabase-leitura.sql"),"utf8");
const statements=sql.replace(/--[^\n]*/g,"").split(";").map(x=>x.trim()).filter(Boolean);
assert.equal(statements.length,5);
for(const statement of statements){
 assert.match(statement,/^select\s/i);
 assert.doesNotMatch(statement,/\b(insert|update|delete|truncate|drop|alter|create|grant|revoke|execute|call|copy|do)\b/i);
}
console.log("OK: cinco consultas SQL somente leitura, sem DML ou DDL");
