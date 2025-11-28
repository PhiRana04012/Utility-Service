import axios from 'axios'


const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  
  : (import.meta.env.VITE_API_URL || '/api')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const issuesApi = {
  // Получить список заявок
  async getIssues(filters = {}) {
    try {
      const params = new URLSearchParams()
      if (filters.user_id) params.append('user_id', filters.user_id)
      if (filters.status) params.append('status', filters.status)
      if (filters.assignee_id) params.append('assignee_id', filters.assignee_id)

      const response = await api.get('/issues', { params })
      return { data: response.data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.error || error.message || 'Ошибка при загрузке заявок',
      }
    }
  },

  // Создать заявку
  async createIssue(issueData) {
    try {
      const response = await api.post('/issues', issueData)
      return { data: response.data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.error || error.message || 'Ошибка при создании заявки',
      }
    }
  },

  // Обновить статус заявки
  async updateIssueStatus(id, status, assignee_id = null) {
    try {
      const response = await api.put(`/issues/${id}`, { status, assignee_id })
      return { data: response.data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.error || error.message || 'Ошибка при обновлении заявки',
      }
    }
  },
}

export default api

