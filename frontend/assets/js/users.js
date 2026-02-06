// users.js - Gerenciamento de usuários
const users = {
  data: [],

  render() {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum usuário encontrado</td></tr>';
      return;
    }

    tbody.innerHTML = this.data.map(user => this.createRow(user)).join('');
  },

  createRow(user) {
    return `<tr>
      <td>${user.id || '-'}</td>
      <td>${user.name || '-'}</td>
      <td>${user.email || '-'}</td>
      <td><span class="badge badge-info">${utils.getRoleLabel(user.role) || '-'}</span></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="users.delete(${user.id})">🗑️</button>
      </td>
    </tr>`;
  },

  filter(query) {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;

    const q = (query || '').toLowerCase();
    const filtered = this.data.filter(user => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const role = (utils.getRoleLabel(user.role) || '').toLowerCase();

      return name.includes(q) || email.includes(q) || role.includes(q);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum resultado</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(user => this.createRow(user)).join('');
  },

  async handleForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Corrigir role para o formato esperado pelo backend (enum)
    if (data.role) {
      const roleMap = { 'admin': 'admin', 'professor': 'professor', 'student': 'student' };
      data.role = roleMap[data.role.toLowerCase()] || 'student';
    } else {
      data.role = 'student';
    }

    if (!data.name || !data.email || !data.password) {
      utils.showAlert('Nome, email e senha são obrigatórios', 'danger');
      return;
    }

    if (data.password.length < 8) {
      utils.showAlert('A senha deve ter pelo menos 8 caracteres', 'danger');
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role
    };

    const result = await api.createUser(payload);

    if (result.ok) {
      utils.showAlert('Usuário criado com sucesso!', 'success');
      e.target.reset();
      appState.loadAllData();
    } else {
      let msg = 'Erro ao criar usuário';
      if (result.data) {
        if (Array.isArray(result.data.detail)) {
          const details = result.data.detail.map(d => d.msg || JSON.stringify(d)).join('; ');
          msg += ': ' + details;
        } else if (result.data.detail && typeof result.data.detail === 'string') {
          msg += ': ' + result.data.detail;
        } else if (result.data.message) {
          msg += ': ' + result.data.message;
        } else {
          msg += ': ' + JSON.stringify(result.data);
        }
      } else {
        msg += ': ' + result.text;
      }
      utils.showAlert(msg, 'danger');
    }
  },

  async delete(id) {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    const result = await api.deleteItem('users', id);
    if (result.success) {
      utils.showAlert('Item deletado com sucesso!', 'success');
      appState.loadAllData();
    } else {
      utils.showAlert(`Erro ao deletar: ${result.error}`, 'danger');
    }
  }
};
