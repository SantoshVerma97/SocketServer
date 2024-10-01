const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gets',
  password: 'root',
  port: 5432, // default PostgreSQL port
});

// Connect to the database
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });

module.exports = client;