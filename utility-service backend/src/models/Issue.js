const db = require('../config/database');

const Issue = {
  async create(data) {
    const [id] = await db('issues').insert(data).returning('id');
    return this.findById(id);
  },

  async findAll(filters = {}) {
    let query = db('issues as i')
      .join('issue_types as it', 'i.issue_type_id', 'it.id')
      .select(
        'i.*',
        'it.name as service_name',
        'it.price as service_price',
        'it.currency as service_currency'
      );

    if (filters.user_id) query = query.where('i.user_id', filters.user_id);
    if (filters.status) query = query.where('i.status', filters.status);
    if (filters.assignee_id) query = query.where('i.assignee_id', filters.assignee_id);

    return query;
  },

  async findById(id) {
    const issue = await db('issues as i')
      .join('issue_types as it', 'i.issue_type_id', 'it.id')
      .select(
        'i.*',
        'it.name as service_name',
        'it.price as service_price',
        'it.currency as service_currency'
      )
      .where('i.id', id)
      .first();
    return issue;
  },

  async updateStatus(id, status, assignee_id = null) {
    const updateData = { status };
    if (assignee_id !== undefined) updateData.assignee_id = assignee_id;

    await db('issues').where('id', id).update(updateData);
    return this.findById(id);
  },
};
module.exports = Issue;