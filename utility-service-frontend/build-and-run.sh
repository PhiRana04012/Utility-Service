#!/bin/bash

# Скрипт для быстрой сборки и запуска Docker контейнера

echo "🔨 Сборка Docker образа..."
docker build -t utility-service-frontend .

if [ $? -eq 0 ]; then
    echo "✅ Образ успешно собран!"
    echo ""
    echo "🚀 Запуск контейнера..."
    echo "   Frontend будет доступен на http://localhost"
    echo "   Убедитесь, что backend запущен на порту 3001"
    echo ""
    
    docker run -d \
      -p 80:80 \
      -e API_BACKEND_URL=http://host.docker.internal:3001 \
      --name utility-frontend \
      utility-service-frontend
    
    if [ $? -eq 0 ]; then
        echo "✅ Контейнер успешно запущен!"
        echo ""
        echo "📋 Полезные команды:"
        echo "   Просмотр логов: docker logs -f utility-frontend"
        echo "   Остановка: docker stop utility-frontend"
        echo "   Удаление: docker rm utility-frontend"
    else
        echo "❌ Ошибка при запуске контейнера"
        exit 1
    fi
else
    echo "❌ Ошибка при сборке образа"
    exit 1
fi

