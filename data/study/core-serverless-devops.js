/* Lições compartilhadas: serverless, integração, observabilidade, DevOps, DR, custos e migração. */
AWSPREP.add("lessons", [
{
  id: "lambda-core", title: "AWS Lambda: modelo de execução, limites e integrações", min: 12, ord: 30, lvl: 2, y: 2026,
  dom: { dva: [1, 3, 4], saa: [2, 3], soa: [1, 3], dop: [1, 3], clf: [3] }, svc: ["lambda", "sqs", "eventbridge", "api-gateway", "xray", "sam"], top: ["serverless", "event-driven", "scalability", "troubleshooting"],
  body: `## Modelo
- Executa código **sem servidores**; cobra por **requisições + duração (ms × memória)**. **Memória 128 MB–10.240 MB** (CPU proporcional; 1.769 MB ≈ 1 vCPU); **timeout máx. 15 min**; **/tmp** 512 MB–10 GB; pacote .zip 50 MB (zip) / 250 MB descompactado; imagem de contêiner até **10 GB**.
- **Runtimes** gerenciados, custom runtime, contêineres. **Arquiteturas** x86 e **arm64 (Graviton, ~20% mais barato)**.
- **Ciclo de vida**: cold start (INIT: extensões, runtime, código de inicialização) → invocações. Reutilização do ambiente: inicialize clientes/conexões **fora do handler**.

## Invocação
| Modelo | Exemplos | Comportamento de erro |
|---|---|---|
| **Síncrono** | API Gateway, ALB, SDK \`RequestResponse\` | Erro volta ao chamador; **você** faz retry |
| **Assíncrono** | S3, SNS, EventBridge | Lambda tenta **2 vezes** (retries configuráveis 0–2); **DLQ** ou **destinos on-failure/on-success** |
| **Polling (event source mapping)** | **SQS, Kinesis, DynamoDB Streams, MSK** | SQS: mensagem volta à fila após visibility timeout; **Kinesis/DDB**: bloqueia o shard até resolver (use **bisect batch**, **maximum retry**, on-failure destination); **ReportBatchItemFailures** |
- **SQS como fonte**: batch até 10.000 (padrão FIFO 10), visibility timeout ≥ **6× timeout da função**, DLQ na **fila** (não na função), concorrência escala até 1.250/min; **maximum concurrency** limita.

## Concorrência
- Limite **regional padrão 1.000** (pode aumentar). **Reserved concurrency** = garante E limita uma função (também protege downstreams; 0 = desabilita). **Provisioned concurrency** = **pré-aquece** instâncias (elimina cold start; cobra); **SnapStart** (Java, Python, .NET) reduz cold start com snapshot.
- Erro **429 TooManyRequests / Throttles** → aumentar limites, reserved, ou usar fila.

## Versões, aliases e deploy
- **Versão** publicada é imutável; **alias** aponta a versões e faz **deploy ponderado** (canary/linear via **CodeDeploy** ou SAM \`DeploymentPreference\`). **Layers** (até 5) compartilham dependências/runtime.
- **Variáveis de ambiente** (cifrar com KMS; não guarde segredos em texto claro → **Secrets Manager/Parameter Store**, com **Lambda extension**/cache).
- **Function URL** (HTTPS direto; auth IAM/none), **Lambda@Edge**, **VPC**: com ENI Hyperplane; para acessar internet a partir de VPC, precisa **NAT**; para AWS privadamente, **VPC endpoints**.
- **Permissões**: **execution role** (o que a função pode fazer) × **resource-based policy** (quem pode invocá-la).
- **Observabilidade**: CloudWatch Logs/Metrics (Invocations, Errors, Duration, Throttles, **IteratorAge** para streams, ConcurrentExecutions), **X-Ray** (tracing ativo), **Lambda Insights**, **Powertools**.
- **Durable Functions** (fluxos de longa duração com checkpoint) são novidade recente; para orquestração clássica use **Step Functions**.

> **Dica de prova:** "Processar arquivos enviados ao S3 automaticamente" → evento S3 → Lambda. "Tarefa > 15 min" → **Step Functions/ECS/Batch**. "Controlar taxa de invocações ao banco" → **reserved concurrency** ou fila. "Reduzir cold start em Java" → **SnapStart** ou provisioned concurrency.

> **Pegadinha:** DLQ de função só vale para **invocação assíncrona**; para SQS configure DLQ **na fila**. Lambda em VPC **não** tem internet sem NAT.`
},
{
  id: "containers-core", title: "Contêineres: ECS, EKS, Fargate e ECR", min: 9, ord: 31, lvl: 2, y: 2025,
  dom: { dva: [1, 3], saa: [2, 3], sap: [2, 4], dop: [1, 3], soa: [3], clf: [3] }, svc: ["ecs", "eks", "fargate", "ecr", "app-runner", "elb"], top: ["containers", "scalability", "deployment-strategies"],
  body: `## Escolha
| | **ECS** | **EKS** | **App Runner** |
|---|---|---|---|
| O que é | Orquestrador **proprietário AWS**, simples | **Kubernetes** gerenciado (control plane) | Deploy de app web/API a partir de código/imagem, quase zero-ops |
| Modo de computação | **EC2** ou **Fargate** | EC2 (managed node groups), **Fargate**, **EKS Auto Mode** | Gerenciado |
| Quando | Integração profunda AWS, menos complexidade | Portabilidade K8s, ecossistema, multi-cloud | Menor esforço operacional |
- **Fargate**: serverless para contêineres (sem gerenciar instâncias); paga por vCPU/memória/s; **Fargate Spot** para tolerantes a interrupção.
- **ECR**: registro privado/público de imagens; **scan** (básico/**Inspector aprimorado**), **replicação** cross-region/account, **lifecycle policies**, imutabilidade de tags.

## Conceitos ECS
- **Task definition** (imagens, CPU/mem, portas, **task role** = permissões da aplicação; **execution role** = ECR/logs/segredos), **Service** (mantém N tarefas, integra ALB, **deployment**: rolling, **blue/green via CodeDeploy**, **circuit breaker**), **Capacity providers** (EC2 ASG/Fargate). Rede: \`awsvpc\` (ENI por task, SG por task).
- **Service Connect/Cloud Map** para descoberta de serviços; **Secrets Manager/SSM** injetados como env; logs via **awslogs/FireLens**.
- **Auto scaling** de serviço por métricas (target tracking; fila).

## EKS
- Control plane multi-AZ gerenciado; **IRSA / EKS Pod Identity** para permissões por pod (não use o role do nó); **Karpenter** para escala de nós; **Cluster Autoscaler**; **ALB Ingress (AWS Load Balancer Controller)**; **CoreDNS/VPC CNI**; upgrades de versão por você.

> **Dica de prova:** "Rodar contêineres sem gerenciar servidores" → **Fargate**. "Já usa Kubernetes on-prem e quer migrar" → **EKS**. "Permissão IAM por pod" → **IRSA/Pod Identity**. "Permissão IAM por task ECS" → **task role**.`
},
{
  id: "integration-core", title: "Integração: SQS, SNS, EventBridge, Step Functions e Kinesis", min: 13, ord: 32, lvl: 2, y: 2026,
  dom: { saa: [2], dva: [1], dop: [1, 3, 5], soa: [1], sap: [2, 3], dea: [1], clf: [3] }, svc: ["sqs", "sns", "eventbridge", "step-functions", "kinesis", "mq", "appsync"], top: ["loose-coupling", "event-driven", "serverless", "scalability", "streaming"],
  body: `## SQS
- Fila **pull**; **Standard** (throughput quase ilimitado, **at-least-once**, ordem best-effort) × **FIFO** (ordem por **MessageGroupId**, **exactly-once processing** via deduplicação por 5 min; **300 msg/s** sem batching, 3.000 com batching; **high throughput mode** maior).
- **Visibility timeout** (30 s padrão, até 12 h) — se o consumidor não apagar a mensagem a tempo, ela reaparece (duplicidade → torne o processamento **idempotente**). **Retenção** 1 min–14 dias (padrão 4). **Long polling** (até 20 s) reduz custo e respostas vazias. **DLQ** com \`maxReceiveCount\`; **redrive**. **Delay queue** (até 15 min). Mensagem até **256 KB** (maior → **Extended Client Library + S3**). **SSE** com SQS-managed ou KMS.

## SNS
- **Pub/sub push** (tópicos): Lambda, SQS, HTTP/S, e-mail/SMS, mobile push, **Firehose**. **Fan-out SNS → várias SQS** (padrão clássico). **Filtragem de mensagens** por atributos/corpo. **FIFO topics** (com SQS FIFO). DLQ nas **assinaturas**.

## EventBridge
- **Barramento de eventos** (default, custom, parceiros SaaS): **regras** com padrões de evento → **20+ alvos** (Lambda, SQS, Step Functions, API destinations…). **Scheduler** (cron/rate/única vez em escala), **Pipes** (origem → filtro/enriquecimento → alvo), **Archive/Replay**, **Schema Registry**, entre contas/regiões. Substitui CloudWatch Events.

## Step Functions
- Orquestração **visual** (ASL/JSON). **Standard** (até 1 ano, exactly-once, auditável, preço por transição) × **Express** (até 5 min, at-least-once, alto volume, preço por execução/duração). Estados: Task, Choice, Parallel, **Map** (inclusive **Distributed Map** com milhões de itens do S3), Wait, Pass, Fail/Succeed. **Retry/Catch** com backoff; **integrações otimizadas** com 200+ serviços, **callback \`.waitForTaskToken\`** e **.sync** (esperar job). **Saga** para transações distribuídas.

## Kinesis (streaming)
- **Data Streams**: shards (**1 MB/s ou 1.000 rec/s de escrita; 2 MB/s de leitura por shard**), retenção 24 h–365 dias, **modo on-demand** ou provisionado, **fan-out aprimorado** (2 MB/s por consumidor), ordem **por partition key**, replay. **Data Firehose**: entrega **quase real-time** gerenciada para S3/Redshift/OpenSearch/Splunk/Iceberg com transformação Lambda e buffer (sem replay). **Managed Service for Apache Flink**: processamento com estado/janelas. **MSK**: Kafka gerenciado.

## Quando usar
| Cenário | Escolha |
|---|---|
| Desacoplar produtor/consumidor, buffer de carga | **SQS** |
| Notificar vários destinos ao mesmo tempo | **SNS** (+SQS) |
| Rotear eventos por regra entre serviços/SaaS/contas | **EventBridge** |
| Fluxo com estado, ramificações, retries e humano no loop | **Step Functions** |
| Stream ordenado com replay, múltiplos consumidores | **Kinesis / MSK** |
| Migrar broker JMS/AMQP/MQTT existente | **Amazon MQ** |

> **Pegadinha:** SQS **Standard** pode entregar duplicado e fora de ordem; ordem estrita → **FIFO**. **SNS não persiste** mensagens (sem assinantes ativos, perde) — use **SQS** para durabilidade.`
},
{
  id: "api-cognito", title: "API Gateway, AppSync e Cognito", min: 10, ord: 33, lvl: 2, y: 2025,
  dom: { dva: [1, 2, 4], saa: [1, 2, 3], sap: [2], soa: [5], scs: [4], dop: [1] }, svc: ["api-gateway", "appsync", "cognito", "waf", "lambda"], top: ["api-design", "serverless", "identity-access", "caching"],
  body: `## API Gateway
| Tipo | Características |
|---|---|
| **REST API** | Mais recursos: **chaves de API/usage plans**, **cache** (0,5–237 GB), **request/response mapping (VTL)**, validação, **WAF**, **stages**, **canary release**, endpoints **Edge/Regional/Privado** |
| **HTTP API** | Mais simples, **~70% mais barata**, menor latência, JWT authorizer nativo; menos recursos |
| **WebSocket API** | Conexões bidirecionais (chat, tempo real); rotas \`$connect/$disconnect/$default\` |
- **Autorização**: **IAM (SigV4)**, **Cognito user pools authorizer**, **Lambda authorizer** (token/request; cache de política), **JWT** (HTTP API), mTLS.
- **Limites**: timeout de integração **29 s** (padrão; pode aumentar) e payload **10 MB**; **throttling** 10.000 rps por conta/região (burst 5.000) + por stage/método/usage plan → **429**; erro **502** (resposta inválida da integração), **504** (timeout), **403** (WAF/authorizer/recurso).
- **Cache** por stage (TTL padrão 300 s); **CORS** precisa de OPTIONS/headers; **integração**: Lambda (proxy × custom), HTTP, AWS service, **VPC Link** para NLB/ALB privados.
- **Stages/variáveis de stage**, **deploy canary**, **custom domain** + ACM.

## AppSync
GraphQL gerenciado com **resolvers** (DynamoDB, Lambda, OpenSearch, HTTP, Aurora), **subscriptions em tempo real** (WebSocket), **offline sync**, auth (API key, IAM, Cognito, OIDC, Lambda).

## Cognito
| | **User Pools** | **Identity Pools** |
|---|---|---|
| Função | **Autenticação** (diretório de usuários, sign-up/sign-in, MFA, federação social/SAML/OIDC, **JWT: ID/Access/Refresh tokens**, hosted UI, OAuth 2.0) | **Autorização**: troca token (Cognito/social/SAML/anônimo) por **credenciais AWS temporárias** (STS) para acessar S3/DynamoDB direto |
| Retorna | Tokens JWT | Credenciais IAM (roles autenticada/não autenticada) |
- Use juntos: login no **User Pool** → token → **Identity Pool** → credenciais AWS. **Lambda triggers** customizam fluxo (pré-cadastro, pós-confirmação, pré-token).
- **ALB** também autentica com Cognito/OIDC.

> **Dica de prova:** "Login de usuários de app com Google/Facebook + JWT" → **Cognito User Pool**. "App móvel acessar diretamente um bucket S3 com credenciais temporárias" → **Identity Pool**. "Reduzir custo/latência de API simples" → **HTTP API**. "Limitar clientes pagantes por cota" → **usage plans + API keys**.

> **Pegadinha:** timeout de 29 s do API Gateway → operações longas devem ser **assíncronas** (fila/Step Functions, resposta 202).`
},
{
  id: "observability", title: "Observabilidade: CloudWatch, X-Ray e EventBridge", min: 11, ord: 40, lvl: 2, y: 2025,
  dom: { soa: [1], dop: [4, 5], dva: [4], saa: [2, 3], clf: [3], sap: [3] }, svc: ["cloudwatch", "xray", "eventbridge", "sns", "ssm", "cloudtrail"], top: ["monitoring", "logging", "troubleshooting", "automation"],
  body: `## CloudWatch Metrics
- **Namespace / métrica / dimensão**; resolução padrão **1 min** (monitoramento **detalhado** EC2: 1 min; básico: 5 min); **alta resolução** até 1 s (custom). Métricas do **SO (memória, disco)** **não** vêm por padrão em EC2 → **CloudWatch Agent**. Retenção: 1 s por 3 h, 1 min por 15 dias, 5 min por 63 dias, 1 h por 15 meses.
- **Custom metrics** via \`PutMetricData\` ou **Embedded Metric Format (EMF)** em logs.
- **Alarmes**: estados **OK / ALARM / INSUFFICIENT_DATA**; **composite alarms**; **anomaly detection**; ações: **SNS**, **Auto Scaling**, **EC2 actions** (stop/terminate/reboot/**recover**), **Systems Manager OpsItem**; \`TreatMissingData\`.
- **Dashboards** (multi-região/conta), **Metric Math**, **Contributor Insights**, **Synthetics** (canários), **RUM**, **Application Signals** (SLOs), **Internet Monitor**.

## CloudWatch Logs
- Grupos/streams; **retenção** configurável (padrão nunca expira); **Metric filters** (log → métrica → alarme); **Subscription filters** (stream em tempo real → Lambda/Kinesis/Firehose/OpenSearch); **Logs Insights** (consulta); **export para S3** (tarefa assíncrona) ; **agregação cross-account**; **Live Tail**; classe **Infrequent Access**; **Data Protection** (mascarar PII).

## X-Ray
Tracing distribuído: **segmentos/subsegmentos**, **annotations** (indexadas, filtráveis) × **metadata** (não indexada), **service map**, **sampling rules**; requer **daemon/ADOT collector**; Lambda: "Active tracing". Alternativa aberta: **OpenTelemetry (ADOT)**.

## Padrões
- **Alarme → EventBridge/SNS → Lambda/SSM Automation** remedia (reiniciar serviço, aumentar volume).
- Aumente **ASG por métrica custom** (backlog).
- **CloudTrail** ≠ CloudWatch: CloudTrail = *quem chamou API*; CloudWatch = *como o recurso está se comportando*.

> **Dica de prova:** "Monitorar uso de **memória** em EC2" → instalar **CloudWatch Agent**. "Alarme quando log tiver 'ERROR'" → **Metric Filter + Alarm**. "Encontrar gargalo entre microserviços" → **X-Ray**. "Recuperar EC2 com falha de checagem de sistema" → alarme com ação **recover**.`
},
{
  id: "iac-cicd", title: "IaC e CI/CD: CloudFormation, CDK, SAM e Code*", min: 14, ord: 41, lvl: 3, y: 2026,
  dom: { dop: [1, 2], dva: [3], soa: [3], sap: [2, 3], saa: [2] }, svc: ["cloudformation", "cdk", "sam", "codepipeline", "codebuild", "codedeploy", "codeartifact", "ecr", "service-catalog"], top: ["iac", "ci-cd", "deployment-strategies", "automation"],
  body: `## CloudFormation
- **Template** (JSON/YAML: \`Parameters, Mappings, Conditions, Resources, Outputs, Rules, Transform\`) → **stack**. **Change sets** (prévia), **drift detection**, **rollback** automático (falha na criação; \`DisableRollback\`), **DeletionPolicy** (Retain/Snapshot/Delete), **UpdateReplacePolicy**, **stack policy** (protege recursos), **termination protection**, **nested stacks** (reuso) × **cross-stack** (\`Export/ImportValue\`).
- **StackSets**: implanta stacks em **várias contas/regiões** (self-managed × service-managed com Organizations). **Custom resources** (Lambda) para lógica externa; **cfn-init/cfn-signal + CreationPolicy** para esperar bootstrap; **\`!Ref\`, \`!GetAtt\`, \`!Sub\`, \`!ImportValue\`**, \`Fn::If\`.
- **DependsOn**, **WaitCondition**, **helper scripts**, **Macros/Transforms** (\`AWS::Serverless\`). **IaC generator** e **import** de recursos existentes. **Rollback triggers** (alarmes).

## CDK / SAM
- **CDK**: define infra em TypeScript/Python/Java/.NET → sintetiza **CloudFormation** (\`cdk synth/deploy\`, **constructs L1/L2/L3**, **cdk bootstrap**). **SAM**: extensão do CF para **serverless** (\`AWS::Serverless::Function/Api/SimpleTable\`), CLI \`sam build/deploy/local\`, deploy gradual com **CodeDeploy** (\`Canary10Percent5Minutes\`, \`Linear...\`, \`AllAtOnce\`).

## CI/CD nativo
| Serviço | Papel | Detalhes |
|---|---|---|
| **CodeCommit** | Git gerenciado | Repositórios privados na AWS; a disponibilidade mudou nos últimos anos (verifique) — alternativa: GitHub/GitLab/Bitbucket via **CodeConnections** |
| **CodeBuild** | Build/test serverless | \`buildspec.yml\` (phases install/pre_build/build/post_build, artifacts, cache), VPC, ambientes Docker, relatórios |
| **CodeDeploy** | Deploy | **EC2/on-prem**: In-place ou **Blue/Green**; \`appspec.yml\` (hooks: ApplicationStop, BeforeInstall, AfterInstall, ApplicationStart, ValidateService); **Lambda** e **ECS**: blue/green com tráfego **canary/linear/all-at-once** e **rollback automático** por alarme |
| **CodePipeline** | Orquestra estágios | Source → Build → Test → **Approval manual** → Deploy; **ações** cross-region/account; gatilhos Git; variáveis |
| **CodeArtifact** | Repositório de pacotes | npm/Maven/PyPI/NuGet; upstream de repositórios públicos |
| **Elastic Beanstalk** | PaaS | Políticas: **All at once, Rolling, Rolling with additional batch, Immutable, Traffic splitting**, **Blue/Green (swap CNAME)** |

## Estratégias de deploy
| Estratégia | Downtime | Rollback | Custo |
|---|---|---|---|
| All-at-once | Sim | Reimplantar | Baixo |
| Rolling | Não (capacidade reduzida) | Lento | Baixo |
| **Blue/Green** | Não | **Imediato** (trocar tráfego) | Alto (2 ambientes) |
| **Canary** | Não | Rápido | Médio (pequena % primeiro) |
| Immutable | Não | Rápido | Médio (novas instâncias) |

> **Dica de prova:** "Padronizar implantação entre 50 contas e regiões" → **StackSets**. "Prévia das mudanças" → **change set**. "Reverter automaticamente se o alarme disparar durante o deploy" → **CodeDeploy + CloudWatch alarm**. "Manter recurso ao excluir a stack" → **DeletionPolicy: Retain**.`
},
{
  id: "ssm-ops", title: "Systems Manager, Config e automação operacional", min: 9, ord: 42, lvl: 2, y: 2025,
  dom: { soa: [1, 3, 4], dop: [2, 5, 6], sap: [3], saa: [1], scs: [6] }, svc: ["ssm", "config", "cloudformation", "eventbridge", "service-catalog", "trusted-advisor", "health-dashboard"], top: ["automation", "patching", "compliance", "governance", "tagging"],
  body: `## Systems Manager (SSM) — capacidades
| Capacidade | Serve para |
|---|---|
| **Session Manager** | Shell sem SSH/bastion/portas abertas; auditado (CloudTrail/logs em S3/CW); requer **SSM Agent + role** |
| **Run Command** | Executa comandos/documentos em frotas (por tag), com controle de taxa |
| **Patch Manager** | **Patch baselines**, **maintenance windows**, conformidade de patches |
| **State Manager** | Mantém configuração desejada (associações) |
| **Automation** | **Runbooks** (documentos) para remediações: parar instância, criar AMI, aplicar tags; acionados por EventBridge/Config |
| **Parameter Store** | Configuração/segredos hierárquicos (\`/app/prod/db\`); SecureString com KMS |
| **Inventory / Fleet Manager / Distributor** | Inventário de software e gerenciamento remoto |
| **OpsCenter / Explorer / Change Manager** | Gestão de incidentes e mudanças operacionais |
- **Hybrid activations** trazem servidores on-prem como *managed nodes* (mi-xxxx).

## AWS Config
- **Registra configuração** e mudanças (linha do tempo), avalia **regras** (gerenciadas ~ 300+, custom via Lambda/Guard), **conformance packs**, **remediação automática** (SSM Automation), **advanced query** (SQL), aggregator multi-conta. Custo por item de configuração registrado.

## Outras ferramentas
- **Trusted Advisor**: 5+ categorias (custo, performance, segurança, tolerância a falhas, limites de serviço, excelência operacional). Business/Enterprise+ liberam todas as verificações e **API**.
- **AWS Health / Health Dashboard**: eventos de serviço e específicos da sua conta (\`Personal Health Dashboard\`), integração com EventBridge.
- **Service Catalog**: portfólios de produtos (templates CF) aprovados para autoatendimento com governança. **Tag policies** + **tag enforcement** com Config/SCP.

> **Dica de prova:** "Acessar instância privada sem abrir a porta 22" → **Session Manager**. "Aplicar patches conforme janela" → **Patch Manager**. "Corrigir automaticamente Security Group aberto" → **Config rule + remediação SSM Automation**. "Detectar mudança não autorizada de configuração" → **Config**.`
},
{
  id: "dr-resilience", title: "Resiliência e Recuperação de Desastres (DR)", min: 10, ord: 43, lvl: 2, y: 2025,
  dom: { saa: [2], sap: [2, 3], soa: [2], dop: [3], clf: [1] }, svc: ["backup", "drs", "route53", "aurora", "s3", "cloudformation", "dynamodb"], top: ["disaster-recovery", "high-availability", "fault-tolerance", "backup-restore"],
  body: `## Métricas
- **RTO** (Recovery Time Objective): tempo máximo para voltar. **RPO** (Recovery Point Objective): perda de dados aceitável (tempo desde o último ponto de recuperação).

## Quatro estratégias (do mais barato/lento ao mais caro/rápido)
| Estratégia | RTO / RPO | Como |
|---|---|---|
| **Backup & Restore** | Horas / horas | Backups (AWS Backup, snapshots, S3 CRR) restaurados na região DR quando precisa; IaC recria infra |
| **Pilot Light** | Dezenas de minutos / minutos | Dados replicados continuamente (RDS réplica, Aurora Global); infra **mínima** desligada/no núcleo (banco); **escala** o restante no desastre |
| **Warm Standby** | Minutos / segundos | Ambiente completo em **escala reduzida** sempre ligado; escala no failover |
| **Multi-Site Active/Active** | Quase zero / quase zero | Cargas ativas em 2+ regiões (Route 53/Global Accelerator, **DynamoDB Global Tables**, **Aurora Global**, S3 MRAP) |

## Ferramentas
- **AWS Elastic Disaster Recovery (DRS)**: replicação contínua em nível de bloco de servidores (on-prem/outras nuvens/AWS) para uma área de *staging* barata; **recupera em minutos** (RTO minutos, RPO segundos).
- **Route 53** failover + health checks; **Aurora Global Database** (RPO segundos), **RDS cross-region read replica**, **DynamoDB Global Tables**, **S3 CRR**, **EBS snapshots cross-region** (Data Lifecycle Manager), **AWS Backup** (cross-region, cross-account, Vault Lock), **CloudFormation/StackSets** para reconstruir, **AMI copiadas**.
- **Application Recovery Controller (ARC)**: *routing controls* e *readiness checks* para failover regional coordenado.
- **Game days / chaos engineering** (**AWS Fault Injection Service**) validam a recuperação.

## Confiabilidade além do DR
- Multi-AZ por padrão; **health checks** e recuperação automática (ASG/ELB); **desacoplamento**; **timeouts, retries com jitter, circuit breaker**; **limites de serviço (Service Quotas)**; **imutabilidade e IaC**; **backups testados** (restore testing).

> **Dica de prova:** "RPO de segundos entre regiões para MySQL/PostgreSQL" → **Aurora Global Database**. "Custo mínimo, RTO de horas aceitável" → **Backup & Restore**. "Recuperar servidores on-prem na AWS com RTO de minutos" → **Elastic Disaster Recovery**.`
},
{
  id: "cost-billing", title: "Custos, faturamento e planos de suporte", min: 9, ord: 44, lvl: 1, y: 2025,
  dom: { clf: [4], saa: [4], soa: [1], sap: [3], dop: [6] }, svc: ["cost-explorer", "budgets", "savings-plans", "trusted-advisor", "compute-optimizer", "cost-anomaly", "organizations"], top: ["cost-optimization", "pricing-models", "billing", "support-plans", "tagging"],
  body: `## Princípios de preço
Pague pelo que usar; pague menos ao reservar; pague menos por volume; **dados entrando** na AWS geralmente são grátis, **saindo para a internet** cobram (faixa grátis mensal); tráfego **entre AZs** cobra; **mesma AZ com IP privado** é grátis; **S3→CloudFront** é grátis. **Free Tier**: sempre grátis (ex.: Lambda 1 M req/mês), 12 meses, e testes curtos.

## Ferramentas
| Ferramenta | Função |
|---|---|
| **Billing & Cost Management / Cost Explorer** | Visualizar e prever custos (até 12 meses), recomendações de RI/SP |
| **AWS Budgets** | Orçamentos e **alertas** (custo, uso, cobertura de RI/SP) e **ações** (aplicar SCP/IAM, parar instâncias) |
| **Cost and Usage Report (CUR)** | Dados de custo mais detalhados (S3, Athena/QuickSight); **Data Exports** |
| **Cost Anomaly Detection** | ML detecta gastos incomuns |
| **Cost allocation tags** | Ativar (user-defined e AWS-generated) para atribuir custo |
| **Pricing Calculator** | Estimar custo **antes** de construir; **Migration Evaluator** (TCO on-prem) |
| **Compute Optimizer** | Rightsizing (EC2, EBS, Lambda, ECS/Fargate, ASG) baseado em métricas |
| **Trusted Advisor** | Ociosos/subutilizados, RI, limites |
| **Consolidated Billing** | Fatura única, **descontos por volume**, compartilhamento de RI/SP |

## Otimização — checklist
Rightsizing → desligar ocioso → **Savings Plans/RI** → **Spot** → **Graviton** → **S3 lifecycle/Intelligent-Tiering** → **gp3** em vez de gp2 → **VPC endpoints** (evitar NAT) → **serverless** para cargas esporádicas → **CloudFront** (reduz egress da origem) → **Data transfer** entre AZ/região sob controle.

## Planos de suporte
**Atenção à versão do material:** a página oficial (verificada em 2026-09-20) lista hoje **Basic** (incluído para todos), **Business Support+**, **Enterprise Support** e **Unified Operations**, com recursos de IA (ex.: DevOps Agent, recomendações contextuais 24×7) e créditos proporcionais à cobrança do suporte. Provas e cursos ainda podem citar a nomenclatura anterior, que você deve reconhecer:
| Plano (nomenclatura clássica) | Destaques que a prova cobra |
|---|---|
| **Basic** | Grátis; documentação, fóruns, AWS Health, Trusted Advisor com verificações básicas |
| **Developer** | E-mail em horário comercial; 1 contato principal; sem TAM |
| **Business** | Suporte **24×7** (telefone/chat/e-mail); **todas as verificações do Trusted Advisor**; Infrastructure Event Management (opcional); resposta < 1 h para produção fora do ar |
| **Enterprise On-Ramp** | **Pool de TAMs**; revisões operacionais; < 30 min para casos críticos de negócio |
| **Enterprise** | **TAM dedicado**; < 15 min para caso crítico de negócio; Well-Architected reviews, Concierge (faturamento) |
> Regra prática: quanto maior o plano, **mais rápido o tempo de resposta e mais acesso a especialistas (TAM/TAM pool)**. Confirme preços e nomes vigentes em aws.amazon.com/premiumsupport/plans.

> **Dica de prova:** "Alertar quando o custo previsto ultrapassar o orçamento" → **AWS Budgets**. "Ver custo por projeto" → **tags de alocação de custo**. "Gerente técnico de conta dedicado (TAM)" → **plano Enterprise**. "Estimar custo antes de implantar" → **Pricing Calculator**.`
},
{
  id: "migration-core", title: "Migração para a AWS: 7 Rs, MGN, DMS, Snow e Migration Hub", min: 9, ord: 45, lvl: 2, y: 2026,
  dom: { clf: [1, 3], saa: [2, 3], sap: [4], soa: [3] }, svc: ["mgn", "dms", "sct", "migration-hub", "app-discovery", "snow", "datasync", "storage-gateway", "transfer-family"], top: ["migration-strategies", "data-migration", "cloud-concepts"],
  body: `## Estratégias (7 Rs)
| R | Significado | Exemplo |
|---|---|---|
| **Retire** | Desligar o que não é mais necessário | App legado sem uso |
| **Retain** | Manter on-prem (por ora) | Dependência regulatória |
| **Rehost** | "Lift and shift" | Servidores → EC2 com **MGN** |
| **Relocate** | Mover em massa sem alterações | **VMware Cloud on AWS**; RDS/EC2 para outra conta/região |
| **Replatform** | "Lift, tinker and shift" | Banco → **RDS**, app → **Elastic Beanstalk** |
| **Repurchase** | Trocar por SaaS | CRM → Salesforce |
| **Refactor / Re-architect** | Reescrever cloud-native | Monólito → microsserviços/serverless |

## Fases e serviços
- **Avaliar**: **Migration Evaluator** (business case/TCO), **Application Discovery Service** (agentless/agente: inventário, dependências), **Migration Hub** (rastreamento central), **Migration Hub Refactor Spaces**, **AWS Transform** (modernização assistida por IA de .NET/mainframe/VMware).
- **Migrar servidores**: **Application Migration Service (MGN)** — replicação contínua em bloco → cutover com downtime mínimo (substitui CloudEndure/SMS). **VM Import/Export** para imagens pontuais.
- **Migrar bancos**: **DMS** (full load + **CDC**), **SCT** (converter schema para engine diferente), **Babelfish**.
- **Migrar dados**: **DataSync** (online), **Snowball Edge** (offline), **Transfer Family** (SFTP), **Storage Gateway**, **S3 Transfer Acceleration**, **Direct Connect**.
- **Mainframe**: **AWS Mainframe Modernization**.

## Escolha rápida
| Situação | Ferramenta |
|---|---|
| 100 TB, link de 100 Mbps | **Snowball Edge** |
| Servidores físicos/VMs para EC2 com pouco downtime | **MGN** |
| Oracle → Aurora PostgreSQL | **SCT + DMS** |
| Descobrir dependências entre servidores | **Application Discovery Service** |
| Migrar NFS/SMB agendado | **DataSync** |

> **Dica de prova:** Um "**cutover** com mínimo downtime" implica **replicação contínua** (MGN/DMS CDC). "Mover para SaaS" = **Repurchase**. "Reescrever para serverless" = **Refactor**.`
}
]);
