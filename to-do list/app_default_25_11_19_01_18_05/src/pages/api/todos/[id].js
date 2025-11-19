import {
  getTodoById,
  updateTodo,
  deleteTodo,
} from '../../../models/todoModel';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const todoId = parseInt(id, 10);
  if (Number.isNaN(todoId) || todoId <= 0) {
    return res.status(400).json({ message: 'Invalid To-Do ID' });
  }

  try {
    if (method === 'GET') {
      const todo = await getTodoById(todoId);
      if (!todo) {
        return res.status(404).json({ message: 'To-Do not found' });
      }
      return res.status(200).json(todo);
    } else if (method === 'PUT') {
      const { title, completed } = req.body;

      const fieldsToUpdate = {};

      if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
          return res.status(400).json({ message: 'Invalid title' });
        }
        fieldsToUpdate.title = title.trim();
      }

      if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
          return res.status(400).json({ message: 'Invalid completed status' });
        }
        fieldsToUpdate.completed = completed;
      }

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res
          .status(400)
          .json({ message: 'No valid fields provided for update' });
      }

      const updatedTodo = await updateTodo(todoId, fieldsToUpdate);
      if (!updatedTodo) {
        return res.status(404).json({ message: 'To-Do not found' });
      }
      return res.status(200).json(updatedTodo);
    } else if (method === 'DELETE') {
      const deleted = await deleteTodo(todoId);
      if (!deleted) {
        return res.status(404).json({ message: 'To-Do not found' });
      }
      return res.status(204).end();
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error(`API /todos/${id} error:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
