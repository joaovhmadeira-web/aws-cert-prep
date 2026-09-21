/* Lições compartilhadas: computação, armazenamento e rede. */
AWSPREP.add("lessons", [
{
  id: "ec2-core", title: "EC2: famílias, compra, storage e placement", min: 11, ord: 10, lvl: 1, y: 2025,
  dom: { clf: [3, 4], saa: [3, 4], soa: [1, 2], dva: [1], sap: [3] }, svc: ["ec2", "ebs", "savings-plans", "compute-optimizer"], top: ["pricing-models", "cost-optimization", "performance", "high-availability"],
  body: `## Famílias de instância (prefixo)
| Família | Use para |
|---|---|
| **T** (t3/t4g) | Burstável, baixo custo, cargas com picos ocasionais (créditos de CPU) |
| **M** | Uso geral (balanceado CPU/memória) |
| **C** | Computação intensiva (HPC, batch, encoding, jogos) |
| **R / X / z** | Memória (bancos em memória, SAP HANA, big data) |
| **I / D / H** | Armazenamento local NVMe de alta IOPS / alto throughput |
| **P / G / Inf / Trn** | GPU e aceleradores de ML (treino/inferência) |
Sufixo **g** = Graviton (ARM, melhor preço/desempenho), **a** = AMD, **n** = rede otimizada, **d** = disco local.

## Modelos de compra
| Modelo | Desconto | Quando |
|---|---|---|
| **On-Demand** | 0 | Imprevisível, curta duração, sem compromisso |
| **Reserved (Standard)** | até ~72% | Uso estável 1 ou 3 anos; instância/região específicos (Convertible: ~66%, troca de família) |
| **Savings Plans** | até ~72% | Compromisso em **US$/hora**: **Compute SP** (flexível: EC2, Fargate, Lambda, qualquer região/família), **EC2 Instance SP** (família+região), **SageMaker SP** |
| **Spot** | até ~90% | Tolerante a interrupção (aviso de **2 min**): batch, CI, big data, stateless em ASG/EMR |
| **Dedicated Host** | — | Licenças **por socket/core** (BYOL), conformidade; visibilidade do host físico |
| **Dedicated Instance** | — | Hardware dedicado sem controle de host |
| **Capacity Reservations** | — | Garantir capacidade em uma AZ (independe de desconto) |
- **Cobrança**: por segundo (mín. 60 s) para Linux; instâncias paradas **não** cobram computação (mas EBS sim). **Elastic IP** não associado gera cobrança.

## Armazenamento e rede
- **EBS**: bloco persistente **em uma única AZ**; **gp3** (padrão; IOPS/throughput provisionáveis independente do tamanho), **io2 Block Express** (até 256k IOPS; multi-attach), **st1/sc1** (HDD throughput/frio; não bootáveis). Snapshots incrementais em S3 (regional); copiar entre regiões/contas.
- **Instance Store**: disco físico do host, **efêmero** (perde ao parar/terminar/falha) — máxima IOPS para cache/buffer.
- **AMI**: regional; copiar para outras regiões. **Placement groups**: **Cluster** (mesma AZ, baixa latência/alto throughput), **Spread** (máx. 7 por AZ, hardware distinto), **Partition** (grupos isolados, big data distribuído).
- **ENI/ENA/EFA**: ENA para rede melhorada; **EFA** para HPC/ML com OS-bypass (MPI/NCCL).
- **Metadata**: use **IMDSv2** (token, protege contra SSRF). **User data** roda no primeiro boot.
- **Hibernação** preserva RAM em EBS cifrado. **Stop/start** troca o host e o IP público (Elastic IP mantém).

> **Dica de prova:** "Carga interrompível e o mais barato" → **Spot**. "Servidor 24x7 previsível por 3 anos, sem flexibilidade" → RI/Savings Plan. "Licença de software por core" → **Dedicated Host**. "Compromisso flexível entre EC2, Fargate e Lambda" → **Compute Savings Plans**.

> **Pegadinha:** Reserved/Savings Plans **não reservam capacidade** (só Capacity Reservation, ou RI zonal, reserva).`
},
{
  id: "elb-asg", title: "Elastic Load Balancing e Auto Scaling", min: 10, ord: 11, lvl: 2, y: 2025,
  dom: { saa: [2, 3], soa: [1, 2, 5], dva: [1], clf: [3], sap: [2], dop: [3] }, svc: ["elb", "auto-scaling", "ec2", "cloudwatch"], top: ["scalability", "elasticity", "high-availability", "fault-tolerance"],
  body: `## Tipos de load balancer
| | **ALB** | **NLB** | **GWLB** | CLB (legado) |
|---|---|---|---|---|
| Camada | 7 (HTTP/HTTPS/gRPC/WebSocket) | 4 (TCP/UDP/TLS) | 3 (GENEVE) | 4/7 |
| Destaques | Roteamento por **path/host/header/query**, redirect, respostas fixas, **OIDC/Cognito auth**, alvos: instância/IP/**Lambda**, WAF | **IP estático/Elastic IP por AZ**, milhões de req/s, latência mínima, **preserva IP de origem**, **PrivateLink** | Inserir **appliances** (firewall/IDS) de terceiros de forma transparente | Evitar em novos projetos |
- **Cross-zone**: ALB habilitado por padrão (sem custo); NLB/GWLB desabilitado por padrão (custo de transferência entre AZ se ativar).
- **Health checks** removem alvos não saudáveis; **connection draining / deregistration delay** (padrão 300 s) conclui requisições em andamento.
- **Sticky sessions** (cookie); **SNI** para vários certificados no mesmo listener; **X-Forwarded-For** informa o IP do cliente no ALB.
- Comportamento com **NLB em alvo por instância** preserva IP de origem; por IP alvo pode precisar de Proxy Protocol v2.

## Auto Scaling (EC2 ASG)
- **Launch template** (versões, mix de On-Demand/Spot, várias famílias), **min/desired/max**, **Multi-AZ** (redistribui automaticamente).
- **Políticas**: **Target tracking** (mais simples: ex.: CPU média 50%), **Step**, **Simple**, **Scheduled**, **Predictive** (ML sobre histórico).
- **Cooldown / warm-up** evitam oscilação; **lifecycle hooks** executam ações no launch/terminate (ex.: baixar config, drenar); **instance refresh** faz rolling update; **warm pools** reduzem tempo de boot.
- **Health check ELB** no ASG: substitui instâncias que o LB considera não saudáveis (por padrão só EC2 status).
- Métricas de escala baseadas em **fila (SQS)**: "backlog per instance" (customizada).

## Desacoplamento para escalar
Coloque **SQS** entre camadas: o ASG escala pelo comprimento da fila; o front-end permanece responsivo.

> **Dica de prova:** "IP fixo e latência ultra baixa, TCP" → **NLB**. "Roteamento por caminho para microserviços" → **ALB**. "Inspecionar tráfego com firewall de terceiros" → **GWLB**. "Escalar por CPU mantendo média em X%" → **target tracking**.

> **Pegadinha:** o ASG termina instâncias com base na política de término (AZ mais desbalanceada primeiro, depois a mais antiga config). Instâncias em **scale-in protection** não são terminadas.`
},
{
  id: "s3-core", title: "Amazon S3: classes, ciclo de vida, replicação e segurança", min: 13, ord: 12, lvl: 2, y: 2026,
  dom: { clf: [3], saa: [1, 2, 3, 4], dva: [1, 2], soa: [1, 2, 4], dea: [2, 4], sap: [2, 4], scs: [5] }, svc: ["s3", "s3-glacier", "kms", "cloudfront", "macie"], top: ["storage-choice", "encryption", "cost-optimization", "backup-restore", "data-lake"],
  body: `## Fundamentos
- **Objeto** (até **5 TB**; upload único até 5 GB; **multipart** recomendado > 100 MB, obrigatório > 5 GB) em **bucket** (nome global, dados regionais). **Durabilidade 99,999999999% (11 noves)**; disponibilidade varia por classe.
- **Consistência forte** (leitura após escrita, listagem) desde 2020.
- Sem estrutura de pastas real: **prefixos**. Desempenho: **3.500 PUT/POST/DELETE e 5.500 GET/HEAD por segundo por prefixo**; paralelize entre prefixos.

## Classes de armazenamento
| Classe | Uso | Mín. duração / recuperação |
|---|---|---|
| **Standard** | Acesso frequente | — |
| **Intelligent-Tiering** | Padrão desconhecido/variável; move automaticamente entre camadas (frequente, infrequente, arquivo instantâneo; opcionais arquivo/deep archive) | Taxa de monitoramento por objeto; sem custo de recuperação |
| **Standard-IA** | Acesso raro, acesso rápido; ≥ 3 AZs | 30 dias; taxa por GB recuperado; objetos < 128 KB cobrados como 128 KB |
| **One Zone-IA** | Raro, recriável; **1 AZ** | 30 dias |
| **Glacier Instant Retrieval** | Arquivo com acesso em ms (trimestral) | 90 dias |
| **Glacier Flexible Retrieval** | Arquivo: expedited (1–5 min), standard (3–5 h), bulk (5–12 h) | 90 dias |
| **Glacier Deep Archive** | Retenção longa (7–10 anos), o mais barato: standard 12 h, bulk 48 h | 180 dias |
| **Express One Zone** | Latência de ms de um dígito, alta taxa de requisições (ML, analytics); **directory buckets**, 1 AZ | — |
- **S3 Tables** (Apache Iceberg gerenciado) e **S3 Vectors** (armazenamento de vetores) são novidades recentes para analytics e IA.

## Ciclo de vida e versionamento
- **Lifecycle rules**: transição entre classes e **expiração** (inclusive versões antigas e multipart incompletos). Ordem só "para baixo" (Standard → IA → Glacier).
- **Versioning**: protege contra exclusão/sobrescrita; excluir cria **delete marker**. **MFA Delete** exige MFA para excluir versões/alterar versioning.
- **Object Lock** (WORM; requer versioning): modo **Governance** (contornável com permissão) e **Compliance** (ninguém, nem root); **Legal hold**. **Glacier Vault Lock** para cofres.

## Replicação
- **CRR** (entre regiões: latência/conformidade/DR) e **SRR** (mesma região: agregação de logs, contas). Exige **versioning** em origem e destino; replica **novos objetos** (use **Batch Replication** para existentes); não replica delete markers por padrão; **S3 RTC** garante 99,99% em 15 min.
- **Multi-Region Access Points** roteiam por menor latência e permitem failover ativo-ativo.

## Segurança
- **Block Public Access** (conta e bucket) ligado por padrão; **bucket policy** (recurso), **IAM**, **ACLs** (desabilitadas por padrão com **Object Ownership = bucket owner enforced**), **Access Points** (políticas por aplicação/VPC), **pre-signed URLs** (acesso temporário com as permissões de quem assina), **Access Analyzer for S3**.
- **Criptografia**: SSE-S3 (padrão), SSE-KMS (+ **Bucket Keys** reduzem custo KMS), SSE-C, DSSE-KMS; TLS forçado via \`aws:SecureTransport\`.
- **VPC Gateway Endpoint** (grátis, via tabela de rotas) ou **Interface endpoint** (PrivateLink; on-prem/entre regiões) para tráfego privado.
- **Eventos**: S3 Event Notifications → SNS/SQS/Lambda/**EventBridge**.

## Desempenho e transferência
- **Multipart upload**, **Transfer Acceleration** (edge → backbone; endpoint acelerado), **byte-range fetches**, **S3 Select** (consulta a subconjuntos de objeto) — para consultas use **Athena**.
- **Static website hosting** (HTTP; use CloudFront + OAC para HTTPS/CDN). **Requester Pays** transfere custo de download ao solicitante. **Inventory** e **Storage Lens** dão visibilidade; **Batch Operations** processa bilhões de objetos.

> **Dica de prova:** "Arquivo raro e recuperação em milissegundos" → **Glacier Instant Retrieval**. "Padrão de acesso desconhecido" → **Intelligent-Tiering**. "Impedir exclusão por 7 anos, inclusive pelo root" → **Object Lock Compliance**. "Cópia contínua para outra região" → **CRR**.

> **Pegadinha:** lifecycle **não** move de IA para Standard; e a replicação **não é retroativa**.`
},
{
  id: "storage-block-file", title: "EBS, EFS, FSx, Storage Gateway, Backup e DataSync", min: 9, ord: 13, lvl: 2, y: 2025,
  dom: { saa: [2, 3], clf: [3], soa: [1, 2], sap: [2, 4], dea: [2] }, svc: ["ebs", "efs", "fsx", "storage-gateway", "backup", "datasync", "snow", "transfer-family"], top: ["storage-choice", "backup-restore", "data-migration", "hybrid-connectivity"],
  body: `## Escolha rápida
| Necessidade | Serviço |
|---|---|
| Disco de uma instância EC2 (bloco, 1 AZ) | **EBS** |
| Sistema de arquivos **NFS** compartilhado por muitas instâncias Linux, multi-AZ, elástico | **EFS** (Standard/One Zone; classes IA/Archive; **Bursting/Elastic/Provisioned** throughput) |
| Windows compartilhado (**SMB**, AD, NTFS, DFS) | **FSx for Windows File Server** |
| HPC / ML de alto desempenho, integrado ao S3 | **FSx for Lustre** |
| NFS/SMB/iSCSI multiprotocolo, snapshots, replicação (NetApp) | **FSx for NetApp ONTAP** |
| Mover/trocar volumes ZFS com clones | **FSx for OpenZFS** |
| Ponte on-prem → nuvem | **Storage Gateway**: **S3 File**, **FSx File**, **Volume** (cached/stored, iSCSI), **Tape** (VTL para backups) |
| Transferir dados online, agendado, com verificação | **DataSync** (NFS/SMB/HDFS/S3/EFS/FSx; on-prem via agente) |
| Transferir **petabytes** offline / sem rede | **Snowball Edge** (storage/compute), **Snowmobile** (exabytes, legado) |
| SFTP/FTPS/FTP gerenciado para S3/EFS | **Transfer Family** |
| Backup centralizado, multi-serviço/conta/região | **AWS Backup** (planos, vaults, **Vault Lock**, cross-account/region) |

## Detalhes cobrados
- **EBS Multi-Attach** (io1/io2) para múltiplas instâncias na mesma AZ (aplicações cluster-aware). Snapshot **Fast Snapshot Restore** elimina latência de restauração; **Recycle Bin** recupera snapshots/AMIs apagados.
- **EFS** é **POSIX** e **somente Linux**; acesso via NFSv4 e mount targets por AZ; criptografia em trânsito com TLS.
- **FSx for Lustre**: SCRATCH (temporário, sem replicação) × PERSISTENT; carrega/sincroniza com S3.
- **Storage Gateway Volume Gateway**: **cached** (dados primários no S3, cache local) × **stored** (dados primários locais, backup assíncrono no S3).
- **AWS Backup**: políticas por tags, **restore testing**, relatórios de conformidade, **Vault Lock** (WORM), cópia cross-account (proteção contra conta comprometida/ransomware).

> **Dica de prova:** "Compartilhar arquivos entre centenas de instâncias Linux em várias AZs" → **EFS**. "Windows + Active Directory" → **FSx for Windows**. "Dezenas de TB, rede lenta, prazo curto" → **Snowball Edge**. "Migrar NFS on-prem para EFS/S3 com agendamento" → **DataSync**.`
},
{
  id: "vpc-core", title: "VPC: sub-redes, roteamento, segurança e endpoints", min: 13, ord: 14, lvl: 2, y: 2025,
  dom: { clf: [3], saa: [1, 2], soa: [5], sap: [1], ans: [1, 2, 3, 4], scs: [3] }, svc: ["vpc", "elb", "privatelink", "network-firewall", "cloudwatch"], top: ["network-design", "network-security", "vpc-connectivity"],
  body: `## Blocos
- **VPC** = rede virtual isolada por região (CIDR IPv4 /16–/28; pode adicionar CIDRs secundários; IPv6 /56 opcional). **Sub-rede** = 1 AZ; **5 IPs reservados** por sub-rede (rede, roteador, DNS, futuro, broadcast).
- **Pública**: tabela de rotas com \`0.0.0.0/0 → Internet Gateway (IGW)\` e IP público/Elastic IP. **Privada**: sem rota direta para o IGW; saída via **NAT Gateway** (na sub-rede pública; **por AZ** para HA) ou **NAT instance**; **Egress-only IGW** para IPv6 saída.
- **DNS**: \`enableDnsSupport\` e \`enableDnsHostnames\`; **Resolver** interno; zonas privadas do Route 53.

## Segurança em camadas
| | **Security Group** | **Network ACL** |
|---|---|---|
| Nível | ENI/instância | Sub-rede |
| Estado | **Stateful** | **Stateless** (regras de entrada e saída, portas efêmeras) |
| Regras | Só **allow**; avalia todas | **Allow e deny**, avalia em ordem numérica (primeira que casa) |
| Referências | Pode referenciar **outros SGs** | Só CIDR |
- Padrão: SG nega entrada e permite saída; NACL padrão permite tudo.

## Endpoints privados
- **Gateway endpoint** (**S3 e DynamoDB**): entrada na tabela de rotas, **gratuito**, só dentro da VPC.
- **Interface endpoint** (**PrivateLink**): ENI com IP privado para dezenas de serviços AWS ou **seu serviço/marketplace** (exposto via **NLB**); acessível de on-prem via DX/VPN; cobra por hora e GB.
- **Endpoint policy** restringe o que passa. **VPC Lattice** conecta serviços (service-to-service) entre VPCs com políticas.

## Observabilidade
- **VPC Flow Logs** (VPC/sub-rede/ENI → CloudWatch Logs, S3, Firehose): aceito/rejeitado, portas, bytes; não capturam conteúdo, DNS interno, DHCP, metadados. **Traffic Mirroring** copia pacotes para análise. **Reachability Analyzer** valida caminho lógico. **Network Access Analyzer** encontra acessos não intencionais.

## Padrões
- **3 camadas**: ALB (pública) → app (privada) → banco (privada isolada). SG do banco permite só o SG da app.
- **Bastion**/**Session Manager** (sem portas abertas, auditado) e **EC2 Instance Connect Endpoint** para acesso privado.
- Peering **não é transitivo**, exige CIDRs sem sobreposição; use **Transit Gateway** para hub-and-spoke.

> **Dica de prova:** "Instâncias privadas precisam baixar patches da internet" → **NAT Gateway**. "Acessar S3 sem sair pela internet, sem custo" → **Gateway endpoint**. "Bloquear um IP específico" → **NACL deny** (SG não tem deny).

> **Pegadinha:** NAT Gateway é **zonal**; se a AZ cair, outras AZs perdem saída se compartilharem um único NAT. Um NAT por AZ.`
},
{
  id: "hybrid-connect", title: "Conectividade: VPN, Direct Connect, Peering, Transit Gateway", min: 10, ord: 15, lvl: 3, y: 2026,
  dom: { saa: [1, 2, 3], sap: [1, 4], ans: [1, 2], soa: [5], dop: [3] }, svc: ["vpn", "direct-connect", "transit-gateway", "privatelink", "cloud-wan", "vpc"], top: ["hybrid-connectivity", "vpc-connectivity", "network-design"],
  body: `## Comparativo
| Opção | Característica | Quando |
|---|---|---|
| **Site-to-Site VPN** | IPsec pela internet, 2 túneis por conexão, até ~1,25 Gbps por túnel; minutos para criar | Rápido/barato, backup do DX |
| **Direct Connect (DX)** | Link privado dedicado (1/10/100 Gbps) ou hospedado (50 Mbps–25 Gbps); latência consistente; **semanas** para provisionar; **não cifra por padrão** | Alto volume, latência previsível |
| **DX + VPN (IPsec sobre VIF pública/transit)** | Cifra sobre DX; **MACsec** em conexões dedicadas | Requisito de criptografia |
| **VPC Peering** | 1:1, sem transitividade, sem CIDR sobreposto, inter-região/conta | Poucas VPCs |
| **Transit Gateway (TGW)** | Hub regional para VPCs, VPN, DX; **route tables** por anexo (segmentação); **peering** inter-região; **multicast**; ECMP para VPN | Muitas VPCs/on-prem |
| **PrivateLink** | Expõe **um serviço** (não a rede) por ENI/NLB, sem sobreposição de CIDR | Provedor→consumidores |
| **Cloud WAN** | Rede global gerenciada com políticas (core network) | WAN multi-região |

## Direct Connect em detalhe
- **VIF privada** → VPC (via **Virtual Private Gateway**) ou **Direct Connect Gateway** (vários VPCs/regiões); **VIF pública** → serviços públicos AWS; **VIF de trânsito** → **Transit Gateway** via DX Gateway.
- **Alta resiliência**: dois locais DX com dois dispositivos cada (**Maximum Resiliency**); backup com **VPN**. **BGP**: AS-PATH/Local Preference/communities para preferir caminhos. **LAG** agrega links.
- Roteamento: **estático** ou **BGP dinâmico** (VPN); **route propagation** na tabela de rotas.

## VPN
- **VGW** (uma VPC) × **TGW** (várias VPCs); **Accelerated VPN** via Global Accelerator; **Client VPN** (acesso de usuários, OpenVPN) × **Site-to-Site**.

> **Dica de prova:** "Conectar centenas de VPCs e on-prem com gerenciamento central" → **Transit Gateway**. "Conexão privada, latência previsível, alto volume" → **Direct Connect** (+ VPN de backup). "Expor um serviço SaaS a milhares de clientes sem peering" → **PrivateLink**. "Até o DX ficar pronto" → VPN temporária.`
},
{
  id: "dns-cdn", title: "Route 53, CloudFront e Global Accelerator", min: 10, ord: 16, lvl: 2, y: 2025,
  dom: { clf: [3], saa: [2, 3], soa: [2, 5], sap: [2], ans: [1, 2], dop: [3] }, svc: ["route53", "cloudfront", "global-accelerator", "waf", "shield", "acm"], top: ["dns", "content-delivery", "high-availability", "performance", "caching"],
  body: `## Route 53
- DNS autoritativo, **SLA 100%**. **Registros**: A, AAAA, CNAME (não no apex), MX, TXT, **Alias** (grátis, funciona no apex, aponta a recursos AWS: ELB, CloudFront, S3 site, API GW; sem custo de consulta).
- **Políticas de roteamento**: **Simple**, **Weighted** (canary/A-B), **Latency**, **Failover** (ativo/passivo com health check), **Geolocation** (país/continente; regras legais/idioma), **Geoproximity** (distância + bias; via Traffic Flow), **Multivalue** (até 8 registros saudáveis).
- **Health checks**: endpoint, **calculated** (agrega), **CloudWatch alarm** (para recursos privados). **Private hosted zones** por VPC. **Resolver** (inbound/outbound endpoints) para DNS híbrido; **DNSSEC** e **Resolver DNS Firewall**.

## CloudFront
- CDN com edges globais; origens: S3 (use **Origin Access Control – OAC**, bucket privado), ALB/EC2, API Gateway, custom HTTP; **origin groups** (failover primário/secundário).
- **Cache**: cache policy (TTL, chaves: headers/cookies/query), **invalidação** (paga após cota) ou **versionamento de nomes**. **Regional edge cache**. **Origin Shield** reduz carga na origem.
- **Segurança**: HTTPS (cert ACM em **us-east-1**), **WAF**, Shield Standard automático, **signed URLs/cookies** (conteúdo privado), **geo restriction**, **field-level encryption**, OAC/OAI.
- **Edge compute**: **CloudFront Functions** (JS leve, sub-ms, viewer request/response) × **Lambda@Edge** (mais poder, origin/viewer, mais lento/caro).
- Também acelera **uploads** (PUT/POST) e conteúdo dinâmico (conexões persistentes ao backbone).

## Global Accelerator
- **2 IPs anycast estáticos**; tráfego entra na **borda mais próxima** e segue o backbone AWS até endpoints (ALB, NLB, EC2, EIP) em **várias regiões** com **health check** e failover < 1 min; sem cache. Ideal para **TCP/UDP** (jogos, IoT, VoIP) e IPs fixos para allowlists.

| Necessidade | Use |
|---|---|
| Conteúdo cacheável estático/dinâmico HTTP | **CloudFront** |
| IP fixo, TCP/UDP, failover regional rápido | **Global Accelerator** |
| Direcionar usuários por política/saúde no DNS | **Route 53** |

> **Pegadinha:** o TTL do DNS atrasa o failover do Route 53 (clientes cacheiam); Global Accelerator não depende de TTL. **Alias** de A para CloudFront não cobra consulta; **CNAME** no apex é inválido.`
},
{
  id: "rds-aurora", title: "RDS e Aurora: alta disponibilidade, réplicas e backup", min: 11, ord: 20, lvl: 2, y: 2025,
  dom: { clf: [3], saa: [2, 3], soa: [1, 2], dea: [2], sap: [2, 4], dva: [1] }, svc: ["rds", "aurora", "elasticache", "dms", "sct", "kms"], top: ["database-choice", "high-availability", "backup-restore", "performance", "sql-tuning"],
  body: `## RDS (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Db2)
- **Multi-AZ (instância)**: réplica **síncrona** em outra AZ, **failover automático** (60–120 s), mesmo endpoint DNS; **não serve leituras**. **Multi-AZ cluster** (2 leitores; MySQL/PostgreSQL): failover ~35 s e leituras.
- **Read replicas**: **assíncronas**, escalam **leitura**, até 15, podem ser **cross-region**, ser **promovidas**; têm endpoint próprio.
- **Backups**: automatizados (retenção 0–35 dias, **PITR** a cada 5 min) + **snapshots manuais** (sem expiração). Restaurar **cria uma nova instância**. **Cifrar um banco existente**: snapshot → copiar com KMS → restaurar.
- **RDS Proxy**: pool de conexões (Lambda, picos), reduz failover, IAM auth/Secrets Manager. **Parameter groups/option groups**. **Performance Insights** para carga (DB Load, wait events). **Blue/Green Deployments** para upgrades com mínimo downtime.
- Storage: gp3/io2, **autoscaling de storage**. **RDS Custom** para acesso ao SO (Oracle/SQL Server).

## Aurora (MySQL/PostgreSQL compatível)
- Storage distribuído, **6 cópias em 3 AZs**, até **128 TiB** com crescimento automático, cluster com **1 escritor + até 15 leitores** (failover em geral < 30 s), **endpoints**: *cluster* (escrita), *reader* (balanceia leituras), *custom*.
- **Aurora Serverless v2**: escala em ACUs (grãos finos); v1 legado. **Global Database**: replicação entre regiões com latência típica < 1 s, RPO baixo, **failover regional** (promoção em ~1 min). **Backtrack** (MySQL) reverte no tempo sem restaurar. **Cloning** rápido (copy-on-write). **Parallel Query**, **I/O-Optimized** (sem cobrança por I/O).
- **Limitless Database** para escala de escrita horizontal (sharding gerenciado).

## Migração
- **DMS** (migração contínua/CDC, homogênea e heterogênea; **SCT** converte schema/código) e **Babelfish** (SQL Server → Aurora PostgreSQL).

> **Dica de prova:** "Alta disponibilidade" → **Multi-AZ**; "escalar leitura" → **read replicas**; "menor esforço, maior desempenho MySQL/PG" → **Aurora**; "banco com carga esporádica" → **Aurora Serverless v2**; "muitas conexões de Lambda" → **RDS Proxy**; "DR entre regiões com RPO de segundos" → **Aurora Global Database**.

> **Pegadinha:** o standby do Multi-AZ clássico **não** é ponto de leitura; **réplica de leitura** não dá failover automático (só promoção manual), exceto no Aurora.`
},
{
  id: "dynamodb-core", title: "DynamoDB: modelagem, capacidade, índices e recursos", min: 12, ord: 21, lvl: 2, y: 2026,
  dom: { dva: [1, 3, 4], saa: [2, 3, 4], dea: [2, 3], soa: [2], sap: [2] }, svc: ["dynamodb", "elasticache", "kms", "cloudwatch", "lambda"], top: ["database-choice", "data-modeling", "caching", "performance", "serverless"],
  body: `## Modelo
- NoSQL chave-valor/documento, **serverless**, latência de ms de um dígito, Multi-AZ automático (3 AZs), item até **400 KB**.
- **Chave primária**: **partition key** (hash) ou **partition + sort key**. Escolha PK com **alta cardinalidade** e acesso uniforme para evitar **hot partitions**.
- **Índices**: **LSI** (mesma PK, outra SK; **só na criação da tabela**; até 5; limite 10 GB por partição) e **GSI** (qualquer PK/SK; criável depois; **capacidade e consistência eventual próprias**; até 20).
- **Consistência**: leitura **eventualmente consistente** (padrão, metade do custo), **fortemente consistente** (não suportada em GSI), **transacional** (ACID, 2× custo, até 100 itens).

## Capacidade
| | **On-demand** | **Provisionada** |
|---|---|---|
| Pagamento | Por requisição | RCU/WCU por hora (+ **auto scaling**, **reserved capacity**) |
| Uso | Imprevisível, novas apps | Previsível, custo menor em alta utilização |
- **1 RCU** = 1 leitura fortemente consistente de até **4 KB**/s (ou 2 eventualmente consistentes); **1 WCU** = 1 escrita de até **1 KB**/s. Transacional custa o dobro.
- **Burst capacity** e **adaptive capacity** ajudam em picos/hot keys; ainda assim, **ProvisionedThroughputExceededException** exige **retry com backoff exponencial** e ajuste de modelo.
- Classes: **Standard** e **Standard-IA** (menor custo de storage).

## Recursos
- **DynamoDB Streams** (24 h; fonte de **Lambda triggers**, replicação, auditoria) e **Kinesis Data Streams** como destino de CDC. **TTL** exclui itens expirados sem custo de escrita (atraso de até dias). **Global Tables** (multi-região, multi-ativo, **last-writer-wins**; requer Streams). **PITR** (35 dias) e **backups sob demanda**; **export para S3** sem consumir capacidade; **import do S3**.
- **DAX**: cache em memória **write-through**, microssegundos, compatível com API DynamoDB, **só leituras eventualmente consistentes** se beneficiam; para caches genéricos/queries de resultados → **ElastiCache**.
- **Operações**: \`GetItem/Query\` (eficientes, por chave) × \`Scan\` (lê tudo; evite; use **paginação**, filtros aplicados **depois** da leitura, ainda cobrando). **Condition expressions** para escrita otimista (versão), **atomic counters**, **BatchGetItem/BatchWriteItem** (até 25/100 itens), **PartiQL**.
- **Segurança**: IAM com condições \`dynamodb:LeadingKeys\` (acesso por item), criptografia sempre ativa, VPC gateway endpoint.

> **Dica de prova:** "Tabela com padrões de acesso alternativos" → **GSI**. "Cache de leitura com microssegundos sem alterar código" → **DAX**. "Aplicação global multi-região gravável" → **Global Tables**. "Expirar sessões automaticamente" → **TTL**. "Custos imprevisíveis por tráfego variável" → **on-demand**.

> **Pegadinha:** LSI não pode ser adicionado depois; GSI não suporta leitura fortemente consistente; filtros em \`Scan\`/\`Query\` não reduzem o consumo de RCU.`
},
{
  id: "db-choice", title: "Escolhendo o banco de dados certo", min: 6, ord: 22, lvl: 1, y: 2025,
  dom: { clf: [3], saa: [2, 3], dea: [2], sap: [2, 4], dva: [1] }, svc: ["rds", "aurora", "dynamodb", "elasticache", "memorydb", "redshift", "documentdb", "neptune", "keyspaces", "timestream", "opensearch"], top: ["database-choice", "data-modeling"],
  body: `## Mapa mental
| Necessidade | Serviço |
|---|---|
| Relacional (OLTP), ACID, joins | **RDS / Aurora** |
| Chave-valor/documento em escala, ms | **DynamoDB** |
| Cache/sessões/leaderboards, sub-ms | **ElastiCache (Redis/Valkey/Memcached)**; **MemoryDB** = Redis **durável** como banco primário |
| Data warehouse (OLAP), SQL analítico petabytes | **Redshift** (colunar, MPP; **Spectrum** consulta S3; **RA3** separa compute/storage; **Serverless**) |
| Documentos MongoDB compatível | **DocumentDB** |
| Grafo (relações, fraude, redes sociais) | **Neptune** |
| Wide-column Cassandra | **Keyspaces** |
| Séries temporais/IoT | **Timestream** |
| Busca de texto/log analytics | **OpenSearch Service** |
| Ledger imutável | **QLDB** (descontinuado em 2025; use Aurora PostgreSQL + auditoria) |
| Consultar arquivos no S3 sem infra | **Athena** |

## Redshift essencial
- **Distribution styles**: KEY, ALL, EVEN, AUTO; **sort keys**; **compressão colunar**; **COPY** do S3 (paralelo, use vários arquivos); **UNLOAD**; **WLM** e **concurrency scaling**; **materialized views**; **data sharing**; snapshots automáticos/manuais e cross-region.

> **Dica de prova:** procure a palavra-chave do padrão de acesso: "joins complexos/transações" → relacional; "milhões de requisições/s com latência previsível" → DynamoDB; "relatórios agregados sobre terabytes" → Redshift; "relacionamentos entre entidades" → Neptune.`
}
]);
