# TODO - Casos de Uso e Implementações

## 🎯 Casos de Uso Pendentes

### 📋 **InterviewQuestion (Perguntas da Entrevista)**

- [ ] **create-interview-question** - Empresas/entrevistadores criam questões personalizadas
- [ ] **fetch-interview-questions** - Lista perguntas disponíveis para uma entrevista
- [ ] **update-interview-question** - Atualiza uma pergunta existente
- [ ] **delete-interview-question** - Remove uma pergunta
- [ ] **fetch-questions-by-interview** - Busca perguntas específicas de uma entrevista

### 💬 **InterviewAnswer (Respostas da Entrevista)**

- [ ] **submit-interview-answers** - Cliente submete respostas do questionário
- [ ] **fetch-client-answers** - Busca respostas de um cliente específico
- [ ] **fetch-answers-by-interview** - Busca todas as respostas de uma entrevista
- [ ] **update-interview-answer** - Permite alterar uma resposta antes da finalização
- [ ] **generate-interview-report** - Gera relatório com respostas para o médico

### 🏥 **Triage (Triagem de Enfermagem)**

- [ ] **create-triage** - Enfermeiro cria registro de triagem
- [ ] **fetch-client-triages** - Lista histórico de triagens do cliente
- [ ] **update-triage** - Atualiza dados da triagem
- [ ] **fetch-triage-by-appointment** - Busca triagem específica do agendamento
- [ ] **calculate-risk-score** - Calcula score de risco baseado nos sinais vitais

### 🔗 **Integração e Fluxos Complexos**

- [ ] **prepare-interview-data** - Prepara dados completos (triagem + respostas) para entrevista
- [ ] **schedule-appointment-with-triage** - Agenda consulta já com triagem feita
- [ ] **export-medical-data** - Exporta dados médicos completos do cliente
- [ ] **validate-interview-completion** - Valida se todas as etapas obrigatórias foram preenchidas
- [ ] **generate-pre-consultation-summary** - Gera resumo para o médico antes da consulta

### 📅 **Appointment (Agendamentos)**

- [ ] **create-appointment** - Cria agendamento para cliente
- [ ] **fetch-appointments-by-client** - Lista agendamentos do cliente
- [ ] **update-appointment-status** - Atualiza status do agendamento
- [ ] **assign-interviewer-to-appointment** - Atribui médico ao agendamento
- [ ] **cancel-appointment** - Cancela agendamento

## 📐 Regras de Implementação

### 🏗️ **Estrutura Clean Architecture**

#### **Domain Layer** (`src/domain/`)
- Criar entidades para `InterviewQuestion`, `InterviewAnswer`, `Triage`
- Implementar repositórios interfaces para cada entidade
- Definir value objects para tipos específicos (ex: `VitalSigns`, `RiskScore`)

#### **Application Layer** (`src/application/`)
- Organizar use cases por contexto: `interview/`, `triage/`, `appointment/`
- Seguir padrão: `use-cases/` + `validators/` para cada contexto
- Criar DTOs específicos para entrada e saída de cada use case
- Implementar validações com Zod schemas

#### **Infrastructure Layer** (`src/infra/`)
- Implementar repositórios Prisma para as novas entidades
- Criar mappers bidirecionais (Domain ↔ Prisma)
- Integrar com banco de dados PostgreSQL

#### **Interface Layer** (`src/interfaces/`)
- Criar controllers FastAPI para cada contexto
- Implementar rotas RESTful seguindo convenções existentes
- Adicionar middlewares de autenticação por role

### 🔐 **Regras de Negócio Específicas**

#### **InterviewQuestion**
- ✅ Perguntas podem ser globais (para todas as empresas) ou específicas da empresa
- ✅ Apenas `COMPANY` e `INTERVIEWER` podem criar/editar perguntas
- ✅ Perguntas obrigatórias não podem ser removidas se já tiverem respostas
- ✅ Validar que pelo menos uma opção seja fornecida
- ✅ Máximo de 10 opções por pergunta

#### **InterviewAnswer**
- ✅ Apenas `CLIENT` pode submeter respostas
- ✅ Respostas só podem ser alteradas antes do status `COMPLETED` da interview
- ✅ Validar que a opção selecionada existe na pergunta correspondente
- ✅ Perguntas obrigatórias devem ter resposta antes de finalizar
- ✅ Histórico de alterações para auditoria

#### **Triage**
- ✅ Apenas profissionais de saúde podem criar/editar triagem
- ✅ Sinais vitais devem ter validação de ranges normais
- ✅ Score de risco calculado automaticamente baseado em algoritmo médico
- ✅ Triagem obrigatória antes de appointments de certas especialidades
- ✅ Dados sensíveis - logs de acesso obrigatórios

#### **Appointment**
- ✅ Cliente só pode agendar se tiver triagem válida (quando aplicável)
- ✅ Validar disponibilidade do interviewer
- ✅ Regras de cancelamento baseadas na antecedência
- ✅ Notificações automáticas para todas as partes
- ✅ Integração com sistema de pagamento existente

### 🧪 **Testes Obrigatórios**

#### **Unit Tests** (`**/*.spec.ts`)
- [ ] Testar cada use case isoladamente
- [ ] Mockar dependências externas
- [ ] Cobrir cenários de sucesso e erro
- [ ] Validar regras de negócio específicas

#### **E2E Tests** (`src/interfaces/**/*.spec.ts`)
- [ ] Testar fluxos completos por role
- [ ] Validar autenticação e autorização
- [ ] Testar integração entre diferentes contextos
- [ ] Cenários de falha de rede/banco

### 📊 **Métricas e Monitoramento**

- [ ] Logs estruturados para todas as operações
- [ ] Métricas de tempo de resposta por use case
- [ ] Alertas para falhas em operações críticas
- [ ] Dashboard com estatísticas de uso

### 🔄 **Integrações Existentes**

- [ ] Manter compatibilidade com sistema de pagamento Stripe
- [ ] Integrar com Socket.IO para notificações em tempo real
- [ ] Conectar com MediaSoup para gravação de entrevistas
- [ ] Sincronizar com sistema de roles existente

### 📝 **Padrões de Código**

- ✅ Usar TypeScript com strict mode
- ✅ Seguir convenções do Biome (tabs, single quotes)
- ✅ Path aliases `@*` para imports internos
- ✅ Nomenclatura consistente com codebase existente
- ✅ Documentação JSDoc para funções públicas

### 🗄️ **Database & Migrations**

- [ ] Criar migrations para novos campos se necessário
- [ ] Implementar índices otimizados para queries frequentes
- [ ] Configurar soft delete para dados sensíveis
- [ ] Backup automático para dados de triagem

## 🎯 **Priorização de Implementação**

### **Fase 1 - Fundação**
1. InterviewQuestion CRUD básico
2. InterviewAnswer submission
3. Appointment básico

### **Fase 2 - Triagem**
4. Triage CRUD
5. Risk score calculation
6. Pre-consultation summary

### **Fase 3 - Integrações**
7. Complete interview flow
8. Real-time notifications
9. Medical data export

### **Fase 4 - Otimizações**
10. Performance improvements
11. Advanced reporting
12. Mobile optimizations

---

## 📋 **Checklist de Qualidade**

Antes de marcar qualquer item como concluído:

- [ ] Código segue padrões do projeto
- [ ] Testes unitários e e2e implementados
- [ ] Validações de entrada implementadas
- [ ] Logs e métricas adicionados
- [ ] Documentação atualizada
- [ ] Review de segurança realizado
- [ ] Performance testada com dados reais