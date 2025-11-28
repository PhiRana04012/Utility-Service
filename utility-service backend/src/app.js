const express = require('express');
const issuesRouter = require('./routes/issues');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

const app = express();
app.use(express.json());


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use('/issues', issuesRouter);
app.use(errorHandler);

module.exports = app;