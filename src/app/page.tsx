"use client";

import { useEffect, useState } from "react";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

// define the todo interface
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { theme = "dark", setTheme } = useTheme();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("/todos");
    const data = await response.json();
    setTodos(data.reverse());
  };

  // Add new todo
  const addTodo = async (text: string): Promise<void> => {
    const response = await fetch("/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    const newTodo = await response.json();
    setTodos([newTodo, ...todos]);
  };

  // Delete todo
  const deleteTodo = async (id: string): Promise<void> => {
    const response = await fetch(`/todos/${id}`, { method: "DELETE" });
    if (response.status === 204) {
      fetchTodos();
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string): Promise<void> => {
    const todo: Todo | undefined = todos?.find((todo) => todo?.id === id);
    const response = await fetch(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !todo?.completed }),
    });
    if (response.status === 201) {
      fetchTodos();
    }
  };

  // Update todo text
  const updateTodo = async (id: string, newText: string): Promise<void> => {
    const response = await fetch(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ text: newText }),
    });
    if (response.status === 201) {
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen w-full max-w-lg mx-auto py-8 px-4 sm:px-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Todo App
        </h1>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </header>

      <TodoForm addTodo={addTodo} />

      <main className="mt-6">
        <TodoList
          todos={todos}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          updateTodo={updateTodo}
        />
      </main>
    </div>
  );
}
