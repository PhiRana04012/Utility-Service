const express = require('express');
const Issue = require('../models/Issue');
const IssueType = require('../models/IssueType');
const { createIssueSchema, updateIssueSchema } = require('../utils/validators');
const logger = require('../config/logger');

const router = express.Router();

// POST /issues
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

// GET /issues
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

// PUT /issues/:id
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