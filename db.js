import mysql from 'mysql2/promise';

let pool;

function createPool() {
  if (!process.env.MYSQL_HOST) {
    throw new Error('Missing MYSQL_HOST environment variable');
  }
  if (!process.env.MYSQL_USER) {
    throw new Error('Missing MYSQL_USER environment variable');
  }
  if (!process.env.MYSQL_PASSWORD) {
    throw new Error('Missing MYSQL_PASSWORD environment variable');
  }
  if (!process.env.MYSQL_DATABASE) {
    throw new Error('Missing MYSQL_DATABASE environment variable');
  }

  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

if (!pool) {
  pool = createPool();
}

export async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
