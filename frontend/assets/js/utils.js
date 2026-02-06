// utils.js - Funções utilitárias compartilhadas
const utils = {
  getStatusBadge(status) {
    const badges = {
      'confirmed': 'badge-success',
      'pending': 'badge-warning',
      'cancelled': 'badge-danger',
      'completed': 'badge-info',
      'scheduled': 'badge-info',
    };
    return badges[status] || 'badge-secondary';
  },

  getStatusLabel(status) {
    const labels = {
      'scheduled': 'Agendado',
      'confirmed': 'Confirmado',
      'pending': 'Pendente',
      'cancelled': 'Cancelado',
      'completed': 'Concluído',
      'in_progress': 'Em andamento',
      'no_show': 'Falta',
    };
    return labels[status] || (typeof status === 'string' ? status : '—');
  },

  getRoleLabel(role) {
    if (!role) return '-';
    const key = role.toString().toLowerCase();
    const map = {
      'admin': 'Administrador',
      'professor': 'Professor',
      'student': 'Estudante',
    };
    return map[key] || role;
  },

  formatError(err) {
    if (!err) return '';
    if (typeof err === 'string') return err;
    try {
      if (Array.isArray(err.detail)) {
        return err.detail.map(d => d.msg || JSON.stringify(d)).join('; ');
      }
      if (err.detail && typeof err.detail === 'string') return err.detail;
      if (err.message) return err.message;
      if (err.errors && Array.isArray(err.errors)) {
        return err.errors.map(e => `${e.field}: ${e.message}`).join('; ');
      }
      return JSON.stringify(err);
    } catch (e) {
      return String(err);
    }
  },

  showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;

    const msgSpan = document.createElement('span');
    msgSpan.textContent = typeof message === 'string' ? message : this.formatError(message);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'alert-close';
    closeBtn.innerText = '×';
    closeBtn.addEventListener('click', () => alertDiv.remove());

    alertDiv.appendChild(msgSpan);
    alertDiv.appendChild(closeBtn);
    alertContainer.appendChild(alertDiv);

    setTimeout(() => alertDiv.remove(), 7000);
  },

  parseDate(dateString) {
    const d = new Date(dateString);
    return !isNaN(d) ? d : null;
  },

  formatDateBR(dateString) {
    const d = this.parseDate(dateString);
    return d ? d.toLocaleDateString('pt-BR') : '-';
  },

  formatTimeBR(dateString) {
    const d = this.parseDate(dateString);
    return d ? d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) : '-';
  }
};
