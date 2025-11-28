# Быстрый старт с Docker

## Вариант 1: Docker Compose (рекомендуется)

Если у вас есть backend в Docker:

```bash
# Запуск frontend и backend вместе
docker-compose up -d

# Приложение будет доступно на http://localhost
```

## Вариант 2: Отдельный контейнер

Если backend запущен на хосте (localhost:3001):

### Windows/Mac:
```bash
# Сборка
docker build -t utility-service-frontend .

# Запуск
docker run -d -p 80:80 \
  -e API_BACKEND_URL=http://host.docker.internal:3001 \
  --name utility-frontend \
  utility-service-frontend
```

### Linux:
```bash
# Сборка
docker build -t utility-service-frontend .

# Запуск (замените 172.17.0.1 на IP вашего Docker bridge)
docker run -d -p 80:80 \
  -e API_BACKEND_URL=http://172.17.0.1:3001 \
  --name utility-frontend \
  utility-service-frontend
```

## Проверка

Откройте в браузере: **http://localhost**

## Остановка

```bash
# Для docker-compose
docker-compose down

# Для отдельного контейнера
docker stop utility-frontend
docker rm utility-frontend
```

## Просмотр логов

```bash
# Docker Compose
docker-compose logs -f frontend

# Отдельный контейнер
docker logs -f utility-frontend
```

