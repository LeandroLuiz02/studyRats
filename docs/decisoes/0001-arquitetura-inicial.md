# ADR 0001 — Arquitetura inicial do StudyRats

- **Status:** aceita
- **Data:** 2026-09-23

## Contexto

O objetivo é construir um app de estudos em grupo estilo Gymrats: criar/entrar em
grupos, publicar sessões de estudo (título, descrição, duração) escolhendo em quais
grupos publicar, ver um feed cronológico por grupo e um ranking mensal com calendário
individual de sessões.

Restrições dadas pelo usuário:

- Hospedagem gratuita.
- Uso inicial por ~5 a 10 pessoas (baixíssimo volume de requisições).
- Desenvolvimento em passos pequenos e atômicos, com o usuário controlando os commits.
- Testes automatizados atômicos, de integração e globais (interface e, quando houver,
  rotas de API).
- Pasta de Markdowns registrando decisões de arquitetura (este arquivo é o primeiro
  registro).
- As decisões de arquitetura mais importantes devem ser sempre delegadas ao usuário.

## Decisão 1 — Backend/persistência: Firebase (Firestore + Authentication)

**Alternativas consideradas:**

| Opção | Prós | Contras |
|---|---|---|
| **Firebase (Firestore + Auth)** | Plano gratuito (Spark) sem expiração e sem "hibernação"; SDK client-side, sem servidor para manter; limites diários (50k leituras / 20k escritas) muito acima do necessário para 5-10 pessoas | Vendor lock-in relativo (mitigado por manter a camada de acesso a dados isolada) |
| Supabase (Postgres + Auth) | Backend relacional real, API REST/Realtime pronta | Projetos gratuitos pausam após inatividade prolongada e precisam ser "acordados" manualmente — ruim para uso esporádico |
| Mock local (localStorage) | Zero infraestrutura | Grupos e ranking não seriam realmente compartilhados entre os usuários — cada pessoa veria só os próprios dados no navegador |
| API própria (Node/Express) | Controle total do backend | Exige um segundo serviço de hospedagem (Render/Railway etc.), que também hiberna no plano gratuito e adiciona infraestrutura para manter |

**Decisão:** Firebase (Firestore para dados de grupos/sessões, Firebase Authentication
para login). Essa etapa ainda **não foi implementada** — o protótipo atual (passo 1)
usa dados fake em memória. A integração real com o Firebase será um passo futuro,
tratado em um novo ADR quando chegar a hora, incluindo modelagem das coleções e regras
de segurança do Firestore.

## Decisão 2 — Hospedagem: GitHub Pages

Inicialmente havia a dúvida se o GitHub Pages (hospedagem 100% estática) serviria,
já que o app precisa de dados compartilhados entre usuários. A resposta é sim: como o
Firebase é consumido diretamente pelo navegador via SDK (sem servidor próprio), o
front-end continua sendo um bundle estático (HTML/JS/CSS) — exatamente o que o GitHub
Pages hospeda. Não há necessidade de trocar de hospedagem.

O deploy será automatizado via GitHub Actions (`.github/workflows/deploy.yml`): a cada
push na branch principal, o workflow builda o projeto com Vite e publica o conteúdo de
`dist/` no GitHub Pages.

## Decisão 3 — Estrutura do repositório

Monorepo único, sem pasta de backend (o Firebase é um serviço gerenciado, não há
código de servidor próprio para versionar):

```
study-app/
  src/                  # front-end React
  tests/e2e/            # testes Playwright (globais)
  docs/decisoes/         # este diretório de ADRs
  .github/workflows/     # CI/CD (build, testes, deploy)
```

## Decisão 4 — Primeiro passo: protótipo navegável com dados fake

Antes de conectar qualquer backend, construímos as telas principais (grupos, feed,
ranking, calendário) com dados mockados em memória (`src/data/mockData.ts`), validando
a experiência de uso antes de investir na integração com Firebase.

## Decisão 5 — Stack de build e testes

- **Vite + React 19 + TypeScript** — build rápido, tipagem estática reduz bugs em um
  app com vários tipos de dados (usuário, grupo, sessão).
- **Tailwind CSS v4** (plugin oficial do Vite) — estilização utilitária, sem arquivo de
  configuração extra.
- **Vitest + React Testing Library** — testes atômicos (componentes isolados, funções
  utilitárias de data) e de integração (fluxos entre múltiplos componentes).
- **Playwright** — testes globais end-to-end, simulando um usuário real no navegador.

## Consequências

- Como o backend real (Firebase) ainda não está integrado, os dados não persistem
  entre sessões do navegador nem são realmente compartilhados entre usuários — isso é
  esperado nesta fase de protótipo e será resolvido no próximo passo.
- Testes de "rotas de API" ainda não existem porque não há API própria: quando o
  Firebase for integrado, a camada de acesso a dados (`src/services/`, a ser criada)
  ganhará testes de integração contra o Firestore (usando o Firebase Local Emulator
  Suite, gratuito, para não depender de credenciais reais em CI).
- Ranking é calculado por mês corrente (reinicia todo mês), assim como no Gymrats.
