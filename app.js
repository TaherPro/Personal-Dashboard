import { NotesManager } from "./src/modules/notes.js";

document.addEventListener("DOMContentLoaded", () => {
  const notesWidget = document.getElementById("notes-widget");

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