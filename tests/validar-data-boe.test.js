const assert = require("node:assert/strict");
const { validarDataISO, conferirPeriodo } = require("../src/validar-data-boe.js");
for (const data of ["2026-10-03", "2026-09-29", "2026-09-30", "2024-02-29"]) {
  assert.equal(validarDataISO(data), true, data);
}
for (const data of ["2026-02-29", "2026-13-01", "2026-00-10", "2026-04-31", "2026-1-01", "31/10/2026", "", null]) {
  assert.equal(validarDataISO(data), false, String(data));
}
assert.deepEqual(conferirPeriodo({ data_sinistro: "2026-09-29", ano: 2026, mes: 9 }), { valido: true, ano: 2026, mes: 9 });
assert.equal(conferirPeriodo({ data_sinistro: "2026-09-29", ano: 2026, mes: 10 }).valido, false);
assert.equal(conferirPeriodo({ data_sinistro: "2026-09-29", ano: 2025, mes: 9 }).valido, false);
console.log("OK: calendário real, ano, mês e datas propostas dos BO-e");
