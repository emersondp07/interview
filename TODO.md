# TODO - Casos de Uso e Implementações

## 🎯 Casos de Uso Pendentes

### 📋 **InterviewQuestion (Perguntas da Entrevista)**

- [x] **create-interview-question** - Empresas/entrevistadores criam questões personalizadas
- [x] **fetch-interview-questions** - Lista perguntas disponíveis para uma entrevista
- [x] **update-interview-question** - Atualiza uma pergunta existente
- [x] **delete-interview-question** - Remove uma pergunta
- [x] **fetch-questions-by-interview** - Busca perguntas específicas de uma entrevista

### 💬 **InterviewAnswer (Respostas da Entrevista)**

- [x] **submit-interview-answers** - Cliente submete respostas do questionário
- [x] **fetch-client-answers** - Busca respostas de um cliente específico
- [ ] **fetch-answers-by-interview** - Busca todas as respostas de uma entrevista
- [x] **update-interview-answer** - Permite alterar uma resposta antes da finalização
- [x] **generate-interview-report** - Gera relatório com respostas para o médico

### 🏥 **Triage (Triagem de Enfermagem)**

- [x] **create-triage** - Enfermeiro cria registro de triagem
- [x] **fetch-client-triages** - Lista histórico de triagens do cliente
- [x] **update-triage** - Atualiza dados da triagem
- [x] **fetch-triage-by-appointment** - Busca triagem específica do agendamento
- [x] **calculate-risk-score** - Calcula score de risco baseado nos sinais vitais

### 🔗 **Integração e Fluxos Complexos**

- [ ] **prepare-interview-data** - Prepara dados completos (triagem + respostas) para entrevista
- [ ] **schedule-appointment-with-triage** - Agenda consulta já com triagem feita
- [ ] **export-medical-data** - Exporta dados médicos completos do cliente
- [ ] **validate-interview-completion** - Valida se todas as etapas obrigatórias foram preenchidas
- [ ] **generate-pre-consultation-summary** - Gera resumo para o médico antes da consulta

### 📅 **Appointment (Agendamentos)**

- [x] **create-appointment** - Cria agendamento para cliente
- [x] **fetch-appointments-by-client** - Lista agendamentos do cliente
- [x] **update-appointment-status** - Atualiza status do agendamento
- [x] **assign-interviewer-to-appointment** - Atribui médico ao agendamento
- [x] **cancel-appointment** - Cancela agendamento

## 📐 Regras de Implementação

### 🏗️ **Estrutura Clean Architecture**

#### **Domain Layer** (`src/domain/`)
- [x] Criar entidades para `InterviewQuestion`, `InterviewAnswer`, `Triage`
- [x] Implementar repositórios interfaces para cada entidade
- [x] Definir value objects para tipos específicos (ex: `VitalSigns`, `RiskScore`)

#### **Application Layer** (`src/application/`)
- [x] Organizar use cases por contexto: `interview/`, `triage/`, `appointment/`
- [x] Seguir padrão: `use-cases/` + `validators/` para cada contexto
- [x] Criar DTOs específicos para entrada e saída de cada use case
- [x] Implementar validações com Zod schemas

#### **Infrastructure Layer** (`src/infra/`)
- [x] Implementar repositórios Prisma para as novas entidades
- [x] Criar mappers bidirecionais (Domain ↔ Prisma)
- [x] Integrar com banco de dados PostgreSQL

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
- [x] Testar cada use case isoladamente
- [x] Mockar dependências externas
- [x] Cobrir cenários de sucesso e erro
- [x] Validar regras de negócio específicas

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

## 🔧 **Mappers e Repositories - Funções CRUD Faltantes**

### **Repositories com CRUD Incompleto (12/17 precisam de implementação):**

#### **Faltando múltiplas funções CRUD:**
- [ ] **prisma-administrators-repository.ts** - falta: `findById()`, `findAll()`, `update()`, `delete()`
- [ ] **prisma-contracts-repository.ts** - falta: `findById()`, `findAll()`, `update()`, `delete()`
- [ ] **prisma-signatures-repository.ts** - falta: `findAll()`, `delete()`

#### **Faltando função `update()`:**
- [ ] **prisma-companies-repository.ts** - falta: `update()`
- [ ] **prisma-clients-repository.ts** - falta: `update()`
- [ ] **prisma-interviewers-repository.ts** - falta: `update()`
- [ ] **prisma-interviews-repository.ts** - falta: `update()`, `delete()`

#### **Faltando função `delete()`:**
- [ ] **prisma-plans-repository.ts** - falta: `delete()`

#### **Inconsistência de Mappers (repositories que não usam seus mappers):**
- [ ] **prisma-interview-answers-repository.ts** - usar `PrismaInterviewAnswerMapper`
- [ ] **prisma-medications-repository.ts** - usar `PrismaMedicationMapper`
- [ ] **prisma-triages-repository.ts** - usar `PrismaTriageMapper`
- [ ] **prisma-vital-signs-repository.ts** - usar `PrismaVitalSignsMapper`

### **Padrões de Implementação CRUD:**

#### **Função `create()`:**
```typescript
async create(entity: DomainEntity) {
    const prismaData = PrismaMapper.toPrisma(entity)
    await prisma.model.create({ data: prismaData })
}
```

#### **Função `update()`:**
```typescript
async update(entity: DomainEntity) {
    await prisma.model.update({
        where: { id: entity.id.toString() },
        data: PrismaMapper.toPrisma(entity)
    })
}
```

#### **Função `delete()` (Soft Delete):**
```typescript
async delete(entity: DomainEntity) {
    await prisma.model.update({
        where: { id: entity.id.toString() },
        data: {
            deleted_at: new Date(),
            updated_at: new Date()
        }
    })
}
```

#### **Função `findAll()` com Paginação:**
```typescript
async findAll({ page }: PaginationParams) {
    const entities = await prisma.model.findMany({
        where: { deleted_at: null },
        take: 10,
        skip: (page - 1) * 10,
        orderBy: { created_at: 'desc' }
    })
    return entities.map(PrismaMapper.toDomain)
}
```

### **Prioridade de Implementação:**
1. **Alta**: Implementar funções CRUD faltantes nos repositories principais
2. **Média**: Corrigir inconsistências de mappers
3. **Baixa**: Padronizar assinaturas de métodos e tratamento de erros

### 📝 **Padrões de Código**

- [x] Usar TypeScript com strict mode
- [x] Seguir convenções do Biome (tabs, single quotes)
- [x] Path aliases `@*` para imports internos
- [x] Nomenclatura consistente com codebase existente
- [x] Documentação JSDoc para funções públicas

### 🗄️ **Database & Migrations**

- [ ] Criar migrations para novos campos se necessário
- [ ] Implementar índices otimizados para queries frequentes
- [ ] Configurar soft delete para dados sensíveis
- [ ] Backup automático para dados de triagem

## 🎯 **Priorização de Implementação**

### **Fase 1 - Fundação** ✅
1. [x] InterviewQuestion CRUD básico
2. [x] InterviewAnswer submission
3. [x] Appointment básico

### **Fase 2 - Triagem** ✅
4. [x] Triage CRUD
5. [x] Risk score calculation
6. [ ] Pre-consultation summary

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