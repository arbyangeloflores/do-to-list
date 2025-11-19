import { getAllTodos, createTodo } from '../../../models/todoModel';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const todos = await getAllTodos();
      res.status(200).json(todos);
    } else if (req.method === 'POST') {
      const { title } = req.body;
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'Invalid or missing title' });
      }
      const newTodo = await createTodo(title.trim());
      res.status(201).json(newTodo);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API /todos error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
