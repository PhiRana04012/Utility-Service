const db = require('../config/database');

const IssueType = {
  async findById(id) {
    return db('issue_types').where('id', id).first();
  },
};
module.exports = IssueType;