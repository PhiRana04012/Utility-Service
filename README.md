# Utility Service - Микросервис управления заявками ЖКХ

Полнофункциональный микросервис для управления заявками жилищно-коммунального хозяйства с разделением на backend и frontend части.

## 🏗️ Архитектура

Проект состоит из трех основных компонентов:

- **Backend** (Node.js + Express + MySQL) - RESTful API сервис
- **Frontend** (Vue 3 + Vite) - Клиентское приложение
- **Database** (MySQL 8.0) - База данных

## 🚀 Быстрый старт

### Требования

- Docker и Docker Compose
- Git

### Запуск через Docker Compose

```bash
# Клонировать репозиторий
git clone https://github.com/PhiRana04012/Utility-Service.git
cd Utility-Service

# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps
```

После запуска:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001/issues
- **База данных**: localhost:3307

### Выполнение миграций

```bash
docker exec -it utility-backend sh
npx knex migrate:latest
exit
```

## 📋 API Endpoints

### Backend API

- `GET /issues` - Получить список заявок
  - Query параметры: `user_id`, `status`, `assignee_id`
- `POST /issues` - Создать новую заявку
  - Body: `{ user_id, issue_type_id, description, address }`
- `PUT /issues/:id` - Обновить статус заявки
  - Body: `{ status, assignee_id? }`
  - Статусы: `new`, `in_progress`, `completed`, `cancelled`

## 🛠️ Разработка

### Backend

```bash
cd "utility-service backend"
npm install
npm run dev
```

### Frontend

```bash
cd utility-service-frontend
npm install
npm run dev
```

## 📦 Структура проекта

```
Utility-Service/
├── docker-compose.yml          # Конфигурация всех сервисов
├── README.md                   # Этот файл
├── QUICKSTART.md              # Быстрый старт
├── README.DOCKER.md           # Docker документация
│
├── utility-service backend/   # Backend сервис
│   ├── src/
│   │   ├── routes/           # API маршруты
│   │   ├── models/           # Модели данных
│   │   ├── config/           # Конфигурация
│   │   └── database/         # Миграции БД
│   ├── Dockerfile
│   └── package.json
│
└── utility-service-frontend/  # Frontend приложение
    ├── src/
    │   ├── components/       # Vue компоненты
    │   ├── services/         # API клиент
    │   └── App.vue
    ├── Dockerfile
    └── package.json
```

## 🐳 Docker

Все сервисы упакованы в Docker контейнеры:

- **Backend**: Node.js 18 Alpine
- **Frontend**: Nginx Alpine (production build)
- **Database**: MySQL 8.0

Подробная документация: [README.DOCKER.md](./README.DOCKER.md)

## 📝 Функциональность

- ✅ Создание заявок ЖКХ
- ✅ Просмотр списка заявок с фильтрацией
- ✅ Обновление статуса заявок
- ✅ Назначение исполнителей
- ✅ Современный адаптивный UI
- ✅ Обработка ошибок
- ✅ Логирование операций

## 🔧 Технологии

### Backend
- Node.js 18
- Express 5
- MySQL 2
- Knex.js (миграции)
- Joi (валидация)
- Winston (логирование)

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Axios
- Vite
- Nginx (production)

## 📄 Лицензия

ISC

## 👤 Автор

PhiRana04012

## 🤝 Вклад

Pull requests приветствуются! Для больших изменений сначала откройте issue для обсуждения.

