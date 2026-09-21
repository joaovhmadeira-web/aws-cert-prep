# AWS Cert Prep

Sistema de preparação para certificações AWS: informações oficiais das provas, conteúdo de estudo, simulados, vídeos e um motor que indica material conforme os seus erros. É um site **estático** (HTML/CSS/JS puro, sem build), pensado para **GitHub Pages** e **uso no celular** (PWA instalável, funciona offline).

> **Última atualização deste documento:** 2026-09-20 · **Estado:** app completo com trilhas, vídeos, materiais oficiais, **banco de questões nas 13 provas** e ícones oficiais de serviço, **smoke test headless feito** (ver seção 8) — falta apenas testar manualmente num navegador/celular real e ampliar as lições de estudo para além de CLF/SAA/DVA/SOA.

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
  views-tracks.js          Trilhas (agrupamento de provas por objetivo + progresso comparado entre elas)
  main.js                  valida tags contra a taxonomia e chama AWSPREP.boot()
data/
  taxonomy.js              serviços (slug -> [nome, categoria]) e tópicos (slug -> nome); AWSPREP.add()
  certs.js                 dados oficiais das provas + regras gerais
  guides.js                task statements dos exam guides (gerado)
  tracks.js                trilhas: agrupamentos de certId's por objetivo (AWSPREP.tracks)
  study/*.js               lições (AWSPREP.add("lessons", [...]))
  questions/<cert>.js      questões (AWSPREP.addQ("<cert>", [...]))
tools/serve.js             servidor estático local (node tools/serve.js 8080)
```

Tudo é carregado por `<script>` (não `fetch`), então o app também abre por `file://` (exceto vídeo embutido, que precisa de http/https).

### Rotas (hash)
`#/` painel · `#/trilhas`, `#/trilhas/<id>` · `#/provas`, `#/provas/<id>` · `#/estudar`, `#/estudar/<lessonId>`, `#/materiais` · `#/simulados`, `#/simulados/run`, `#/simulados/resultado/<n>` · `#/videos` · `#/config`

### Trilhas (`data/tracks.js`, `js/views-tracks.js`)
Uma trilha (`{ id, name, desc, certs:[certId,...] }`) agrupa certificações por objetivo profissional (ex.: Arquitetura, Dados & ML, Segurança); uma mesma prova pode aparecer em mais de uma trilha, e nenhuma é pré-requisito da outra (`AWSPREP.general.prerequisites`). `#/trilhas` lista todas com uma barra de progresso agregada e um chip de status por certificação (não iniciada / em andamento / pronta — nota do último simulado ≥ nota mínima); `#/trilhas/<id>` detalha cada prova da trilha (lições, vídeos, último simulado, nº de tentativas) e permite trocar a certificação em foco sem sair da tela. Isso dá uma visão do progresso **entre** certificações diferentes, complementando o Painel (que só mostra a prova em foco no seletor do topo).

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

**Vídeo** (`data/videos.js`, `AWSPREP.add("videos", [...])`)
```js
{ id: "yt-XXXXXXXXXXX", yt: "XXXXXXXXXXX", title, ch: "canal", lang: "pt"|"en", dur: minutos,
  kind: "course"|"deepdive"|"explainer", lvl: 1-3, y: 2025,
  dom: { saa:[1,2] }, svc: [...], top: [...] }
```
**Material oficial** (`data/resources.js`, `AWSPREP.add("resources", [...])`): `{ id, title, url, type: "whitepaper"|"docs"|"skillbuilder"|"lab"|"practice", free: true, desc, lvl, dom, svc, top }`. `dom` pode usar a chave especial `"*"` para materiais transversais (não específicos de uma prova, ex.: Well-Architected Framework).

## 5. Motor de recomendação (js/recommender.js)

1. **Necessidade por tag**: para cada questão respondida, erros somam peso a suas `svc`, `top` e domínio; peso decai com meia-vida de **30 dias**; cada acerto abate 0,35 do peso de erro da tag (`necessidade = erros − 0,35·acertos`).
2. **Score de um item** (lição, vídeo ou material) = `Σ necessidade(svc) + 0,7·Σ necessidade(top) + 0,6·média necessidade(domínio)`, normalizado pelo nº de tags, com ajustes: distância de nível da certificação, idioma preferido (+15%), conteúdo recente (+8%), já concluído (×0,35).
3. Cada recomendação traz o **"por que"** (as tags que casaram). Usado no Painel, na tela de Vídeos, no fim de cada simulado e, por questão, na revisão ("Estude para esta questão").
4. `forQuestion(q)` faz o mesmo casamento usando só as tags da própria questão.

## 6. Como publicar no GitHub Pages

**Publicado em:** https://joaovhmadeira-web.github.io/aws-cert-prep/ (repositório `joaovhmadeira-web/aws-cert-prep`, **público** — necessário para Pages gratuito; `Settings → Pages → Deploy from a branch → main / root`).

1. Repositório → **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`**. (Em conta gratuita o Pages exige repositório **público**.)
2. O site fica em `https://<usuario>.github.io/<repo>/`. Todos os caminhos são relativos e o roteamento é por hash, então funciona em subpasta.
3. Ao publicar novos dados, **incremente `DATA_VERSION`** em `js/datafiles.js` (invalida cache dos scripts e do service worker).
4. No celular: abrir a URL e usar "Adicionar à tela inicial" (Android/Chrome e iOS/Safari).
5. Teste local: `node tools/serve.js 8080` → http://localhost:8080 (service worker exige http/https).
6. Cada `git push` para `main` publica uma nova versão automaticamente (build "legacy" do Pages, sem necessidade de Actions); a propagação leva ~1 minuto.

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
- [x] **350 questões** originais de simulado cobrindo as **13 provas** (`data/questions/<cert>.js`), distribuídas proporcionalmente aos pesos oficiais de cada domínio, cada uma com explicação comentando a alternativa certa e cada distrator: `saa` 28, `clf` 28, `aif` 28, `aib` 22, `dva` 28, `soa` 28, `dea` 28, `mla` 28 (guia MLA-C02), `sap` 26, `dop` 26, `aip` 26, `scs` 28, `ans` 26. Validado estruturalmente (índices de resposta, nº de opções por tipo, tags da taxonomia, domínios válidos) e testado ponta a ponta (montagem dos 5 modos de simulado, correção e recomendador) para as 13 certificações — zero problemas.
- [x] Verificado na fonte oficial: planos de suporte atuais (Business Support+, Enterprise Support, Unified Operations; a lição cita também a nomenclatura clássica).
- [x] **Trilhas** (`#/trilhas`): 8 agrupamentos de certificações por objetivo (Fundamentos, Arquitetura, Dev & DevOps, Operações, Dados & ML, IA, Segurança, Redes), com progresso comparado entre as provas de cada trilha (lições, vídeos, último simulado) e troca rápida da certificação em foco.
- [x] **Smoke test headless** (Node + jsdom, já que não há navegador disponível neste ambiente): carrega todos os scripts na ordem de `datafiles.js`, chama `AWSPREP.boot()` e navega por todas as rotas, para todas as 13 certificações, verificando ausência de exceções e de avisos de tags fora da taxonomia. Encontrou e corrigiu **dois bugs de sintaxe que impediam o app inteiro de carregar**: regex de rotas do menu inferior sem escapar `/` em `js/ui.js` (`TABS`) e aspas trocadas no botão "Anterior" do simulado em `js/views-quiz.js`. Ainda falta o teste manual num navegador/celular real (viewport, toque, PWA).
- [x] **87 vídeos** do YouTube (`data/videos.js`), todos com o ID validado via oEmbed antes de entrar no arquivo (nenhum inventado): cursos completos gratuitos (freeCodeCamp, Go Cloud Architects, Johnny Chivers etc.), deep dives oficiais AWS re:Invent e explainers curtos, cobrindo as 13 provas (78 em inglês, 9 em PT-BR — canais Zappts, Canal da Cloud, AWS Developers LATAM, Jean Diogo, Augusto Galego, Cloud For All). AIB (beta, muito recente) ficou com só 2 por falta de conteúdo real disponível — não foram forçados vídeos genéricos.
- [x] **63 materiais oficiais** (`data/resources.js`), todas as URLs validadas: exam guide + Skill Builder Exam Prep Plan + Official Practice Question Set gratuito para cada uma das 13 provas, mais 22 materiais transversais (Well-Architected Framework e os 6 pilares + 3 lentes, IAM, Shared Responsibility Model, políticas antes da prova, um workshop oficial de rede, docs de Bedrock/SageMaker, IA responsável, AWS CAF, Pricing Calculator, Compliance Programs).
- [x] **Ícones oficiais de serviço** (`icons/services/`, 140/144 serviços da taxonomia): baixados do pacote oficial AWS Architecture Icons e usados nos chips de serviço em toda a interface (lições, vídeos, materiais, revisão de questões). Ver seção 10 para o licenciamento e o aviso de não afiliação com a AWS.

### Pendente (ordem sugerida)
1. **Teste manual em navegador/celular real**: abrir `http://localhost:8080` (o smoke test headless da seção acima já cobriu ausência de erros de carregamento/rota, inclusive montando os 5 modos de simulado nas 13 provas), fazer um simulado até o fim na tela, assistir um vídeo e testar em viewport de celular.
2. **Ampliar o banco de questões**: hoje entre 22 e 28 por prova; aumentar gradualmente (meta original era 25-30, já atingida na maioria) e considerar levar SAA a 40+ por ser a prova mais popular.
3. **Lições que faltam**: engenharia de dados (Kinesis/Glue/Athena/EMR/Lake Formation/Redshift, formatos e particionamento, governança), IA/ML/GenAI (fundamentos, Bedrock, RAG, agentes/AgentCore, IA responsável, SageMaker: preparo, treino, deploy/MLOps, monitoramento), AI Business Strategist (estratégia, valor/ROI, governança, prontidão), Professional/Specialty (organização complexa, migração/modernização, segurança avançada, redes avançadas: TGW/Cloud WAN/DX/BGP/IPv6). Hoje as lições cobrem só CLF/SAA/DVA/SOA e partes de SAP/DOP/SCS/ANS — as demais 9 provas dependem só de vídeos/materiais/questões por enquanto.
4. **Verificar URLs** em `data/certs.js` (`guideUrl` e `skillBuilder` de algumas provas foram inferidas por padrão, não confirmadas: DVA-C02 Skill Builder, SAP-C02 e DOP-C02 guide/Skill Builder etc. — parte já foi revalidada ao montar `data/resources.js`).
5. **Reforçar vídeos de AIB, MLA, DOP e AIP** (as certs com menos vídeos hoje: 2, 6, 4 e 8 respectivamente) conforme surgir mais conteúdo público sobre elas.
6. **Script de validação** (`tools/validate.js`): tags existentes na taxonomia, `a` dentro de `o`, domínio válido por cert, IDs únicos, links de vídeo respondendo. Poderia rodar o mesmo smoke test de carregamento/rotas/simulados como parte do CI.
7. Ajustes de UX no celular após teste real (tamanho de toque, rolagem do navegador de questões, PWA no iOS).
8. Opcional: sincronização real entre dispositivos (ex.: GitHub Gist do próprio usuário) — hoje só export/import manual.

### Riscos / avisos
- Fatos que mudam rápido (preços, datas de descontinuação, nomes de planos) foram verificados em 2026-09-20; reconfirmar antes de agendar prova. `AWSPREP.meta.collectedAt` mostra a data na interface.
- O conteúdo de estudo foi escrito a partir de conhecimento técnico geral + exam guides; conferir números de limites/preços na documentação oficial quando decisivo.
- A nota do simulado é aproximação; não reflete a escala real da AWS.

## 9. Fontes oficiais usadas
- https://aws.amazon.com/certification/ (e páginas por prova)
- https://aws.amazon.com/certification/faqs/ e /policies/before-testing/
- Exam guides: `d1.awsstatic.com/training-and-certification/docs-*/…_Exam-Guide.pdf` e `docs.aws.amazon.com/aws-certification/latest/<prova>/<prova>.html`
- https://aws.amazon.com/premiumsupport/plans/

## 10. Ícones de serviço e marcas (`icons/services/`)

`icons/services/<slug>.svg` (140 arquivos, ~525 KB) são os **AWS Architecture Icons** oficiais (pacote `Icon-package_07312026`, baixado de `aws.amazon.com/architecture/icons/`), **não modificados**, usados apenas para representar o respectivo serviço AWS nos chips de serviço da interface (`A.svcIcon(slug)` em `js/lib.js`, chamado por `A.tagChips` em `js/ui.js`). O mapeamento slug → arquivo está em `data/service-icons.js`; 4 slugs da taxonomia não têm ícone oficial correspondente (`sct`, `sam`, `cost-anomaly`, `migration-hub` — ficam só com o chip de texto) e alguns slugs de sub-recursos do SageMaker/Bedrock (`clarify`, `model-monitor`, `jumpstart`, `data-wrangler`, `feature-store`, `sm-pipelines`, `model-registry`, `sm-endpoints`, `bedrock-kb`, `bedrock-guardrails`) reaproveitam o ícone do serviço "pai" (SageMaker AI / Bedrock), pois a AWS não distribui um ícone de arquitetura próprio para eles.

**Licenciamento:** conforme as [Diretrizes de marca da AWS](https://aws.amazon.com/trademark-guidelines/), os ícones são propriedade da Amazon Web Services, Inc.; o uso permitido é para representar os respectivos serviços, sem alterar cor/proporção/forma e sem implicar afiliação, patrocínio ou endosso da AWS. Este projeto é um estudo pessoal, não comercial, não afiliado, não endossado e não patrocinado pela AWS — esse aviso aparece em `#/config`. "AWS" e os nomes de serviços citados são marcas da Amazon.com, Inc. ou afiliadas. Para atualizar os ícones em uma nova versão trimestral do pacote, repita o processo de correspondência slug → arquivo (nomes de arquivo usam o nome completo do serviço, não a sigla, ex. `Arch_Amazon-Elastic-Container-Service_48.svg` para `ecs`) e substitua os SVGs em `icons/services/`.
