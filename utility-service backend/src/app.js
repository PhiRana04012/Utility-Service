const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const issuesRouter = require('./routes/issues');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

const app = express();
app.use(express.json());

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Utility Service API Documentation',
}));

// Логирование запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use('/issues', issuesRouter);
app.use(errorHandler);

module.exports = app;