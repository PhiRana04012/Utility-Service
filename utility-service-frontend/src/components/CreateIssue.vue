<template>
  <div class="create-issue">
    <div class="page-header">
      <h2>Создать новую заявку</h2>
      <router-link to="/" class="btn btn-secondary">
        ← Назад к списку
      </router-link>
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">ID пользователя *</label>
          <input
            v-model.number="form.user_id"
            type="number"
            class="form-input"
            placeholder="Введите ID пользователя"
            required
            min="1"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Тип услуги (ID) *</label>
          <input
            v-model.number="form.issue_type_id"
            type="number"
            class="form-input"
            placeholder="Введите ID типа услуги"
            required
            min="1"
          />
          <small class="form-hint">Например: 1, 2, 3 и т.д.</small>
        </div>

        <div class="form-group">
          <label class="form-label">Адрес *</label>
          <input
            v-model="form.address"
            type="text"
            class="form-input"
            placeholder="Введите адрес"
            required
            maxlength="512"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Описание *</label>
          <textarea
            v-model="form.description"
            class="form-textarea"
            placeholder="Опишите проблему или запрос"
            required
            maxlength="2000"
          ></textarea>
          <small class="form-hint">{{ form.description.length }}/2000 символов</small>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          Заявка успешно создана! ID заявки: {{ createdIssueId }}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Создание...</span>
            <span v-else>✅ Создать заявку</span>
          </button>
          <button type="button" @click="resetForm" class="btn btn-secondary">
            Очистить форму
          </button>
        </div>
      </form>
    </div>

    <div class="card info-card">
      <h3>Информация</h3>
      <p>Все поля обязательны для заполнения. После создания заявки вы будете перенаправлены на страницу со списком заявок.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { issuesApi } from '../services/api'

const router = useRouter()

const form = ref({
  user_id: null,
  issue_type_id: null,
  description: '',
  address: '',
})

const loading = ref(false)
const error = ref(null)
const success = ref(false)
const createdIssueId = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  success.value = false

  const result = await issuesApi.createIssue({
    user_id: form.value.user_id,
    issue_type_id: form.value.issue_type_id,
    description: form.value.description,
    address: form.value.address,
  })

  loading.value = false

  if (result.error) {
    error.value = result.error
  } else {
    success.value = true
    createdIssueId.value = result.data.id
    
    // Перенаправляем на список через 2 секунды
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
}

const resetForm = () => {
  form.value = {
    user_id: null,
    issue_type_id: null,
    description: '',
    address: '',
  }
  error.value = null
  success.value = false
  createdIssueId.value = null
}
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

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #666;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.info-card {
  margin-top: 2rem;
  background-color: #f8f9fa;
}

.info-card h3 {
  margin-bottom: 0.75rem;
  color: #555;
}

.info-card p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>



