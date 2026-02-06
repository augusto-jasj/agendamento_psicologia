// app.js - Aplicação principal e orquestração
const appState = {
  currentTab: 'appointments',

  init() {
    console.log('🔧 Inicializando aplicação...');
    this.setupEventListeners();
    this.loadAllData();
    // Recarregar dados a cada 10 segundos
    setInterval(() => this.loadAllData(), 10000);
  },

  setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Forms
    document.getElementById('appointmentForm')?.addEventListener('submit', (e) => appointments.handleForm(e));
    document.getElementById('patientForm')?.addEventListener('submit', (e) => patients.handleForm(e));
    document.getElementById('roomForm')?.addEventListener('submit', (e) => rooms.handleForm(e));
    document.getElementById('userForm')?.addEventListener('submit', (e) => users.handleForm(e));

    // Search/Filter
    document.getElementById('appointmentSearch')?.addEventListener('input', (e) => appointments.filter(e.target.value));
    document.getElementById('patientSearch')?.addEventListener('input', (e) => patients.filter(e.target.value));
    document.getElementById('roomSearch')?.addEventListener('input', (e) => rooms.filter(e.target.value));
    document.getElementById('userSearch')?.addEventListener('input', (e) => users.filter(e.target.value));
  },

  async loadAllData() {
    try {
      console.log('📥 Carregando dados da API...');

      const appointmentsPromise = api.fetchData('appointments').then(data => {
        appointments.data = data;
        appointments.render();
        console.log(`✓ ${appointments.data.length} agendamentos carregados`);
      });

      const patientsPromise = api.fetchData('patients').then(data => {
        patients.data = data;
        patients.render();
        console.log(`✓ ${patients.data.length} pacientes carregados`);
      });

      const roomsPromise = api.fetchData('rooms').then(data => {
        rooms.data = data;
        rooms.render();
        console.log(`✓ ${rooms.data.length} salas carregadas`);
      });

      const usersPromise = api.fetchData('users').then(data => {
        users.data = data;
        users.render();
        console.log(`✓ ${users.data.length} usuários carregados`);
      });

      await Promise.all([appointmentsPromise, patientsPromise, roomsPromise, usersPromise]);

      this.populateSelects();
      console.log('✓ Todos os dados carregados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      utils.showAlert('Erro ao conectar com a API: ' + error.message, 'danger');
    }
  },

  switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    document.querySelector(`#${tabName}-tab`)?.classList.remove('hidden');
    this.currentTab = tabName;
  },

  populateSelects() {
    // Patient select
    const patientSelect = document.querySelector('select[name="patient_id"]');
    if (patientSelect && document.activeElement !== patientSelect) {
      const prev = patientSelect.value;
      patientSelect.innerHTML = '<option value="">Selecione um paciente...</option>' +
        patients.data.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      if (prev) {
        const found = Array.from(patientSelect.options).some(o => o.value === prev);
        if (found) patientSelect.value = prev;
      }
    }

    // Room select
    const roomSelect = document.querySelector('select[name="room_id"]');
    if (roomSelect && document.activeElement !== roomSelect) {
      const prev = roomSelect.value;
      roomSelect.innerHTML = '<option value="">Selecione uma sala...</option>' +
        rooms.data.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
      if (prev) {
        const found = Array.from(roomSelect.options).some(o => o.value === prev);
        if (found) roomSelect.value = prev;
      }
    }

    // Student select
    const studentSelect = document.querySelector('select[name="student_id"]');
    if (studentSelect && document.activeElement !== studentSelect) {
      const prev = studentSelect.value;
      const students = users.data.filter(u => {
        const role = (u.role || '').toString().toLowerCase();
        return role === 'student';
      });
      studentSelect.innerHTML = '<option value="">Selecione um estagiário...</option>' +
        students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      if (prev) {
        const found = Array.from(studentSelect.options).some(o => o.value === prev);
        if (found) studentSelect.value = prev;
      }
    }

    // Supervisor select
    const supervisorSelect = document.querySelector('select[name="supervisor_id"]');
    if (supervisorSelect && document.activeElement !== supervisorSelect) {
      const prev = supervisorSelect.value;
      const professors = users.data.filter(u => {
        const role = (u.role || '').toString().toLowerCase();
        return role === 'professor' || role === 'admin';
      });
      supervisorSelect.innerHTML = '<option value="">Selecione um profissional...</option>' +
        professors.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      if (prev) {
        const found = Array.from(supervisorSelect.options).some(o => o.value === prev);
        if (found) supervisorSelect.value = prev;
      }
    }
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado, inicializando app...');
  appState.init();
});
