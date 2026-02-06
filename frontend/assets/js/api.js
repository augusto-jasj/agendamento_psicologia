// api.js - Camada de API e comunicação HTTP
const API_BASE_URL = 'http://localhost:8000';
const API_TIMEOUT = 10000; // 10 segundos

const api = {
  async fetchData(endpoint) {
    try {
      console.log(`  Buscando ${endpoint}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`  ✗ Erro HTTP ${response.status} para ${endpoint}`);
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const result = Array.isArray(data) ? data : data.items || data || [];
      console.log(`  ✓ ${endpoint} carregado (${result.length} items)`);
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`  ✗ Timeout ao buscar ${endpoint} (${API_TIMEOUT}ms)`);
      } else {
        console.error(`  ✗ Erro ao buscar ${endpoint}:`, error.message);
      }
      return [];
    }
  },

  async deleteItem(endpoint, id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        try {
          const errorData = await response.json();
          return { success: false, error: errorData.detail || 'Erro desconhecido' };
        } catch {
          return { success: false, error: `Erro ${response.status}` };
        }
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      return { success: false, error: error.message };
    }
  },

  async createAppointment(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const respText = await response.text();
      let respJson = null;
      try { respJson = JSON.parse(respText); } catch {}
      
      return {
        ok: response.ok,
        data: respJson,
        text: respText,
        status: response.status
      };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return { ok: false, error: error.message };
    }
  },

  async createPatient(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const respText = await response.text();
      let respJson = null;
      try { respJson = JSON.parse(respText); } catch {}
      
      return {
        ok: response.ok,
        data: respJson,
        text: respText,
        status: response.status
      };
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      return { ok: false, error: error.message };
    }
  },

  async createRoom(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      return {
        ok: response.ok,
        status: response.status
      };
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      return { ok: false, error: error.message };
    }
  },

  async createUser(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const respText = await response.text();
      let respJson = null;
      try { respJson = JSON.parse(respText); } catch {}
      
      return {
        ok: response.ok,
        data: respJson,
        text: respText,
        status: response.status
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return { ok: false, error: error.message };
    }
  }
};
