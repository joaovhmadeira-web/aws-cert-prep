# AWS Cert Prep

Sistema de preparação para certificações AWS: informações oficiais das provas, conteúdo de estudo, simulados, vídeos e um motor que indica material conforme os seus erros. É um site **estático** (HTML/CSS/JS puro, sem build), pensado para **GitHub Pages** e **uso no celular** (PWA instalável, funciona offline).

> **Última atualização deste documento:** 2026-09-20 · **Estado:** base funcional montada, conteúdo parcial, **ainda não testada no navegador** (ver seção 8).

---

## 1. Decisões e princípios

| Tema | Decisão | Motivo |
|---|---|---|
| Questões de simulado | **Originais**, no estilo da prova, alinhadas aos domínios/pesos do exam guide oficial. **Não** usar *braindumps* (ExamTopics etc.). | Braindumps são questões vazadas: violam o acordo de confidencialidade da AWS (risco de revogar a certificação e banir), têm direitos autorais e muitas têm gabarito errado. |
| Vídeos | Apenas **links/embeds do YouTube** (canais oficiais AWS e criadores públicos). Nada é baixado nem hospedado. | Direitos autorais. |
| Recência | Cada questão tem `r` (1–3, recência do tema). O simulador tem um controle "Priorizar conteúdo recente" que aumenta o peso de `r` alto e de questões inéditas. | Pedido do usuário. |
| Mapeamento questão → conteúdo | **Por matching de metadados** (serviços + tópicos + domínio + nível), sem vínculo manual. | Pedido do usuário. Ver seção 5. |
| Mobile / GitHub Pages | Layout mobile-first, navegação inferior, caminhos relativos, rota por hash, `.nojekyll`, manifest + service worker. | Pedido do usuário. |
| Visual | Sem emojis; ícones SVG de traço (`AWSPREP.icon(nome)` em `js/lib.js`). | Pedido do usuário. |
| Progresso entre aparelhos | Fica no `localStorage` de cada aparelho. Sincronização por **código copiável / arquivo JSON** (Configurações). Não há backend. | Site estático. |

## 2. Catálogo de certificações (verificado em 2026-09-20)

Coletado nas páginas oficiais `aws.amazon.com/certification/*` e nos exam guides (PDFs em `d1.awsstatic.com` e HTML em `docs.aws.amazon.com/aws-certification`). Dados completos em `data/certs.js`; tarefas/habilidades em `data/guides.js`.

| Id | Prova | Nível | US$ | Min | Questões (pontuam) | Nota mín. | Situação |
|---|---|---|---|---|---|---|---|
| `clf` | Cloud Practitioner CLF-C02 | Foundational | 100 | 90 | 65 (50) | 700 | ativa |
| `aif` | AI Practitioner AIF-C01 | Foundational | 100 | 90 | 65 (50) | 700 | ativa |
| `aib` | AI Business Strategist AIB-C01 | Foundational/Business | 50 beta (100 padrão) | 170 | 85 | 700 | **beta** |
| `saa` | Solutions Architect Associate SAA-C03 | Associate | 150 | 130 | 65 (50) | 720 | ativa |
| `dva` | Developer Associate DVA-C02 | Associate | 150 | 130 | 65 (50) | 720 | **DVA-C03 abre 27/10/2026; último dia C02: 01/12/2026** |
| `soa` | CloudOps Engineer Associate SOA-C03 | Associate | 150 | 130 | 65 (50) | 720 | ativa (antigo SysOps) |
| `dea` | Data Engineer Associate DEA-C01 | Associate | 150 | 130 | 65 (50) | 720 | ativa |
| `mla` | ML Engineer Associate MLA-C01 / C02 | Associate | 150 (C02 beta: 75) | 130 (C02: 170) | 65 (C02: 85) | 720 | **MLA-C01 em inglês encerra 28/09/2026** |
| `sap` | Solutions Architect Professional SAP-C02 | Professional | 300 | 180 | 75 (65) | 750 | **SAP-C03 abre 27/10/2026; último dia C02: 17/11/2026** |
| `dop` | DevOps Engineer Professional DOP-C02 | Professional | 300 | 180 | 75 (65) | 750 | ativa |
| `aip` | Generative AI Developer Professional AIP-C01 | Professional | 300 | 180 | 75 (65) | 750 | ativa |
| `scs` | Security Specialty SCS-C03 | Specialty | 300 | 170 | 65 (50) | 750 | ativa (C03 substituiu C02) |
| `ans` | Advanced Networking Specialty ANS-C01 | Specialty | 300 | 170 | 65 (50) | 750 | **descontinuada: último dia 31/12/2026** |

