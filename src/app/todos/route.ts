import { NextResponse } from "next/server";
import todosData from "../../../todos.json";
import { readFile, writeFile } from "node:fs/promises";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const todos: Todo[] = todosData;

/** GET all data
 * 1. read file from db
 * 2. send as a response
 */
export async function GET() {
  const todosJson = await readFile("./todos.json", "utf-8");
  const todos = JSON.parse(todosJson);
  return NextResponse.json(todos);
}

/**
 * 1. grab data from request
 * 2. process data which will be added to the db
 * 3. add to db
 * 4. send a 201 response if successfull *
 */
export async function POST(request: Request) {
  const todo = await request.json();
  const newTodo = {
    id: crypto.randomUUID(),
    text: todo.text,
    completed: false,
  };
  todos.push(newTodo);
  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return NextResponse.json(newTodo, { status: 201 });
}
