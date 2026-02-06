
## Estrutura de Arquivos

```
assets/js/
├── api.js              # Camada de API - Comunicação HTTP
├── utils.js            # Funções Utilitárias Compartilhadas
├── appointments.js     # Gerenciamento de Agendamentos
├── patients.js         # Gerenciamento de Pacientes
├── rooms.js            # Gerenciamento de Salas
├── users.js            # Gerenciamento de Usuários
└── app.js              # Aplicação Principal e Orquestração
```

## Descrição de Cada Arquivo

### `api.js`
**Responsabilidade:** Camada de API e comunicação HTTP com o backend

**Funções principais:**
- `api.fetchData(endpoint)` - Busca dados de um endpoint
- `api.deleteItem(endpoint, id)` - Deleta um item
- `api.createAppointment(payload)` - Cria um agendamento
- `api.createPatient(data)` - Cria um paciente
- `api.createRoom(data)` - Cria uma sala
- `api.createUser(payload)` - Cria um usuário

**Constantes:**
- `API_BASE_URL` - URL base da API
- `API_TIMEOUT` - Timeout para requisições

### `utils.js`
**Responsabilidade:** Funções utilitárias compartilhadas entre módulos

**Funções principais:**
- `utils.getStatusBadge(status)` - Retorna classe CSS para badge de status
- `utils.getStatusLabel(status)` - Retorna rótulo legível do status
- `utils.getRoleLabel(role)` - Retorna rótulo legível do papel do usuário
- `utils.formatError(err)` - Formata erro para mensagem legível
- `utils.showAlert(message, type)` - Exibe alerta na interface
- `utils.formatDateBR(dateString)` - Formata data no padrão BR
- `utils.formatTimeBR(dateString)` - Formata hora no padrão BR

### `appointments.js`
**Responsabilidade:** Lógica de gerenciamento de agendamentos

**Propriedades:**
- `appointments.data` - Array com dados dos agendamentos

**Métodos principais:**
- `appointments.render()` - Renderiza tabela de agendamentos
- `appointments.createRow(apt)` - Cria HTML de uma linha da tabela
- `appointments.filter(query)` - Filtra agendamentos pela query
- `appointments.handleForm(e)` - Processa formulário de novo agendamento
- `appointments.delete(id)` - Deleta um agendamento

### `patients.js`
**Responsabilidade:** Lógica de gerenciamento de pacientes

**Propriedades:**
- `patients.data` - Array com dados dos pacientes

**Métodos principais:**
- `patients.render()` - Renderiza tabela de pacientes
- `patients.createRow(patient)` - Cria HTML de uma linha da tabela
- `patients.filter(query)` - Filtra pacientes pela query
- `patients.handleForm(e)` - Processa formulário de novo paciente
- `patients.delete(id)` - Deleta um paciente

### `rooms.js`
**Responsabilidade:** Lógica de gerenciamento de salas

**Propriedades:**
- `rooms.data` - Array com dados das salas

**Métodos principais:**
- `rooms.render()` - Renderiza tabela de salas
- `rooms.createRow(room)` - Cria HTML de uma linha da tabela
- `rooms.filter(query)` - Filtra salas pela query
- `rooms.handleForm(e)` - Processa formulário de nova sala
- `rooms.delete(id)` - Deleta uma sala

### `users.js`
**Responsabilidade:** Lógica de gerenciamento de usuários

**Propriedades:**
- `users.data` - Array com dados dos usuários

**Métodos principais:**
- `users.render()` - Renderiza tabela de usuários
- `users.createRow(user)` - Cria HTML de uma linha da tabela
- `users.filter(query)` - Filtra usuários pela query
- `users.handleForm(e)` - Processa formulário de novo usuário
- `users.delete(id)` - Deleta um usuário

### `app.js`
**Responsabilidade:** Aplicação principal, orquestração e coordenação entre módulos

**Propriedades:**
- `appState.currentTab` - Aba ativa atual

**Métodos principais:**
- `appState.init()` - Inicializa a aplicação
- `appState.setupEventListeners()` - Configura listeners de eventos
- `appState.loadAllData()` - Carrega todos os dados da API
- `appState.switchTab(tabName)` - Muda entre abas
- `appState.populateSelects()` - Popula selects com dados carregados

## Fluxo de Dados

```
app.js (init)
  ↓
appState.loadAllData()
  ↓
api.fetchData() → [appointments, patients, rooms, users].render()
  ↓
appState.populateSelects()
```

## Fluxo de Criação

```
formulário → [appointments|patients|rooms|users].handleForm()
  ↓
api.create[Tipo]()
  ↓
utils.showAlert()
  ↓
appState.loadAllData()
```

## Fluxo de Deleção

```
delete button → [appointments|patients|rooms|users].delete(id)
  ↓
api.deleteItem()
  ↓
utils.showAlert()
  ↓
appState.loadAllData()
```

## Como Adicionar Nova Funcionalidade

Para adicionar uma nova entidade (ex: agendamentos → consultórios):

1. **Criar** `consultoriorios.js` com:
   - Objeto que armazena dados
   - Métodos `render()`, `createRow()`, `filter()`, `handleForm()`, `delete()`

2. **Adicionar** funções em `api.js`:
   - `api.fetchData('consultorios')`
   - `api.createConsultorio()`
   - `api.deleteItem('consultorios', id)`

3. **Atualizar** `app.js`:
   - Adicionar em `loadAllData()`
   - Adicionar listeners em `setupEventListeners()`
   - Adicionar populate select em `populateSelects()`

4. **Atualizar** `index.html`:
   - Adicionar script tag
   - Adicionar tab
   - Adicionar HTML dos formulários e tabelas