Regras gerais verificadas (`AWSPREP.general` em `data/certs.js`): escala 100–1000, modelo compensatório, validade 3 anos, refazer após 14 dias, não refazer a mesma prova por 2 anos depois de aprovado, voucher de 50% para recertificar/upgrade, ESL +30 min, idade mínima 13.

Domínios e pesos de cada prova estão em `data/certs.js` (extraídos dos guias oficiais).

## 3. Arquitetura

```
index.html                 shell (topo, <main id=app>, nav); carrega scripts via js/datafiles.js
manifest.webmanifest, sw.js, icons/    PWA (instalável + offline)
.nojekyll                  necessário no GitHub Pages
css/style.css              tema claro/escuro, mobile-first (nav inferior; sidebar >= 900px)
js/
  datafiles.js             LISTA ORDENADA de scripts + DATA_VERSION (usada pelo index e pelo sw.js)
  lib.js                   helpers, ícones SVG, markdown mínimo, store (localStorage)
  recommender.js           motor de recomendação por metadados
  quiz.js                  banco de questões, montagem de prova, correção, estimativa de nota
  ui.js                    roteador por hash, componentes, Painel, Configurações/sincronização
  views-certs.js           Provas (comparativo/detalhe), Estudar (lições), Materiais
  views-quiz.js            Simulados (setup, execução, resultado/revisão)
  views-videos.js          Vídeos
  main.js                  valida tags contra a taxonomia e chama AWSPREP.boot()
data/
  taxonomy.js              serviços (slug -> [nome, categoria]) e tópicos (slug -> nome); AWSPREP.add()
  certs.js                 dados oficiais das provas + regras gerais
  guides.js                task statements dos exam guides (gerado)
  study/*.js               lições (AWSPREP.add("lessons", [...]))
  questions/<cert>.js      questões (AWSPREP.addQ("<cert>", [...]))
tools/serve.js             servidor estático local (node tools/serve.js 8080)
```

Tudo é carregado por `<script>` (não `fetch`), então o app também abre por `file://` (exceto vídeo embutido, que precisa de http/https).

### Rotas (hash)
`#/` painel · `#/provas`, `#/provas/<id>` · `#/estudar`, `#/estudar/<lessonId>`, `#/materiais` · `#/simulados`, `#/simulados/run`, `#/simulados/resultado/<n>` · `#/videos` · `#/config`

### Modos de simulado
Completo (cronometrado, nº de questões e tempo proporcionais ao da prova real, distribuição pelos pesos oficiais), Prática (10/20 com feedback imediato), Por domínio, Pontos fracos (usa o perfil de necessidade), Refazer erradas. A sessão em andamento é salva em `localStorage` (`awsprep.session`) para sobreviver a aba descartada no celular. A nota é uma **estimativa linear** (`100 + 900*acerto%`), rotulada como tal.

## 4. Esquemas de dados (a taxonomia é o contrato)

Toda tag `svc`/`top` deve existir em `data/taxonomy.js` (o `main.js` avisa no console se não existir).

**Questão** (`AWSPREP.addQ(certId, [...])`)
```js
{ d: 1,            // domínio oficial (1..n)
  t: "1.2",        // task statement (opcional)
  q: "enunciado", o: ["A","B","C","D"], a: [1],   // índices corretos (2+ => múltipla resposta)
  e: "explicação em markdown (por que a certa e por que as demais não)",
  s: ["s3","kms"], // serviços
  p: ["encryption"], // tópicos
  l: 2,            // dificuldade 1-3
  r: 2 }           // recência do tema 1-3 (3 = lançado/incluído nos guias em 2025-26)
```
O `id` é gerado por hash do enunciado (estável se a ordem mudar).

