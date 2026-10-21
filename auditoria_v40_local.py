"""Auditoria local de consistência BO-e. Sem conexões, SQL ou gravação remota."""
import csv, json, sys
from pathlib import Path

def main(backup, relatorio):
    with open(backup, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    dados = json.loads(Path(relatorio).read_text(encoding="utf-8"))
    erros = []
    por_boe = {}
    for linha in rows:
        boe = str(linha["boe"]).strip()
        if boe in por_boe:
            erros.append("BO-e duplicado no backup: " + boe)
        por_boe[boe] = linha
    if len(rows) != 35 or len(dados.get("registros", [])) != 35:
        erros.append("Esperados 35 registros em cada arquivo")
    if not dados.get("aprovado_estrutural") or dados.get("erros"):
        erros.append("Relatório V38 não aprovado")
    vistos = set()
    totais = {"acidentes": 0, "outras_naturezas": 0, "datas": 0, "rodovias": 0, "tipos": 0, "leves": 0, "graves": 0, "fatais": 0}
    for item in dados.get("registros", []):
        boe = str(item["boe"])
        origem = por_boe.get(boe)
        if origem is None:
            erros.append("BO-e ausente no backup: " + boe)
            continue
        if boe in vistos:
            erros.append("BO-e duplicado na V38: " + boe)
        vistos.add(boe)
        for coluna, campo in (("rso", "rso"), ("data_sinistro", "data_atual"), ("rodovia", "rodovia_atual")):
            if str(origem[coluna]) != str(item[campo]):
                erros.append("Divergência " + coluna + " BO-e " + boe)
        if origem["hora_sinistro"][:5] != item["hora_preservada"][:5]:
            erros.append("Horário divergente BO-e " + boe)
        acidente = item["contabilizar_sinistralidade"] is True
        totais["acidentes" if acidente else "outras_naturezas"] += 1
        totais["datas"] += origem["data_sinistro"] != item["data_proposta"]
        totais["rodovias"] += origem["rodovia"] != item["rodovia_proposta"]
        totais["tipos"] += bool(acidente and origem["tipo_sinistro"] != item["tipo"])
        for campo, valor in zip(("leves", "graves", "fatais"), item["vitimas"]):
            totais[campo] += valor
        if boe == "504195" and item["rodovia_original"] != "270/350":
            erros.append("Rodovia original 270/350 não preservada")
    if vistos != set(por_boe):
        erros.append("Conjuntos de BO-e não coincidem")
    esperado = {"acidentes": 23, "outras_naturezas": 12, "datas": 3, "rodovias": 35, "tipos": 23, "leves": 17, "graves": 3, "fatais": 2}
    for campo, valor in esperado.items():
        if totais[campo] != valor:
            erros.append("Total divergente: " + campo)
    print(json.dumps({"modo": "SOMENTE LEITURA", "aprovado": not erros, "totais": totais, "erros": erros}, ensure_ascii=False, indent=2))
    return 0 if not erros else 1

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Uso: python auditoria_v40_local.py backup.csv relatorio_v38.json")
    raise SystemExit(main(sys.argv[1], sys.argv[2]))
