const { Pool } = require('pg');

const pool = new Pool({
  host: 'database-1.cdupbk1btgjg.ap-south-1.rds.amazonaws.com',
  user: 'claim_user',
  password: 'Claim_User@2024',
  database: 'claim_demo',
  port: 5432,
});

module.exports = pool;