**Lição** (`AWSPREP.add("lessons", [...])`)
```js
{ id: "iam-core", title, min: 12, ord: 3, lvl: 2, y: 2025,
  dom: { clf:[2], saa:[1], scs:[4] },   // certId -> domínios em que a lição vale
  svc: [...], top: [...],
  body: `markdown` }  // ##, listas, tabelas, **negrito**, `código`, > **Dica de prova:** / > **Pegadinha:**
```

**Vídeo** (`AWSPREP.add("videos", [...])`) — *ainda não criado*
```js
{ id: "yt-XXXXXXXXXXX", yt: "XXXXXXXXXXX", title, ch: "canal", lang: "pt"|"en", dur: minutos,
  kind: "course"|"deepdive"|"explainer", lvl: 1-3, y: 2025,
  dom: { saa:[1,2] }, svc: [...], top: [...] }
```
**Material oficial** (`AWSPREP.add("resources", [...])`) — *ainda não criado*: `{ id, title, url, type: "whitepaper"|"docs"|"skillbuilder"|"lab"|"practice", free: true, desc, lvl, dom, svc, top }`.

## 5. Motor de recomendação (js/recommender.js)

1. **Necessidade por tag**: para cada questão respondida, erros somam peso a suas `svc`, `top` e domínio; peso decai com meia-vida de **30 dias**; cada acerto abate 0,35 do peso de erro da tag (`necessidade = erros − 0,35·acertos`).
2. **Score de um item** (lição, vídeo ou material) = `Σ necessidade(svc) + 0,7·Σ necessidade(top) + 0,6·média necessidade(domínio)`, normalizado pelo nº de tags, com ajustes: distância de nível da certificação, idioma preferido (+15%), conteúdo recente (+8%), já concluído (×0,35).
3. Cada recomendação traz o **"por que"** (as tags que casaram). Usado no Painel, na tela de Vídeos, no fim de cada simulado e, por questão, na revisão ("Estude para esta questão").
4. `forQuestion(q)` faz o mesmo casamento usando só as tags da própria questão.

## 6. Como publicar no GitHub Pages

1. Repositório → **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`**. (Em conta gratuita o Pages exige repositório **público**.)
2. O site fica em `https://<usuario>.github.io/<repo>/`. Todos os caminhos são relativos e o roteamento é por hash, então funciona em subpasta.
3. Ao publicar novos dados, **incremente `DATA_VERSION`** em `js/datafiles.js` (invalida cache dos scripts e do service worker).
4. No celular: abrir a URL e usar "Adicionar à tela inicial" (Android/Chrome e iOS/Safari).
5. Teste local: `node tools/serve.js 8080` → http://localhost:8080 (service worker exige http/https).

## 7. Como adicionar conteúdo

1. Crie o arquivo em `data/study/` (lições) ou `data/questions/<cert>.js` (questões).
2. Registre o caminho em `js/datafiles.js` (no ponto `/*DATA*/`, **antes** de `js/ui.js`).
3. Use apenas slugs existentes de `data/taxonomy.js` (ou adicione lá primeiro).
4. Incremente `DATA_VERSION`.

---

## 8. STATUS ATUAL

### Concluído
- [x] Coleta de dados oficiais das 13 provas (custo, duração, nº de questões, nota, validade, idiomas, domínios/pesos, avisos de retirada/atualização) e das políticas gerais.
- [x] Task statements estruturados dos exam guides (`data/guides.js`: CLF, AIF, SAA, DVA, DEA, MLA-C01/C02, SAP, DOP, ANS, SOA-C03, AIP, SCS-C03, AIB).
- [x] Taxonomia de metadados (~160 serviços e ~75 tópicos).
- [x] App completo (escrito): Painel, Provas (comparativo + detalhe com domínios/tarefas), Estudar (lições + busca + filtro por domínio), Materiais, Simulados (5 modos + cronômetro + sessão persistente + revisão), Vídeos, Configurações (idioma, tema, exportar/importar progresso, reset).
- [x] Motor de recomendação por metadados.
- [x] PWA (manifest, service worker, ícones), `.nojekyll`, tema claro/escuro, mobile-first, ícones SVG sem emojis.
- [x] **26 lições** compartilhadas (fundamentos, IAM, multi-conta, KMS, detecção, EC2, ELB/ASG, S3, storage, VPC, conectividade híbrida, Route 53/CloudFront, RDS/Aurora, DynamoDB, escolha de banco, Lambda, contêineres, integração, API GW/Cognito, observabilidade, IaC/CI-CD, SSM/Config, DR, custos/suporte, migração). Cobrem principalmente CLF, SAA, DVA, SOA e partes de SAP/DOP/SCS/ANS.
- [x] **28 questões** originais de SAA-C03 distribuídas pelos 4 domínios.
- [x] Verificado na fonte oficial: planos de suporte atuais (Business Support+, Enterprise Support, Unified Operations; a lição cita também a nomenclatura clássica).

