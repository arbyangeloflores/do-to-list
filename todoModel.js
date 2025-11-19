import { query } from '../lib/db';

export async function getAllTodos() {
  const sql = 'SELECT id, title, completed FROM todos ORDER BY id ASC';
  return await query(sql);
}

export async function getTodoById(id) {
  const sql = 'SELECT id, title, completed FROM todos WHERE id = ? LIMIT 1';
  const results = await query(sql, [id]);
  return results.length > 0 ? results[0] : null;
}

export async function createTodo(title) {
  const sql = 'INSERT INTO todos (title, completed) VALUES (?, FALSE)';
  const result = await query(sql, [title]);
  return getTodoById(result.insertId);
}

export async function updateTodo(id, fields) {
  const allowedFields = ['title', 'completed'];
  const setClauses = [];
  const values = [];

  for (const key of allowedFields) {
    if (key in fields) {
      setClauses.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (setClauses.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(id);

  const sql = `UPDATE todos SET ${setClauses.join(', ')} WHERE id = ?`;
  const result = await query(sql, values);
  if (result.affectedRows === 0) {
    return null;
  }
  return getTodoById(id);
}

export async function deleteTodo(id) {
  const sql = 'DELETE FROM todos WHERE id = ?';
  const result = await query(sql, [id]);
  return result.affectedRows > 0;
}
