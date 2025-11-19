import React, { useState, useEffect, useRef } from 'react';

export default function TodoList({ todos, onToggleComplete, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const submitEdit = () => {
    if (!editTitle.trim()) {
      alert('To-Do title cannot be empty.');
      return;
    }
    if (onEdit) {
      onEdit(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <ul className="mt-6 w-full max-w-xl bg-white dark:bg-gray-800 rounded shadow divide-y divide-gray-200 dark:divide-gray-700">
      {todos.map(({ id, title, completed }) => (
        <li
          key={id}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div className="flex items-center space-x-3">
            <input
              id={`todo-checkbox-${id}`}
              type="checkbox"
              checked={completed}
              onChange={() => onToggleComplete(id, !completed)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label={`Mark To-Do "${title}" as ${completed ? 'incomplete' : 'complete'}`}
            />
            {editingId === id ? (
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={submitEdit}
                onKeyDown={handleKeyDown}
                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Edit To-Do title"
              />
            ) : (
              <label
                htmlFor={`todo-checkbox-${id}`}
                className={`cursor-pointer select-none ${
                  completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
                }`}
              >
                {title}
              </label>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {editingId !== id && (
              <button
                type="button"
                onClick={() => startEditing(id, title)}
                aria-label={`Edit To-Do "${title}"`}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                title="Edit To-Do"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5h6M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(id)}
              aria-label={`Delete To-Do "${title}"`}
              className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              title="Delete To-Do"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