### Pendente (ordem sugerida)
1. **Teste de fumaça no navegador** (nunca foi executado): abrir `http://localhost:8080`, olhar o console (erros de sintaxe, tags fora da taxonomia), navegar por todas as rotas, fazer um simulado até o fim, testar em viewport de celular. Ponto de atenção conhecido: sobra uma variável `wrongN` sem uso em `views-quiz.js` (inofensiva).
2. **Vídeos** (`data/videos.js`): pesquisar no YouTube via `browser-harness`, validar cada ID (oEmbed `https://www.youtube.com/oembed?url=...` → 200) e cadastrar com `dom/svc/top`. Meta: ~120 vídeos, com prioridade a canais oficiais AWS e cursos completos gratuitos por certificação, incluindo PT-BR. Incluir no `datafiles.js`.
3. **Materiais** (`data/resources.js`): exam guides, Skill Builder (planos de preparação, *Official Practice Question Sets* e *Official Pretests* gratuitos), whitepapers (Well-Architected, DR, Security Pillar), docs/labs.
4. **Lições que faltam**: engenharia de dados (Kinesis/Glue/Athena/EMR/Lake Formation/Redshift, formatos e particionamento, governança), IA/ML/GenAI (fundamentos, Bedrock, RAG, agentes/AgentCore, IA responsável, SageMaker: preparo, treino, deploy/MLOps, monitoramento), AI Business Strategist (estratégia, valor/ROI, governança, prontidão), Professional/Specialty (organização complexa, migração/modernização, segurança avançada, redes avançadas: TGW/Cloud WAN/DX/BGP/IPv6).
5. **Questões das demais 12 provas**: meta ~25–30 por prova (SAA ampliar para 40+), sempre originais, com explicação de cada distrator e `r` coerente. Prioridade: CLF, AIF, DVA, SOA, DEA, MLA, DOP, SCS, SAP, AIP, ANS, AIB.
6. **Verificar URLs** em `data/certs.js` (`guideUrl` e `skillBuilder` de algumas provas foram inferidas por padrão, não confirmadas: DVA-C02 Skill Builder, SAP-C02 e DOP-C02 guide/Skill Builder etc.).
7. **Script de validação** (`tools/validate.js`): tags existentes na taxonomia, `a` dentro de `o`, domínio válido por cert, IDs únicos, links de vídeo respondendo.
8. Ajustes de UX no celular após teste real (tamanho de toque, rolagem do navegador de questões, PWA no iOS).
9. Opcional: sincronização real entre dispositivos (ex.: GitHub Gist do próprio usuário) — hoje só export/import manual.

### Riscos / avisos
- Fatos que mudam rápido (preços, datas de descontinuação, nomes de planos) foram verificados em 2026-09-20; reconfirmar antes de agendar prova. `AWSPREP.meta.collectedAt` mostra a data na interface.
- O conteúdo de estudo foi escrito a partir de conhecimento técnico geral + exam guides; conferir números de limites/preços na documentação oficial quando decisivo.
- A nota do simulado é aproximação; não reflete a escala real da AWS.

## 9. Fontes oficiais usadas
- https://aws.amazon.com/certification/ (e páginas por prova)
- https://aws.amazon.com/certification/faqs/ e /policies/before-testing/
- Exam guides: `d1.awsstatic.com/training-and-certification/docs-*/…_Exam-Guide.pdf` e `docs.aws.amazon.com/aws-certification/latest/<prova>/<prova>.html`
- https://aws.amazon.com/premiumsupport/plans/
