# Resultado da auditoria histórica (GitHub Actions)

Fonte: arquivo `sinistralidade.html` presente no repositório, analisado em modo somente leitura.
Execução aprovada: https://github.com/arnoldfabriciofc-cell/painel-4cia/actions/runs/39674175942

| Período | Registros | Acidentes | Outras naturezas |
|---|---:|---:|---:|
| 2024 | 1 | 1 | 0 |
| 2025 | 1.404 | 1.288 | 116 |
| 2026 | 1.097 | 980 | 117 |
| **Total** | **2.502** | **2.269** | **233** |

Vítimas **nos registros classificados como acidentes**: 1.599 leves, 343 graves, 165 fatais.
Duplicidade de BO-e detectada no conjunto: **nenhuma**.

## Interpretação e ressalvas

- Os 233 registros de outras naturezas não devem integrar indicadores de acidentes.
- Estes números são um retrato do HTML estático analisado, **não** uma consulta à base de produção Supabase.
- A auditoria usa a regra positiva de natureza iniciada por `ACIDENTE DE TRÂNSITO`, após normalização de acentos e espaços.
- A ausência de duplicidade nesse arquivo não comprova ausência de duplicidade no banco de produção.
- O arquivo de 2024 possui 1 registro e não faz parte do comparativo 2025 × 2026.
- **Não mesclar o PR nem substituir `index.html`** antes da integração e validação dos filtros em todos os gráficos e cartões.
