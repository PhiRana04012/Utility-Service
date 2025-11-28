const Joi = require('joi');

const createIssueSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  issue_type_id: Joi.number().integer().positive().required(),
  description: Joi.string().max(2000).required(),
  address: Joi.string().max(512).required(),
});

const updateIssueSchema = Joi.object({
  status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').required(),
  assignee_id: Joi.number().integer().positive().optional().allow(null),
});

module.exports = {
  createIssueSchema,
  updateIssueSchema,
};