// rooms.js - Gerenciamento de salas
const rooms = {
  data: [],

  render() {
    const tbody = document.querySelector('#roomsTable tbody');
    if (!tbody) return;

    if (this.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma sala encontrada</td></tr>';
      return;
    }

    tbody.innerHTML = this.data.map(room => this.createRow(room)).join('');
  },

  createRow(room) {
    return `<tr>
      <td>${room.id || '-'}</td>
      <td>${room.name || '-'}</td>
      <td>${room.description || '-'}</td>
      <td>${room.capacity || '-'}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="rooms.delete(${room.id})">🗑️</button>
      </td>
    </tr>`;
  },

  filter(query) {
    const tbody = document.querySelector('#roomsTable tbody');
    if (!tbody) return;

    const q = (query || '').toLowerCase();
    const filtered = this.data.filter(room => {
      const name = (room.name || '').toLowerCase();
      const desc = (room.description || '').toLowerCase();
      const capacity = (room.capacity ? String(room.capacity) : '').toLowerCase();

      return name.includes(q) || desc.includes(q) || capacity.includes(q);
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum resultado</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(room => this.createRow(room)).join('');
  },

  async handleForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Converter capacity para inteiro
    if (data.capacity) {
      data.capacity = parseInt(data.capacity, 10);
    }

    const result = await api.createRoom(data);

    if (result.ok) {
      utils.showAlert('Sala criada com sucesso!', 'success');
      e.target.reset();
      appState.loadAllData();
    } else {
      utils.showAlert('Erro ao criar sala', 'danger');
    }
  },

  async delete(id) {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    const result = await api.deleteItem('rooms', id);
    if (result.success) {
      utils.showAlert('Item deletado com sucesso!', 'success');
      appState.loadAllData();
    } else {
      utils.showAlert(`Erro ao deletar: ${result.error}`, 'danger');
    }
  }
};
