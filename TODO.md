# 📋 Roadmap & TO-DO — pure-svg-charts

Este documento consolida os pontos de melhoria, novas funcionalidades e requisitos técnicos necessários para eliminar qualquer barreira de adoção corporativa do **`pure-svg-charts`**, transformando-a na biblioteca definitiva de gráficos do ecossistema React.

---

## 🎯 Visão Geral do Roadmap

```
[ P1: Mobile & Touch ] ──> [ P2: Custom Tooltips ] ──> [ P3: Novos Gráficos ] ──> [ P4: Time-Series & a11y ]
```

---

## 🚨 Prioridade 1 (P1): Interatividade Mobile & Gestos Touch *(Maior Deal-Breaker Atual)*

- [ ] **Suporte Nativo a Eventos Touch:**
  - [ ] Implementar `onTouchStart`, `onTouchMove` e `onTouchEnd` em `<SvgLineChart>` e `<SvgBarChart>`.
  - [ ] Calcular coordenadas relativas com precisão em telas de toque (`e.touches[0].clientX / clientY`).
  - [ ] Configurar `touch-action: pan-y` no container SVG para permitir rolagem vertical natural da página enquanto o usuário arrasta o dedo horizontalmente sobre o gráfico.
- [ ] **Comportamento de Pin / Trava de Tooltip:**
  - [ ] Ao dar um toque único (*tap*), fixar o tooltip no ponto mais próximo.
  - [ ] Ao tocar fora, fechar o tooltip suavemente.
- [ ] **Otimização de Cursor em Telas de Alta Densidade (Retina/Mobile):**
  - [ ] Garantir que o crosshair e a bolinha ativa tenham raio de toque ampliado (*hitbox*) para facilitar a seleção com o dedo.

---

## 🎨 Prioridade 2 (P2): Tooltips Ricos & Customizáveis com Componentes React

- [ ] **Prop `renderTooltip` (HTML / React Children):**
  - [ ] Permitir que o desenvolvedor passe um componente React completo para renderizar dentro do tooltip:
    ```tsx
    <SvgLineChart
      data={data}
      renderTooltip={({ point, seriesIndex, activeColor }) => (
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 shadow-xl">
          <span className="font-bold text-emerald-400">{point.label}</span>
          <p className="text-white text-lg font-semibold">{point.value.toLocaleString()} USD</p>
        </div>
      )}
    />
    ```
- [ ] **Renderização com React Portal ou Posicionamento Absoluto:**
  - [ ] Ancorar o tooltip fora do SVG (usando `HTML overlay` ou `createPortal`) para que ele não fique cortado pelas bordas (*overflow: hidden*) do SVG.
- [ ] **Fallback Automático:**
  - [ ] Manter o tooltip SVG nativo (`<rect>` + `<text>`) como padrão ultra-leve quando o desenvolvedor não passar um componente customizado.

---

## 📊 Prioridade 3 (P3): Novos Tipos de Gráficos Críticos para Dashboards

- [ ] **Combo Chart / Dual-Axis (Gráfico Misto com Eixo Duplo Y):**
  - [ ] Suporte a misturar **Barras** (ex: Volume / Faturamento) com **Linha** (ex: Margem % / Conversão) no mesmo gráfico.
  - [ ] Eixo Y esquerdo (numérico absoluto) e eixo Y direito (percentual ou escala secundária).
- [ ] **Gráfico de Barras Horizontais (`SvgHorizontalBarChart`):**
  - [ ] Layout ideal para rankings corporativos (Top 10 Clientes, Países, Produtos).
  - [ ] Suporte a rótulos de texto longos no eixo vertical esquerdo sem sobreposição.
  - [ ] Suporte a valores negativos divergindo para a esquerda.
- [ ] **Gráfico de Dispersão Contínuo (`SvgScatterPlot`):**
  - [ ] Plotagem de pares numéricos contínuos $(X, Y)$ independentes de categorias.
  - [ ] Suporte a tamanhos variáveis de ponto (Bubble Chart) e cores por cluster.
