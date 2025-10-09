import { NextResponse } from "next/server";
import todoList from "../../../../todos.json";
import { writeFile } from "node:fs/promises";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const todos: Todo[] = todoList;

interface Params {
  id: string;
}

/** GET one data
 * 1. grab id from params
 * 2. find the data from db
 * 3. if not found then send a error response
 * 4. if found, then send the data
 */
export async function GET(_: Request, { params }: { params: Params }) {
  const { id } = await params;

  const todo = todos?.find((todo) => todo?.id === id);

  if (!todo) {
    return NextResponse.json({ error: "Not Found!" }, { status: 404 });
  }

  return NextResponse.json(todo);
}

/**
 * 1. grab data & id from request
 * 2. find the data which is to be changed from db
 * 3. change the data with updated one
 * 4. send response
 * */
export async function PUT(request: Request, { params }: { params: Params }) {
  const editedTodoData = await request.json();

  if (editedTodoData?.id) {
    return NextResponse.json({ error: "Invalid request!" }, { status: 403 });
  }

  const { id } = await params;
  const todoId = todos.findIndex((todo) => todo?.id === id);
  const prevTodo = todos[todoId];
  const editedTodo = { ...prevTodo, ...editedTodoData };
  todos[todoId] = editedTodo;

  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return NextResponse.json(editedTodo, { status: 201 });
}

/**
 * 1. grab id from params
 * 2. find the data which is to be deleted from db
 * 3. delete it from db
 * 4. send response
 * */
export async function DELETE(_: Request, { params }: { params: Params }) {
  const { id } = await params;
  const deletedId = todos.findIndex((todo) => todo?.id === id);
  todos.splice(deletedId, 1);
  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return new NextResponse(null, { status: 204 });
}
