// appointments.js - Gerenciamento de agendamentos
const appointments = {
  data: [],

  render() {
    const tbody = document.querySelector('#appointmentsTable tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhum agendamento encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = this.data.map(apt => this.createRow(apt)).join('');
  },

  createRow(apt) {
    const patientName = apt.patient_name || (apt.patient && apt.patient.name) || '-';
    const roomName = apt.room_name || (apt.room && apt.room.name) || '-';
    const startDate = utils.formatDateBR(apt.start_dt);
    const startTime = utils.formatTimeBR(apt.start_dt);
    const endTime = utils.formatTimeBR(apt.end_dt);
    const status = apt.status || 'scheduled';

    return `<tr>
      <td>${apt.id || '-'}</td>
      <td>${patientName}</td>
      <td>${roomName}</td>
      <td>${startDate}</td>
      <td>${startTime} - ${endTime}</td>
      <td><span class="badge ${utils.getStatusBadge(status)}">${utils.getStatusLabel(status)}</span></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="appointments.delete(${apt.id})">🗑️</button>
      </td>
    </tr>`;
  },

  filter(query) {
    const tbody = document.querySelector('#appointmentsTable tbody');
    if (!tbody) return;

    const q = (query || '').toLowerCase();
    const filtered = this.data.filter(apt => {
      const patient = (apt.patient_name || apt.patient?.name || '').toLowerCase();
      const room = (apt.room_name || apt.room?.name || '').toLowerCase();
      const status = (utils.getStatusLabel(apt.status || 'scheduled') || '').toLowerCase();
      const date = apt.start_dt ? new Date(apt.start_dt).toLocaleDateString('pt-BR').toLowerCase() : '';
      return patient.includes(q) || room.includes(q) || status.includes(q) || date.includes(q);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Nenhum resultado</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(apt => this.createRow(apt)).join('');
  },

  async handleForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData);

    // Validação
    const appointmentDate = entries.appointment_date;
    const startTime = entries.start_time;
    const endTime = entries.end_time;

    if (!appointmentDate || !startTime || !endTime) {
      utils.showAlert('Data e horário são obrigatórios', 'danger');
      return;
    }

    const room_id = parseInt(entries.room_id, 10);
    const patient_id = parseInt(entries.patient_id, 10);
    const student_id = parseInt(entries.student_id, 10);
    const supervisor_id = parseInt(entries.supervisor_id, 10);

    if (!room_id || !patient_id || !student_id || !supervisor_id) {
      utils.showAlert('Sala, paciente, estagiário e supervisor são obrigatórios', 'danger');
      return;
    }

    const start_dt = new Date(`${appointmentDate}T${startTime}`);
    const end_dt = new Date(`${appointmentDate}T${endTime}`);
    const now = new Date();

    if (start_dt <= now) {
      utils.showAlert('A data/hora do agendamento deve ser no futuro', 'danger');
      return;
    }

    if (end_dt <= start_dt) {
      utils.showAlert('A hora de fim deve ser posterior à hora de início', 'danger');
      return;
    }

    const payload = {
      start_dt: start_dt.toISOString(),
      end_dt: end_dt.toISOString(),
      room_id: Number(room_id),
      patient_id: Number(patient_id),
      student_id: Number(student_id),
      supervisor_id: Number(supervisor_id),
      notes: entries.notes || null,
    };

    const result = await api.createAppointment(payload);

    if (result.ok) {
      utils.showAlert('Agendamento criado com sucesso!', 'success');
      e.target.reset();
      appState.loadAllData();
    } else {
      let msg = 'Erro ao criar agendamento';
      const serverMsg = result.data && (result.data.detail || result.data.message);
      if (serverMsg) msg += ': ' + serverMsg;
      else msg += ': ' + result.text;
      utils.showAlert(msg, 'danger');
    }
  },

  async delete(id) {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    const result = await api.deleteItem('appointments', id);
    if (result.success) {
      utils.showAlert('Item deletado com sucesso!', 'success');
      appState.loadAllData();
    } else {
      utils.showAlert(`Erro ao deletar: ${result.error}`, 'danger');
    }
  }
};
