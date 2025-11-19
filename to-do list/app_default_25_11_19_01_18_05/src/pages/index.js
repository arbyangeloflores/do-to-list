import React, { useEffect, useState } from 'react';
import TodoList from '../components/TodoList';
import TodoForm from '../components/TodoForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/todos`);
        if (!res.ok) {
          throw new Error(`Failed to fetch todos: ${res.statusText}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Add new todo handler
  const handleAddTodo = async (title) => {
    if (!title || !title.trim()) {
      alert('Please enter a valid To-Do title.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create To-Do');
      }
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      alert(`Error adding To-Do: ${err.message}`);
    }
  };

  // Toggle completion status
  const handleToggleComplete = async (id, completed) => {
    try {
      const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update To-Do');
      }
      const updatedTodo = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      alert(`Error updating To-Do: ${err.message}`);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this To-Do?')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete To-Do');
      }
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      alert(`Error deleting To-Do: ${err.message}`);
    }
  };

  // Edit todo title
  const handleEdit = async (id, title) => {
    if (!title || !title.trim()) {
      alert('To-Do title cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update To-Do');
      }
      const updatedTodo = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      alert(`Error updating To-Do: ${err.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Next.js MySQL To-Do List</h1>
      <TodoForm onSubmit={handleAddTodo} />
      {loading ? (
        <p className="mt-4">Loading To-Do items...</p>
      ) : error ? (
        <p className="mt-4 text-red-600">Error: {error}</p>
      ) : todos.length === 0 ? (
        <p className="mt-4 text-gray-500">No To-Do items found.</p>
      ) : (
        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </main>
  );
}
