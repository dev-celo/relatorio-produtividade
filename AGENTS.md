<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Relatório Diário de Produção
- Toda a lógica de tempos (durações, jornada de referência, eixo do Gantt, totais) vive em `src/lib/report.ts` — mantém o cálculo em um só lugar e testável fora da UI.
- A folha visual (`src/components/report/ReportSheet.tsx`) é print-first e usa campos inline editáveis; edição de atividades fica em `ActivityEditor.tsx`, marcado `no-print`.
- Cores/ícones derivam do tipo da atividade em `src/components/report/kinds.ts` — evita escolha manual e mantém a legenda coerente.
- Build estático para GitHub Pages: `STATIC_BUILD=1` ativa modo SPA e `BASE_PATH=/repo/` define o caminho em `vite.config.ts`; `scripts/build-static.mjs` roda o build e copia `_shell.html` para `index.html`. NUNCA habilite `spa` incondicionalmente — o build padrão do Lovable precisa de SSR.
- O workflow `.github/workflows/deploy-pages.yml` publica no Pages a cada push em `main`; requer Source = GitHub Actions nas configurações do repositório.
