# StudyRats

App de estudos em grupo, no estilo Gymrats: crie ou entre em grupos, publique suas
sessões de estudo e acompanhe o feed e o ranking do grupo.

> **Estado atual: Passo 1 — protótipo navegável.** As telas funcionam com dados fake em
> memória (`src/data/mockData.ts`); nada ainda é salvo de verdade nem compartilhado
> entre pessoas. A integração com um backend real (Firebase) é o próximo passo — veja
> `docs/decisoes/0001-arquitetura-inicial.md` para o raciocínio completo por trás de
> cada decisão de arquitetura tomada até aqui.

## Rodando localmente

Pré-requisito: Node.js 20+.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Testes

```bash
npm run test        # testes atômicos e de integração (Vitest + React Testing Library)
npm run test:watch  # mesmo, em modo watch
npm run test:e2e    # testes globais de interface, no navegador (Playwright)
```

Na primeira vez que rodar os testes E2E localmente, pode ser necessário baixar os
navegadores do Playwright:

```bash
npx playwright install chromium
```

## Build de produção

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve o build localmente, para conferir antes de publicar
```

## Deploy no GitHub Pages

O deploy é automático via GitHub Actions (`.github/workflows/deploy.yml`): a cada push
na branch `main`, o workflow instala dependências, roda os testes, builda o projeto e
publica `dist/` no GitHub Pages.

Configuração única no repositório (depois de subir este projeto pro GitHub):

1. Em **Settings → Pages**, em "Build and deployment", escolha a fonte **GitHub
   Actions** (em vez de "Deploy from a branch").
2. Dê um push na branch `main` — o workflow "Deploy para o GitHub Pages" roda sozinho e,
   ao final, mostra a URL pública do app.

Não é necessário ajustar `base` no `vite.config.ts`: ele já usa caminho relativo
(`base: './'`), o que funciona tanto em `usuario.github.io` quanto em
`usuario.github.io/nome-do-repositorio`.

## Estrutura do projeto

```
src/
  components/     # componentes de UI
  data/           # dados fake usados no protótipo (passo 1)
  state/          # AppContext: estado global em memória (grupos, sessões, ações)
  utils/          # funções puras (datas, agrupamento, ranking) — com testes atômicos
  App.tsx         # navegação entre Home (lista de grupos) e detalhe do grupo
tests/e2e/        # testes globais end-to-end (Playwright)
docs/decisoes/    # registro (ADRs) das decisões de arquitetura, em Markdown
.github/workflows/
  ci.yml          # roda lint, typecheck e testes em cada PR
  deploy.yml      # builda e publica no GitHub Pages a cada push em main
```

## Próximos passos sugeridos

1. Integrar Firebase (Firestore + Authentication) no lugar dos dados fake.
2. Persistir sessões/grupos de verdade e sincronizar entre usuários.
3. Tela de login/perfil.
4. Testes de integração contra o Firestore usando o Firebase Local Emulator Suite.

Cada passo será proposto como uma mudança pequena e isolada, para que você revise e
controle os commits.
