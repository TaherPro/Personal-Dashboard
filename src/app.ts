import { NotesManager } from "./modules/notes.js";
import { TodoManager } from "./modules/todo.js";

document.addEventListener("DOMContentLoaded", () => {
  const notesWidget = document.getElementById("notes-widget")!;
  const todoWidget = document.getElementById("todo-widget")!;

  new NotesManager(notesWidget);
  new TodoManager(todoWidget);
});
