/* Lições compartilhadas: fundamentos, segurança e governança. dom: { certId: [domínios] } */
AWSPREP.add("lessons", [
{
  id: "global-infra", title: "Infraestrutura global: Regiões, AZs e borda", min: 7, ord: 1, lvl: 1, y: 2025,
  dom: { clf: [3], saa: [2, 3], soa: [2], sap: [2] }, svc: ["cloudfront", "route53", "outposts"], top: ["cloud-concepts", "high-availability", "content-delivery"],
  body: `## Blocos da infraestrutura
- **Região**: área geográfica com 3+ AZs (na maioria). Dados **não saem da região** sem sua ação — base de conformidade e soberania de dados.
- **Availability Zone (AZ)**: um ou mais data centers com energia, rede e refrigeração independentes; AZs de uma região são ligadas por rede redundante de baixa latência (poucos milissegundos). **Multi-AZ = alta disponibilidade**; **Multi-Region = recuperação de desastre / latência global**.
- **Edge locations / PoPs**: CloudFront, Route 53, WAF, Shield, Global Accelerator. **Regional Edge Caches** ficam entre a origem e as edges.
- **Local Zones**: extensão de uma região perto de grandes centros urbanos (latência de um dígito em ms). **Wavelength**: computação dentro de redes 5G de operadoras. **Outposts**: hardware AWS no seu data center (mesmas APIs) para baixa latência local e residência de dados.

## Como escolher a Região
1. **Conformidade/residência de dados** (decisão eliminatória).
2. **Latência** para os usuários.
3. **Disponibilidade de serviços/recursos** (novos serviços chegam primeiro em us-east-1, us-west-2, eu-west-1).
4. **Preço** (varia por região).

## Serviços globais vs regionais
| Global (ou plano de controle global) | Regional |
|---|---|
| IAM, Organizations, Route 53, CloudFront, WAF (associado ao CloudFront), Shield Advanced, Global Accelerator | EC2, S3 (bucket é regional, namespace global), RDS, Lambda, VPC, DynamoDB |

> **Dica de prova:** "reduzir latência para usuários no mundo todo" → CloudFront (conteúdo cacheável) ou Global Accelerator (TCP/UDP, IPs anycast fixos, failover rápido). "Manter dados em um país" → escolher a Região + SCP negando outras regiões.

> **Pegadinha:** AZs são identificadas por nomes diferentes por conta (us-east-1a na sua conta pode ser outra AZ física). Use o **AZ ID** (use1-az1) para alinhar entre contas.`
},
{
  id: "shared-resp-wa", title: "Responsabilidade compartilhada e Well-Architected", min: 9, ord: 2, lvl: 1, y: 2025,
  dom: { clf: [1, 2], saa: [1, 2, 3, 4], sap: [3], soa: [4], scs: [6], dop: [6] }, svc: ["well-architected-tool", "artifact", "trusted-advisor"], top: ["shared-responsibility", "well-architected", "cloud-concepts"],
  body: `## Modelo de responsabilidade compartilhada
- **AWS: segurança DA nuvem** — hardware, software de virtualização, data centers, rede global, serviços gerenciados (o "plano" físico e o SO do host).
- **Cliente: segurança NA nuvem** — dados, IAM, configuração de SG/NACL, criptografia, patches do SO **em EC2**, firewall do SO, aplicações.
- **Muda por serviço** (IaaS → PaaS → SaaS):
| Serviço | AWS cuida | Você cuida |
|---|---|---|
| EC2 | Host físico, hipervisor | SO convidado, patches, apps, SG, dados |
| RDS | SO, patches do engine, backups automáticos, Multi-AZ | Parâmetros, SGs, usuários, criptografia, dados |
| Lambda | SO, runtime, escala | Código, permissões IAM, dados |
| S3 | Infra e durabilidade | Políticas de bucket, ACLs, criptografia, versionamento |
- **Controles herdados** (físico/ambiental), **compartilhados** (patching: AWS patcha infraestrutura, você patcha convidado; treinamento) e **específicos do cliente**.
- **AWS Artifact**: relatórios de conformidade (SOC, ISO, PCI) e acordos (BAA) sob demanda.

## Os 6 pilares do Well-Architected
| Pilar | Foco | Princípios-chave |
|---|---|---|
| **Excelência operacional** | Operar e evoluir | IaC, mudanças pequenas e reversíveis, aprender com falhas, runbooks |
| **Segurança** | Proteger dados e sistemas | Identidade forte, rastreabilidade, defesa em camadas, proteger dados em trânsito/repouso, automatizar |
| **Confiabilidade** | Recuperar-se de falhas | Testar recuperação, escalar horizontalmente, automatizar recuperação, gerenciar limites |
| **Eficiência de performance** | Usar recursos certos | Serverless, experimentar, escala global, "mechanical sympathy" |
| **Otimização de custos** | Evitar gastos desnecessários | Pagar pelo consumo, medir eficiência, parar de "gastar" com data centers, atribuir custos |
| **Sustentabilidade** | Reduzir impacto ambiental | Maximizar utilização, adotar hardware eficiente, reduzir dados/rede |

## Seis vantagens da computação em nuvem
1. Trocar despesa de capital (CapEx) por despesa variável (OpEx). 2. Economia de escala. 3. Parar de adivinhar capacidade. 4. Aumentar velocidade e agilidade. 5. Parar de gastar com manutenção de data centers. 6. Alcance global em minutos.

## Ferramentas
- **Well-Architected Tool**: revisão de workloads contra os pilares; **Trusted Advisor**: verificações de custo, performance, segurança, tolerância a falhas e limites de serviço (a lista completa depende do plano de suporte); **Cloud Adoption Framework (CAF)**: 6 perspectivas — Negócios, Pessoas, Governança, Plataforma, Segurança, Operações.

> **Dica de prova:** "Quem é responsável por aplicar patches no SO de uma instância EC2?" → **cliente**. "…no engine do RDS?" → **AWS** (você escolhe a janela de manutenção).`
},
{
  id: "iam-core", title: "IAM: identidades, políticas e lógica de avaliação", min: 12, ord: 3, lvl: 2, y: 2025,
  dom: { clf: [2], saa: [1], dva: [2], soa: [4], scs: [4], dop: [6], sap: [1] }, svc: ["iam", "organizations", "identity-center"], top: ["least-privilege", "identity-access", "identity-federation"],
  body: `## Identidades
- **Usuário raiz**: acesso total; use só para tarefas que exigem (alterar plano de suporte, fechar conta, restaurar permissões de IAM). Ative **MFA**, sem chaves de acesso.
- **Usuário IAM**: credenciais de longo prazo (senha + chaves). Prefira **IAM Identity Center** (SSO) para pessoas.
- **Grupo**: agrupa usuários (não pode aninhar grupos, não é principal em políticas de recurso).
- **Role**: identidade **sem credenciais permanentes**, assumida via **STS** (credenciais temporárias). Usada por serviços (EC2 instance profile, Lambda execution role), acesso entre contas e federação.

## Tipos de política
| Tipo | Anexo | Efeito |
|---|---|---|
| Baseada em identidade | Usuário/grupo/role | Concede |
| Baseada em recurso | S3, SQS, KMS, roles (trust policy)… | Concede (permite cross-account sem assumir role) |
| **Permissions boundary** | Usuário/role | **Teto** de permissões (não concede) |
| **SCP** (Organizations) | Conta/OU | **Teto** para todas as identidades da conta (inclui root da conta membro; não afeta a conta de gerenciamento) |
| **Session policy** | Sessão STS | Restringe ainda mais a sessão |
| ACL | S3/VPC | Legado |

## Lógica de avaliação (a mais cobrada)
1. **Negação explícita** (Deny) em qualquer política → **NEGADO**.
2. Se há SCP: precisa **Allow** na SCP. Se há permissions boundary: precisa Allow no boundary. Session policy idem.
3. Precisa de **Allow** em política de identidade **ou** de recurso (no mesmo conta). **Padrão = negação implícita**.
- **Mesma conta**: Allow em identidade OU recurso basta. **Entre contas**: precisa Allow **nos dois lados** (identidade no chamador + recurso no destino) — ou assumir uma role na conta destino.

## Condições e boas práticas
- Elementos: \`Effect, Principal, Action, Resource, Condition\`. Condições úteis: \`aws:SourceIp\`, \`aws:MultiFactorAuthPresent\`, \`aws:RequestedRegion\`, \`aws:PrincipalOrgID\`, \`aws:SourceVpce\`, \`s3:x-amz-server-side-encryption\`.
- **ABAC** (tags em principal e recurso, \`aws:PrincipalTag/x = aws:ResourceTag/x\`) escala melhor que RBAC com centenas de projetos.
- **Menor privilégio**: comece pelo **IAM Access Analyzer** (gera política a partir de atividade do CloudTrail; encontra acesso externo/não usado), revise **last accessed**.
- **iam:PassRole**: permissão necessária para passar uma role a um serviço; restrinja aos ARNs de role específicos.
- **Roles para EC2**: instance profile → credenciais rotacionadas automaticamente via IMDS. **Nunca** coloque chaves de acesso em AMIs/código.
- **Federação**: SAML 2.0 (AD FS/Okta) e OIDC → \`AssumeRoleWithSAML/WebIdentity\`; **Cognito Identity Pools** para usuários de apps móveis/web; **Identity Center** para workforce em várias contas.
- **External ID**: proteção contra "confused deputy" ao conceder acesso a terceiros por role.

> **Pegadinha:** SCP **não concede** permissões; só limita. Uma conta com SCP "FullAWSAccess" removida perde tudo. Deny explícito em SCP vence qualquer Allow.

> **Dica de prova:** "Acesso temporário entre contas sem compartilhar credenciais" → role + trust policy + STS AssumeRole. "Limitar o que um desenvolvedor delegado pode criar" → permissions boundary.`
},
{
  id: "orgs-multiaccount", title: "Multi-conta: Organizations, Control Tower e SCPs", min: 9, ord: 4, lvl: 2, y: 2025,
  dom: { saa: [1], sap: [1], scs: [6], dop: [6], soa: [4] }, svc: ["organizations", "control-tower", "ram", "identity-center", "config"], top: ["multi-account", "governance", "compliance"],
  body: `## Por que várias contas
A **conta é o limite de isolamento mais forte** (segurança, cotas, faturamento). Padrão: contas por ambiente/carga (prod/dev), contas de **log archive**, **segurança/auditoria**, **rede compartilhada**, **serviços compartilhados**.

## AWS Organizations
- **Conta de gerenciamento** (payer) + **contas membro** organizadas em **OUs** (hierarquia até 5 níveis).
- **Faturamento consolidado**: uma fatura, **descontos por volume** agregados; **Reserved Instances/Savings Plans compartilhados** entre contas (podem ser desativados por conta).
- **Políticas**: **SCP** (limita permissões), **Tag policies**, **Backup policies**, **AI services opt-out policies**.
- **Recursos**: use a conta de gerenciamento **só para governar**, não para workloads.
- **Delegated administrator**: delegue a administração de GuardDuty, Security Hub, Config, IAM Access Analyzer etc. a uma conta de segurança.
- **Trusted access** habilita serviços a operarem em toda a organização (CloudTrail organization trail, Config aggregator, RAM).

## SCPs — como pensar
- **Allow-list** (padrão: FullAWSAccess desanexado, permitir só o necessário) ou **Deny-list** (manter FullAWSAccess e negar ações; mais comum e simples).
- Exemplos clássicos: negar fora de regiões aprovadas (\`aws:RequestedRegion\`), impedir desligar CloudTrail/GuardDuty, exigir tags, impedir remover a conta da org.
- SCPs afetam **todas as identidades das contas membro, inclusive o root**, mas **não** a conta de gerenciamento e **não** roles vinculadas a serviço.

## Control Tower (landing zone)
- Cria uma **landing zone** com boas práticas: contas de **Log Archive** e **Audit**, Identity Center, **guardrails** (preventivos = SCP; detectivos = Config rules), **Account Factory** (provisiona contas padronizadas; integra Service Catalog) e **Customizations for Control Tower (CfCT)**.

## AWS RAM
Compartilha recursos (subnets de VPC, Transit Gateway, Route 53 Resolver rules, License Manager, etc.) **sem duplicar** entre contas da organização.

## Centralização de logs e segurança
- **Organization trail** do CloudTrail → bucket S3 na conta de Log Archive (com **Object Lock**/MFA delete e política restritiva).
- **Config aggregator** e **Security Hub** com administrador delegado agregam achados/conformidade multi-conta/multi-região.

> **Dica de prova:** "Aplicar uma restrição que nem administradores locais consigam remover" → SCP. "Padronizar criação de novas contas com guardrails" → Control Tower Account Factory.`
},
{
  id: "kms-encryption", title: "Criptografia: KMS, ACM, Secrets Manager e HSM", min: 11, ord: 5, lvl: 2, y: 2025,
  dom: { clf: [2], saa: [1], dva: [2], scs: [5], soa: [4], dea: [4], mla: [4], dop: [6] }, svc: ["kms", "acm", "secrets-manager", "cloudhsm", "ssm"], top: ["encryption", "key-management", "secrets", "data-protection"],
  body: `## AWS KMS
- Serviço gerenciado de chaves; **CMKs** agora chamadas **KMS keys** (simétricas AES-256-GCM ou assimétricas RSA/ECC; também HMAC).
- **Tipos de chave**: **AWS managed** (aws/s3, rotação automática anual, você não gerencia a política), **Customer managed** (você controla política, rotação, exclusão; rotação automática opcional), **AWS owned** (invisíveis).
- **Key policy** é obrigatória e a **principal** fonte de autorização (IAM sozinho não basta a menos que a key policy delegue ao IAM). **Grants** dão acesso temporário programático.
- **Envelope encryption**: KMS cifra uma **data key** (\`GenerateDataKey\`); a data key cifra os dados localmente (KMS Encrypt limita a **4 KB**). Guarde a data key **cifrada** junto ao dado.
- **Encryption context**: par chave-valor autenticado adicional (aparece no CloudTrail). Chaves **multi-região** (mesmo key ID em várias regiões) para dados replicados/global tables.
- **Exclusão**: janela de espera **7–30 dias** (padrão 30) — protege contra exclusões acidentais; **desativar** é reversível.
- **Cross-account**: key policy da conta dona + política IAM na conta chamadora. Chaves AWS managed **não** podem ser usadas entre contas.
- **Importar material de chave** (BYOK) e **Custom key store** (com **CloudHSM**) para requisitos de controle/FIPS 140-2 nível 3.

## Criptografia por serviço
| Serviço | Em repouso | Observações |
|---|---|---|
| S3 | SSE-S3 (padrão, AES-256), SSE-KMS, SSE-C, DSSE-KMS; cliente | Desde 2023 **SSE-S3 é aplicado por padrão** a novos objetos; SSE-KMS gera chamadas ao KMS (custo/limite de requisições; use **Bucket Keys**) |
| EBS | KMS; snapshot de volume cifrado é cifrado | Não dá para cifrar volume existente in-place: snapshot → copiar cifrando → novo volume. Ative **criptografia por padrão** na região |
| RDS/Aurora | KMS na criação | Réplicas e snapshots herdam; para cifrar um existente, snapshot cifrado |
| DynamoDB | Sempre cifrado (AWS owned / AWS managed / customer managed) | |
| EFS | KMS na criação | TLS em trânsito com mount helper |

## Em trânsito
- **ACM**: emite e **renova automaticamente** certificados TLS públicos (grátis) para **ELB, CloudFront, API Gateway**. Certificados públicos do ACM, por padrão, ficam presos aos serviços integrados (não exportáveis; desde 2025 há opção paga de certificado público exportável). CloudFront exige certificado na região **us-east-1**.
- **ELB**: terminação TLS no LB (ALB/NLB) ou passthrough (NLB TCP). **S3**: negar \`aws:SecureTransport = false\`.

## Secrets Manager × Parameter Store
| | Secrets Manager | SSM Parameter Store |
|---|---|---|
| Rotação automática | **Sim** (Lambda; nativa para RDS/Aurora, Redshift, DocumentDB) | Não nativa |
| Custo | Por segredo + chamadas | Standard grátis; Advanced pago |
| Multi-região | Replicação de segredos | Não |
| Uso típico | Credenciais de banco, chaves de API | Configuração, flags, valores simples |

## CloudHSM
HSM dedicado, **single-tenant**, sob seu controle exclusivo (a AWS não tem acesso às chaves), FIPS 140-2 nível 3; use para conformidade rígida, SSL offload, PKCS#11/JCE. KMS usa HSMs compartilhados (nível 3 validado também), mas **multi-tenant**.

> **Pegadinha:** "SSE-C": você fornece a chave a cada requisição via **HTTPS**; a AWS não a armazena. **Client-side encryption** = a AWS nunca vê texto claro.

> **Dica de prova:** "Rotação automática de senha de banco sem alterar código" → **Secrets Manager**. "Auditar quem usou a chave" → **CloudTrail** (eventos KMS). "Chave que você precisa apagar imediatamente do controle da AWS" → chave com **material importado** (delete key material).`
},
{
  id: "detection-services", title: "Detecção e auditoria: CloudTrail, Config, GuardDuty, Inspector, Macie, Security Hub", min: 11, ord: 6, lvl: 2, y: 2026,
  dom: { clf: [2], saa: [1], soa: [1, 4], scs: [1, 2, 6], dop: [4, 5, 6], sap: [3] }, svc: ["cloudtrail", "config", "guardduty", "inspector", "macie", "security-hub", "detective", "security-lake"], top: ["threat-detection", "auditing", "logging", "incident-response", "compliance"],
  body: `## Quem faz o quê
| Serviço | Pergunta que responde | Fonte de dados | Ponto-chave |
|---|---|---|---|
| **CloudTrail** | *Quem* chamou *qual API*, *quando* e *de onde*? | Eventos de gerenciamento (padrão), dados (S3/Lambda; opt-in), Insights | Histórico de 90 dias grátis; **trail** para S3 para retenção; **validação de integridade** de arquivos de log; trail de **organização** |
| **Config** | *Como* estava a configuração e ela está *conforme*? | Configuração de recursos (itens de configuração) | **Config rules** (gerenciadas/custom), **conformance packs**, **remediação** via SSM Automation, linha do tempo de mudanças, **aggregator** |
| **GuardDuty** | Há **ameaça ativa** (comprometimento, C2, cripto-mining)? | CloudTrail, **VPC Flow Logs**, **DNS logs**, EKS audit, S3 data events, RDS login, Lambda network, **Runtime Monitoring** | Sem agentes para a base; **Malware Protection** (EBS/S3); detecção baseada em ML e listas de ameaças |
| **Inspector** | Há **vulnerabilidade** (CVE) ou exposição de rede? | Agente SSM em EC2, imagens ECR, funções Lambda | Escaneamento **contínuo**; score de risco; achados por **pacotes de SO/linguagem** |
| **Macie** | Há **dado sensível (PII)** em S3? | Objetos S3 | ML + identificadores gerenciados/custom; achados de política/acesso público do bucket |
| **Security Hub** | Visão **agregada** e **postura** (CIS, PCI, FSBP)? | Integra GuardDuty, Inspector, Macie, Config, Firewall Manager, parceiros | Formato **ASFF**; **regras de automação**; ações via EventBridge |
| **Detective** | *Por que* e qual o **raio de impacto** do achado? | Grafos de CloudTrail, VPC Flow, GuardDuty | **Investigação** (causa raiz), não detecção |
| **Security Lake** | Como centralizar logs de segurança padronizados? | Logs AWS e terceiros em **OCSF** no S3 | Consultas com Athena; multi-conta/região |

## Padrões de resposta automatizada
\`GuardDuty/Security Hub/Config finding → EventBridge → Lambda/SSM Automation/Step Functions\` (isolar instância: trocar SG, tirar do ASG, snapshot para forense, revogar sessão de role).

## Logs relacionados
- **VPC Flow Logs** (metadados de tráfego IP; não capturam conteúdo). **Route 53 Resolver query logs**. **ALB/CloudFront/S3 access logs** para auditoria de aplicação. **CloudWatch Logs** + **Metric Filters** + Alarmes; **Logs Insights** para consultas.

> **Pegadinha:** CloudTrail **não** registra tráfego de dados de rede nem conteúdo — para isso, Flow Logs/Traffic Mirroring. **Eventos de dados do S3 não são registrados por padrão.**

> **Dica de prova:** "Detectar instância EC2 fazendo mineração de cripto" → GuardDuty. "Verificar se todos os volumes EBS estão cifrados de forma contínua" → **Config rule**. "Encontrar CPF em buckets" → Macie. "Investigar uma sequência de atividades suspeitas" → Detective.`
}
]);
