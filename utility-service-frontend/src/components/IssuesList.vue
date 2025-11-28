<template>
  <div class="issues-list">
    <div class="page-header">
      <h2>Список заявок ЖКХ</h2>
      <router-link to="/create" class="btn btn-primary">
        ➕ Создать заявку
      </router-link>
    </div>

    <!-- Фильтры -->
    <div class="card filters-card">
      <h3>Фильтры</h3>
      <div class="filters-grid">
        <div class="form-group">
          <label class="form-label">ID пользователя</label>
          <input
            v-model.number="filters.user_id"
            type="number"
            class="form-input"
            placeholder="Введите ID пользователя"
            @input="debouncedLoadIssues"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Статус</label>
          <select v-model="filters.status" class="form-select" @change="loadIssues">
            <option value="">Все статусы</option>
            <option value="new">Новая</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершена</option>
            <option value="cancelled">Отменена</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ID исполнителя</label>
          <input
            v-model.number="filters.assignee_id"
            type="number"
            class="form-input"
            placeholder="Введите ID исполнителя"
            @input="debouncedLoadIssues"
          />
        </div>
        <div class="form-group">
          <button @click="clearFilters" class="btn btn-secondary">
            Очистить фильтры
          </button>
        </div>
      </div>
    </div>

    <!-- Сообщения об ошибках -->
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="loading">
      Загрузка заявок...
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="issues.length === 0" class="empty-state">
      <div class="empty-state-icon">📋</div>
      <p>Заявки не найдены</p>
    </div>

    <!-- Список заявок -->
    <div v-else class="issues-grid">
      <div v-for="issue in issues" :key="issue.id" class="card issue-card">
        <div class="issue-header">
          <div class="issue-id">Заявка #{{ issue.id }}</div>
          <span :class="['badge', `badge-${issue.status}`]">
            {{ getStatusLabel(issue.status) }}
          </span>
        </div>

        <div class="issue-content">
          <div class="issue-field">
            <strong>Услуга:</strong> {{ issue.service_name || 'Не указано' }}
          </div>
          <div class="issue-field">
            <strong>Стоимость:</strong> {{ issue.cost }} {{ issue.currency || 'RUB' }}
          </div>
          <div class="issue-field">
            <strong>Адрес:</strong> {{ issue.address }}
          </div>
          <div class="issue-field">
            <strong>Описание:</strong> {{ issue.description }}
          </div>
          <div class="issue-field">
            <strong>Пользователь ID:</strong> {{ issue.user_id }}
          </div>
          <div v-if="issue.assignee_id" class="issue-field">
            <strong>Исполнитель ID:</strong> {{ issue.assignee_id }}
          </div>
          <div class="issue-field">
            <strong>Создано:</strong> {{ formatDate(issue.created_at) }}
          </div>
        </div>

        <div class="issue-actions">
          <label class="form-label">Изменить статус:</label>
          <div class="status-controls">
            <select
              :value="issue.status"
              @change="updateStatus(issue.id, $event.target.value)"
              class="form-select status-select"
            >
              <option value="new">Новая</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершена</option>
              <option value="cancelled">Отменена</option>
            </select>
            <input
              v-model.number="assigneeInputs[issue.id]"
              type="number"
              class="form-input assignee-input"
              placeholder="ID исполнителя"
              @blur="updateStatus(issue.id, issue.status, assigneeInputs[issue.id])"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { issuesApi } from '../services/api'

const issues = ref([])
const loading = ref(false)
const error = ref(null)
const filters = ref({
  user_id: null,
  status: '',
  assignee_id: null,
})
const assigneeInputs = ref({})

let debounceTimer = null

const debouncedLoadIssues = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadIssues()
  }, 500)
}

const loadIssues = async () => {
  loading.value = true
  error.value = null

  const cleanFilters = {}
  if (filters.value.user_id) cleanFilters.user_id = filters.value.user_id
  if (filters.value.status) cleanFilters.status = filters.value.status
  if (filters.value.assignee_id) cleanFilters.assignee_id = filters.value.assignee_id

  const result = await issuesApi.getIssues(cleanFilters)
  
  if (result.error) {
    error.value = result.error
    issues.value = []
  } else {
    issues.value = result.data || []
  }
  
  loading.value = false
}

const clearFilters = () => {
  filters.value = {
    user_id: null,
    status: '',
    assignee_id: null,
  }
  loadIssues()
}

const updateStatus = async (id, status, assignee_id = null) => {
  const result = await issuesApi.updateIssueStatus(id, status, assignee_id)
  
  if (result.error) {
    alert(`Ошибка: ${result.error}`)
  } else {
    // Обновляем заявку в списке
    const index = issues.value.findIndex(issue => issue.id === id)
    if (index !== -1) {
      issues.value[index] = result.data
    }
  }
}

const getStatusLabel = (status) => {
  const labels = {
    new: 'Новая',
    in_progress: 'В работе',
    completed: 'Завершена',
    cancelled: 'Отменена',
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU')
}

onMounted(() => {
  loadIssues()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 2rem;
  color: #333;
}

.filters-card {
  margin-bottom: 2rem;
}

.filters-card h3 {
  margin-bottom: 1rem;
  color: #555;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.issues-grid {
  display: grid;
  gap: 1.5rem;
}

.issue-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.issue-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.issue-id {
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.issue-content {
  margin-bottom: 1.5rem;
}

.issue-field {
  margin-bottom: 0.75rem;
  color: #555;
}

.issue-field strong {
  color: #333;
  margin-right: 0.5rem;
}

.issue-actions {
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.status-controls {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.status-select {
  flex: 1;
}

.assignee-input {
  flex: 1;
  max-width: 150px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .status-controls {
    flex-direction: column;
  }

  .assignee-input {
    max-width: 100%;
  }
}
</style>



