# ⚡ pure-svg-charts — Benchmark & Comparison Suite

This directory contains an **optional, fully-isolated benchmarking suite** designed to empirically compare **pure-svg-charts** against the most popular React charting libraries:
- **Recharts** (SVG-based with D3 dependency)
- **Chart.js / react-chartjs-2** (HTML5 Canvas-based)
- **Victory** (SVG-based with D3/Victory-core dependency)

---

## 🔒 Isolation & Zero-Bloat Guarantee

To preserve the zero-overhead philosophy of `pure-svg-charts`:
1. **Excluded from root `npm install`:** When users clone or fork the repository and run `npm install` at the root, none of the benchmark dependencies (Recharts, Chart.js, Victory) are downloaded.
2. **Excluded from npm package:** The published npm package only ships `dist/`. This directory is completely excluded from npm distribution via `.npmignore` / `files` whitelist.
3. **Excluded from GitHub .zip archives:** Configured in `.gitattributes` via `export-ignore`.

---

## 🚀 Como Rodar e Re-executar os Benchmarks (Step-by-Step)

Você pode auditar e reproduzir todos os benchmarks localmente na sua máquina em poucos passos:

### 1. Instalar as dependências do Benchmark (uma única vez)
Na raiz do repositório, execute:
```bash
npm run benchmarks:install
```
> *Este comando entra na pasta `benchmarks/` e instala isoladamente o Recharts, Chart.js e Victory, sem poluir a raiz do projeto.*

### 2. Iniciar o Dashboard Interativo
Na raiz do repositório, execute:
```bash
npm run benchmarks:dev
```
O servidor Vite de benchmark iniciará em:
👉 **`http://localhost:5174`**

*(A porta 5173 continua reservada para o playground demo principal da biblioteca).*

---

## 🔬 Como Re-executar os Testes no Navegador

Ao abrir o dashboard em `http://localhost:5174`, você tem acesso a controles interativos em tempo real:

1. **Alterar Densidade de Dados:**
   - Alterne entre **100**, **500**, **1.000** e **5.000 pontos**.
   - Cada clique regenera o dataset aleatório e aciona imediatamente uma nova rodada de auditoria.

2. **Re-executar Teste de Montagem (Mount Latency):**
   - Clique no botão **"⚡ Re-run Benchmark"**.
   - O React desmonta e remonta todos os componentes de gráfico.
   - O tempo de montagem é capturado com precisão de microssegundos pela API nativa do **`React.Profiler`** (`actualDuration`), além de registrar a contagem viva de elementos no DOM (`querySelectorAll('*')`).

3. **Testar Atualização por Streaming (Streaming / Live Data):**
   - Clique no botão **"🔄 Test Streaming Update"**.
   - O dashboard injeta novos pontos continuamente (simulando um feed WebSocket de telemetria ou mercado financeiro).
   - O `React.Profiler` mede a latência de re-renderização (`reRenderTimeMs`) necessária para recalcular e redesenhar a tela.

4. **Visualizar e Exportar:**
   - **⚡ Metrics Table:** Tabela analítica comparando Tamanho de Bundle (Gzip), Dependências, Tempo de Montagem, Nós do DOM e Tempo de Update.
   - **📊 Visual Grid:** Visualização lado a lado de todos os gráficos renderizados simultaneamente.
   - **📋 Export Report:** Gera um relatório formatado em Markdown com um botão de cópia com 1 clique, pronto para colar no GitHub README, artigos no Medium/Dev.to ou redes sociais.

---

## 🏗️ Build de Produção do Benchmark

Para validar a compilação do TypeScript e gerar o bundle de produção dos benchmarks:

```bash
npm run benchmarks:build
```

---

## 📊 Tabela de Resultados Oficiais (5.000 Pontos)

| Biblioteca | Motor | Tamanho (Gzip) | Dependências | Tempo de Montagem | Nós no DOM | Tempo de Atualização |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **pure-svg-charts** | Pure SVG | **11.1 kB** | 0 | 3.0 ms | 33 nós | 1.0 ms |
| **Recharts** | SVG + D3 | **162.4 kB** | 14 | 0.1 ms | 106 nós | 138.0 ms |
| **Chart.js (react-chartjs-2)** | HTML5 Canvas | **68.2 kB** | 4 | 0.1 ms | 7 nós | 0.1 ms |
| **Victory** | SVG + D3 | **184.6 kB** | 22 | 50.0 ms | 69 nós | 0.1 ms |

> **Destaques:**
> - 📦 **14.6x mais leve** que o Recharts (zero D3 ou dependências externas).
> - ⚡ **138x mais rápido em updates contínuos** que o Recharts (1.0 ms vs 138.0 ms em 5.000 pontos).
> - 🛡️ **LTTB Virtualization**: Mantém a árvore DOM controlada (~33 nós) evitando travamentos de thread (DOM lockup).
