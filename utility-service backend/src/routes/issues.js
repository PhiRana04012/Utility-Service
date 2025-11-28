const express = require('express');
const Issue = require('../models/Issue');
const IssueType = require('../models/IssueType');
const { createIssueSchema, updateIssueSchema } = require('../utils/validators');
const logger = require('../config/logger');

const router = express.Router();

/**
 * @swagger
 * /issues:
 *   post:
 *     summary: Создать новую заявку ЖКХ
 *     tags: [Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIssueRequest'
 *           example:
 *             user_id: 123
 *             issue_type_id: 1
 *             description: "Протечка в ванной комнате"
 *             address: "ул. Ленина, д. 10, кв. 5"
 *     responses:
 *       201:
 *         description: Заявка успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *             example:
 *               id: 1
 *               user_id: 123
 *               issue_type_id: 1
 *               description: "Протечка в ванной комнате"
 *               address: "ул. Ленина, д. 10, кв. 5"
 *               status: "new"
 *               cost: 1500.00
 *               currency: "RUB"
 *               assignee_id: null
 *               service_name: "Сантехнические работы"
 *               service_price: 1500.00
 *               service_currency: "RUB"
 *               created_at: "2025-11-28T10:00:00.000Z"
 *               updated_at: "2025-11-28T10:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/', async (req, res, next) => {
  try {
    await createIssueSchema.validateAsync(req.body);

    const { user_id, issue_type_id, description, address } = req.body;

    // Проверяем существование типа заявки
    const issueType = await IssueType.findById(issue_type_id);
    if (!issueType) {
      return res.status(400).json({ error: 'Invalid issue_type_id' });
    }

    // Копируем цену и валюту из типа услуги
    const newIssue = await Issue.create({
      user_id,
      issue_type_id,
      description,
      address,
      cost: issueType.price,
      currency: issueType.currency,
    });

    logger.info(`Created issue ${newIssue.id} for user ${user_id}`);
    res.status(201).json(newIssue);
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ error: err.details[0].message });
    next(err);
  }
});

/**
 * @swagger
 * /issues:
 *   get:
 *     summary: Получить список заявок
 *     tags: [Issues]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Фильтр по ID пользователя
 *         example: 123
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in_progress, completed, cancelled]
 *         description: Фильтр по статусу заявки
 *         example: new
 *       - in: query
 *         name: assignee_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Фильтр по ID исполнителя
 *         example: 456
 *     responses:
 *       200:
 *         description: Список заявок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issue'
 *             example:
 *               - id: 1
 *                 user_id: 123
 *                 issue_type_id: 1
 *                 description: "Протечка в ванной комнате"
 *                 address: "ул. Ленина, д. 10, кв. 5"
 *                 status: "new"
 *                 cost: 1500.00
 *                 currency: "RUB"
 *                 assignee_id: null
 *                 service_name: "Сантехнические работы"
 *                 service_price: 1500.00
 *                 service_currency: "RUB"
 *                 created_at: "2025-11-28T10:00:00.000Z"
 *                 updated_at: "2025-11-28T10:00:00.000Z"
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/', async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.user_id) filters.user_id = Number(req.query.user_id);
    if (req.query.status) filters.status = req.query.status;
    if (req.query.assignee_id) filters.assignee_id = Number(req.query.assignee_id);

    const issues = await Issue.findAll(filters);
    res.json(issues);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /issues/{id}:
 *   put:
 *     summary: Обновить статус заявки
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID заявки
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIssueRequest'
 *           example:
 *             status: "in_progress"
 *             assignee_id: 456
 *     responses:
 *       200:
 *         description: Заявка успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *             example:
 *               id: 1
 *               user_id: 123
 *               issue_type_id: 1
 *               description: "Протечка в ванной комнате"
 *               address: "ул. Ленина, д. 10, кв. 5"
 *               status: "in_progress"
 *               cost: 1500.00
 *               currency: "RUB"
 *               assignee_id: 456
 *               service_name: "Сантехнические работы"
 *               service_price: 1500.00
 *               service_currency: "RUB"
 *               created_at: "2025-11-28T10:00:00.000Z"
 *               updated_at: "2025-11-28T10:30:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid issue ID' });

    await updateIssueSchema.validateAsync(req.body);

    const existing = await Issue.findById(id);
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    const updated = await Issue.updateStatus(id, req.body.status, req.body.assignee_id);
    logger.info(`Updated issue ${id} to status ${req.body.status}`);
    res.json(updated);
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ error: err.details[0].message });
    next(err);
  }
});

module.exports = router;