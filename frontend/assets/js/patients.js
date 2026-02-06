// patients.js - Gerenciamento de pacientes
const patients = {
  data: [],

  render() {
    const tbody = document.querySelector('#patientsTable tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum paciente encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = this.data.map(patient => this.createRow(patient)).join('');
  },

  createRow(patient) {
    const birthdate = utils.formatDateBR(patient.birthdate);
    const notes = patient.notes || '-';

    return `<tr>
      <td>${patient.id || '-'}</td>
      <td>${patient.name || '-'}</td>
      <td>${patient.email || '-'}</td>
      <td>${patient.phone || '-'}</td>
      <td>${birthdate}</td>
      <td>${notes}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="patients.delete(${patient.id})">🗑️</button>
      </td>
    </tr>`;
  },

  filter(query) {
    const tbody = document.querySelector('#patientsTable tbody');
    if (!tbody) return;

    const q = (query || '').toLowerCase();
    const filtered = this.data.filter(patient => {
      const name = (patient.name || '').toLowerCase();
      const email = (patient.email || '').toLowerCase();
      const phone = (patient.phone || '').toLowerCase();
      const birthdate = patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('pt-BR').toLowerCase() : '';
      const isChild = patient.is_child ? 'sim' : 'não';

      return name.includes(q) || email.includes(q) || phone.includes(q) || birthdate.includes(q) || isChild.includes(q);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum resultado</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(patient => this.createRow(patient)).join('');
  },

  async handleForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Converter is_child para booleano
    if (data.is_child !== undefined) {
      data.is_child = data.is_child === 'true' || data.is_child === true;
    }

    // Converter birthdate vazio para null
    if (!data.birthdate) {
      data.birthdate = null;
    }

    // Garantir que notes seja string ou null
    if (typeof data.notes === 'undefined' || data.notes === '') {
      data.notes = null;
    }

    const result = await api.createPatient(data);

    if (result.ok) {
      utils.showAlert('Paciente criado com sucesso!', 'success');
      e.target.reset();
      appState.loadAllData();
    } else {
      utils.showAlert('Erro ao criar paciente: ' + result.status, 'danger');
    }
  },

  async delete(id) {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    const result = await api.deleteItem('patients', id);
    if (result.success) {
      utils.showAlert('Item deletado com sucesso!', 'success');
      appState.loadAllData();
    } else {
      utils.showAlert(`Erro ao deletar: ${result.error}`, 'danger');
    }
  }
};
