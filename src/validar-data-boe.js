// Validação independente de datas para prévia de importação, sem acesso ao banco.
function validarDataISO(valor) {
  if (typeof valor !== "string") return false;
  const partes = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!partes) return false;
  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes - 1 &&
    data.getUTCDate() === dia;
}
function conferirPeriodo(registro) {
  if (!validarDataISO(registro.data_sinistro)) return { valido: false, motivo: "Data inválida" };
  const ano = Number(registro.data_sinistro.slice(0, 4));
  const mes = Number(registro.data_sinistro.slice(5, 7));
  if (registro.ano !== undefined && Number(registro.ano) !== ano)
    return { valido: false, motivo: "Ano divergente" };
  if (registro.mes !== undefined && Number(registro.mes) !== mes)
    return { valido: false, motivo: "Mês divergente" };
  return { valido: true, ano, mes };
}
module.exports = { validarDataISO, conferirPeriodo };
