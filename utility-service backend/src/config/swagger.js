const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Utility Service API',
      version: '1.0.0',
      description: 'API документация для микросервиса управления заявками ЖКХ',
      contact: {
        name: 'API Support',
        email: 'support@utility-service.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'http://backend:3001',
        description: 'Docker container server',
      },
    ],
    tags: [
      {
        name: 'Issues',
        description: 'Операции с заявками ЖКХ',
      },
    ],
    components: {
      schemas: {
        Issue: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор заявки',
              example: 1,
            },
            user_id: {
              type: 'integer',
              description: 'ID пользователя, создавшего заявку',
              example: 123,
            },
            issue_type_id: {
              type: 'integer',
              description: 'ID типа услуги',
              example: 1,
            },
            description: {
              type: 'string',
              description: 'Описание проблемы или запроса',
              example: 'Протечка в ванной комнате',
              maxLength: 2000,
            },
            address: {
              type: 'string',
              description: 'Адрес, где требуется выполнить работу',
              example: 'ул. Ленина, д. 10, кв. 5',
              maxLength: 512,
            },
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'completed', 'cancelled'],
              description: 'Статус заявки',
              example: 'new',
            },
            cost: {
              type: 'number',
              description: 'Стоимость услуги',
              example: 1500.00,
            },
            currency: {
              type: 'string',
              description: 'Валюта',
              example: 'RUB',
            },
            assignee_id: {
              type: 'integer',
              nullable: true,
              description: 'ID исполнителя заявки',
              example: 456,
            },
            service_name: {
              type: 'string',
              description: 'Название услуги',
              example: 'Сантехнические работы',
            },
            service_price: {
              type: 'number',
              description: 'Цена услуги из справочника',
              example: 1500.00,
            },
            service_currency: {
              type: 'string',
              description: 'Валюта услуги из справочника',
              example: 'RUB',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата и время создания заявки',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Дата и время последнего обновления',
            },
          },
        },
        CreateIssueRequest: {
          type: 'object',
          required: ['user_id', 'issue_type_id', 'description', 'address'],
          properties: {
            user_id: {
              type: 'integer',
              description: 'ID пользователя',
              example: 123,
              minimum: 1,
            },
            issue_type_id: {
              type: 'integer',
              description: 'ID типа услуги',
              example: 1,
              minimum: 1,
            },
            description: {
              type: 'string',
              description: 'Описание проблемы или запроса',
              example: 'Протечка в ванной комнате',
              maxLength: 2000,
            },
            address: {
              type: 'string',
              description: 'Адрес, где требуется выполнить работу',
              example: 'ул. Ленина, д. 10, кв. 5',
              maxLength: 512,
            },
          },
        },
        UpdateIssueRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'completed', 'cancelled'],
              description: 'Новый статус заявки',
              example: 'in_progress',
            },
            assignee_id: {
              type: 'integer',
              nullable: true,
              description: 'ID исполнителя (опционально)',
              example: 456,
              minimum: 1,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Описание ошибки',
              example: 'Invalid issue_type_id',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Ресурс не найден',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        BadRequest: {
          description: 'Некорректный запрос',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Ошибка валидации данных',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

