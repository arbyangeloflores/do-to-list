import React, { useState } from 'react';

export default function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a valid To-Do title.');
      return;
    }
    if (onSubmit) {
      onSubmit(title.trim());
    }
    setTitle('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl flex space-x-2"
      aria-label="Add new To-Do"
    >
      <input
        type="text"
        className="flex-grow px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        placeholder="Enter new To-Do"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="To-Do title"
        autoComplete="off"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Add To-Do"
      >
        Add
      </button>
    </form>
  );
}
