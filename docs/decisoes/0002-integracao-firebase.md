# ADR 0002 — Integração com Firebase

- **Status:** em andamento (projeto Firebase criado; Firestore ativo; Storage adiado)
- **Data:** 2026-09-23

## Contexto

O ADR 0001 já havia decidido usar Firebase (Firestore + Authentication) como backend,
mantendo dados fake em memória até essa etapa. Agora vamos substituir os dados fake
por dados reais, compartilhados entre os usuários.

Três decisões de arquitetura foram delegadas ao usuário e respondidas:

## Decisão 1 — Autenticação: Google Sign-In

**Escolhida pelo usuário.** Cada pessoa entra com a própria conta Google, sem senha
para gerenciar. Alternativas descartadas: e-mail/senha (mais telas e fricção, exige
fluxo de recuperação de senha) e login anônimo com nome escolhido (não impede que
alguém "vire" outra pessoa trocando de navegador).

## Decisão 2 — Foto de perfil: Firebase Storage (revisada em 2026-09-23)

**Escolha original do usuário:** ativar o Firebase Storage desde já, enviando a foto
de perfil para `avatars/{uid}/...`, visível para os outros membros do grupo.

**Revisão:** ao tentar ativar o Storage no Console, descobrimos que, desde
setembro de 2024, o Cloud Storage for Firebase (mesmo o bucket padrão) passou a
exigir o plano pago **Blaze** (pay-as-you-go com cartão cadastrado) — não há mais
opção de usá-lo no plano gratuito Spark. O Blaze continua tendo uma camada
gratuita generosa que cobriria tranquilamente o uso de 5 a 10 pessoas, mas exige
cadastrar um cartão de crédito.

**Decisão do usuário:** adiar o Storage. Por enquanto, o upload de foto de perfil
sai do escopo desta etapa da migração — o campo `avatarUrl` continua existindo em
`src/types.ts` para o futuro, mas o `ProfileModal` só vai persistir o campo "Sobre"
no Firestore nesta rodada. A UI de troca de foto será removida/desativada até essa
decisão ser retomada.

## Decisão 3 — Modelagem de dados no Firestore

Proposta (não é uma decisão que exija bloquear o usuário, mas fica registrada para
revisão):

```
users/{uid}
  name: string
  initials: string
  avatarClass: string        # cor de fallback quando não há foto
  avatarUrl?: string         # URL do Firebase Storage
  bio?: string
  createdAt: Timestamp

groups/{groupId}
  name: string
  description: string
  inviteCode: string
  memberIds: string[]        # array de uids
  createdBy: uid
  createdAt: Timestamp

sessions/{sessionId}
  userId: uid
  title: string
  description: string
  durationMinutes: number
  groupIds: string[]
  createdAt: Timestamp
```

Coleções no nível raiz (não aninhadas), iguais em espírito ao que já existia em
`src/types.ts` — a migração dos dados fake para o Firestore deve ser direta.

## Decisão 4 — Regras de segurança do Firestore/Storage (simplificadas para o porte do app)

Dado que o app é para uso de ~5 a 10 pessoas conhecidas (não um produto público), a
proposta é:

- `users/{uid}`: qualquer usuário autenticado pode **ler** qualquer perfil (precisa
  ver nome/foto/bio dos colegas no feed e ranking); só o próprio dono pode
  **escrever** no seu documento.
- `groups/{groupId}`: qualquer usuário autenticado pode **ler** todos os grupos
  (mantém o comportamento atual de "grupos disponíveis para entrar") e **criar**
  grupos novos (desde que se inclua como único membro inicial). Entrar em um grupo é
  uma atualização que só pode adicionar o próprio uid a `memberIds`, nada mais.
- `sessions/{sessionId}`: qualquer usuário autenticado pode **ler** todas as sessões
  (necessário para o feed e ranking); só o autor pode **criar/editar/apagar** as
  próprias sessões, e o `userId` da sessão precisa bater com quem está autenticado.
- `avatars/{uid}/*` (Storage): leitura pública para qualquer autenticado; escrita só
  pelo dono do uid.

Essa é uma simplificação deliberada (não há grupos "privados" de verdade nem
permissões por papel/admin) apropriada para o tamanho do grupo hoje. Se o app
crescer, regras mais restritivas por grupo podem ser adicionadas depois — fica
registrado aqui como possível revisão futura, não como decisão definitiva.

## Decisão 5 — Variáveis de ambiente e deploy

A configuração do Firebase (`apiKey`, `authDomain`, `projectId` etc.) **não é um
segredo** no sentido tradicional — ela é embutida no bundle JS do cliente por
natureza, e a segurança de verdade vem das regras do Firestore/Storage (Decisão 4),
não de esconder essas chaves. Mesmo assim, por organização, elas ficam em variáveis
de ambiente (`VITE_FIREBASE_*`) e não são commitadas diretamente:

- Localmente: arquivo `.env.local` (git-ignorado), a partir do `.env.example`
  versionado.
- No GitHub Actions (deploy para o GitHub Pages): como *repository secrets*, injetadas
  como variáveis de ambiente no passo de build do workflow.

## Próximos passos

1. ~~Usuário cria o projeto no Firebase e ativa Firestore, Authentication (Google)~~ —
   feito. Storage foi adiado (Decisão 2 revisada).
2. ~~Usuário repassa as credenciais do app Web do Firebase~~ — feito.
3. Implementação, em passos atômicos:
   - [x] `src/lib/firebase.ts` (inicialização de app/auth/Firestore a partir das
     variáveis `VITE_FIREBASE_*`), `.env.example`/`.env.local`.
   - [x] Tela de login com Google Sign-In + `AuthContext` (cria `users/{uid}` no primeiro login).
   - [ ] Migração do `AppContext` de dados fake para Firestore em tempo real
     (`onSnapshot`) em `users`/`groups`/`sessions`.
   - [ ] `ProfileModal` passa a persistir só o campo "Sobre" no Firestore; upload de
     foto fica desativado (ver Decisão 2 revisada).
   - [ ] `firestore.rules` publicadas conforme Decisão 4.
   - [ ] Segredos configurados no GitHub Actions (`deploy.yml`).
4. Testes de integração contra o Firestore usando o Firebase Local Emulator Suite
   (gratuito, sem depender de credenciais reais em CI) — como já previsto no ADR 0001.
5. Quando a decisão do Storage for retomada: ativar Blaze com alerta de orçamento
   configurado, então implementar upload de foto para `avatars/{uid}/...`.
