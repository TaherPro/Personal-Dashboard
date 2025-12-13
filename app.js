import { NotesManager } from "./src/modules/notes.js";
import { TodoManger } from "./modules/todo.js";

document.addEventListener("DOMContentLoaded", () => {
  const notesWidget = document.getElementById("notes-widget");
  const todoWidget = document.getElementById("todo-widget");
  new TodoManager(todoWidget);


  if (!notesWidget) {
    console.error("Notes widget container not found!");
    return;
  }

  // Initialize the NotesManager
  const notesManager = new NotesManager(notesWidget);

  // Just to show we can use it later if needed
  window.dashboard = {
    notesManager,
  };
});