- [ ] **Área com Intervalo / Faixa de Confiança (Min-Max Band Area):**
  - [ ] Renderizar banda de incerteza (sombra entre valor mínimo e máximo previsto) muito usada em previsões financeiras e de telemetria.

---

## ⏰ Prioridade 4 (P4): Escala Temporal com Datas Reais (Time-Series)

- [ ] **Suporte a Timestamps e Objetos `Date` no Eixo X:**
  - [ ] Aceitar `Date`, timestamp Unix (ms) ou strings ISO no `label`/`timestamp`.
  - [ ] Calcular a posição `x` proporcionalmente ao tempo transcorrido, e não apenas pelo índice sequencial.
- [ ] **Tratamento Inteligente de Gaps Temporais:**
  - [ ] Respeitar buracos de dados (fins de semana no mercado financeiro ou quedas de sensor IoT) sem distorcer o eixo X.
- [ ] **Formatadores Automáticos de Data:**
  - [ ] Presets para formatação automática conforme o zoom/intervalo: `'auto'` | `'day'` | `'month'` | `'year'` | `'hour'`.

---

## ♿ Prioridade 5 (P5): Acessibilidade Completa (a11y / WCAG 2.1 & ADA)

- [ ] **Semântica SVG Acessível:**
  - [ ] Adicionar `role="img"` ao elemento `<svg>`.
  - [ ] Injetar tags `<title>` e `<desc>` descritivas no cabeçalho do SVG para leitores de tela.
- [ ] **Navegação por Teclado:**
  - [ ] Adicionar `tabIndex={0}` no gráfico para torná-lo focável.
  - [ ] Permitir percorrer os pontos usando as setas do teclado ($\leftarrow$ e $\rightarrow$).
  - [ ] Disparar tooltips e anúncios para leitores de tela (`aria-live="polite"`) ao focar em cada ponto.
- [ ] **Modo de Alto Contraste:**
  - [ ] Garantir conformidade com contraste de cores WCAG AA (mínimo de 4.5:1 entre eixos, fundo e linhas).

---

## 🛠️ Prioridade 6 (P6): Infraestrutura, Tree-Shaking e Confiabilidade

- [ ] **Tree-Shaking Perfeito (`"sideEffects": false`):**
  - [ ] Declarar `"sideEffects": false` no `package.json` raiz para que usuários que importem apenas `<SvgLineChart />` tenham um bundle final de apenas ~4 kB.
- [ ] **Suíte de Testes Automatizados (Vitest):**
  - [ ] Configurar Vitest + React Testing Library.
  - [ ] Testes unitários para o algoritmo LTTB (`lttb.test.ts`).
  - [ ] Testes unitários para curvas Bézier (`bezier.test.ts`).
  - [ ] Testes de renderização síncrona dos componentes de gráfico.
- [ ] **Integração Contínua (GitHub Actions):**
  - [ ] Criar workflow `.github/workflows/ci.yml` para rodar `npm run build` e `npm test` automaticamente em cada Pull Request.
- [ ] **Utilitário de Exportação de Imagem:**
  - [ ] Função utilitária `exportChartAsImage(svgRef, 'png' | 'svg', filename)` para permitir que o usuário adicione facilmente um botão "Baixar Gráfico" em sua aplicação.

---

## 📈 Status de Conclusão

| Prioridade | Área | Status |
| :--- | :--- | :--- |
| **P1** | Mobile & Touch Events | ⏳ Planejado |
| **P2** | Custom Tooltip (React Portal / HTML) | ⏳ Planejado |
| **P3** | Combo Chart, Horizontal Bars & Scatter | ⏳ Planejado |
| **P4** | Escala Temporal Contínua | ⏳ Planejado |
| **P5** | Acessibilidade (a11y / WCAG) | ⏳ Planejado |
| **P6** | Tree-Shaking, Vitest & CI | ⏳ Planejado |
