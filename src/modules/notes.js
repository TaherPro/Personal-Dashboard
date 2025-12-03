
import { StorageService } from "./storage.js";

const STORAGE_KEY = "dashboard:notes";

export class NotesManager {
  constructor(rootElement) {
    this.root = rootElement;

    // Query DOM elements inside this widget
    this.form = this.root.querySelector("[data-note-form]");
    this.input = this.root.querySelector("[data-note-input]");
    this.list = this.root.querySelector("[data-notes-list]");

    // Internal state
    this.notes = [];

    // Bind handlers
    this.handleSubmit = this.handleSubmit.bind(this);

    // Init
    this.init();
  }

  init() {
    // Load notes from storage
    this.notes = StorageService.load(STORAGE_KEY, []);
    this.render();

    // Attach event listeners
    this.form.addEventListener("submit", this.handleSubmit);
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = this.input.value.trim();
    if (!text) return;

    const newNote = {
      id: crypto.randomUUID(), // ES2021, but widely supported
      text,
      createdAt: new Date().toISOString(),
    };

    // Use spread operator to create a new array
    this.notes = [newNote, ...this.notes];
    this.input.value = "";

    this.sync();
  }

  deleteNote(id) {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.sync();
  }

  sync() {
    // Save to localStorage and re-render
    StorageService.save(STORAGE_KEY, this.notes);
    this.render();
  }

  render() {
    // Clear existing list
    this.list.innerHTML = "";

    if (this.notes.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No notes yet. Add your first note!";
      empty.style.color = "#9ca3af";
      this.list.appendChild(empty);
      return;
    }

    // Create list items
    this.notes.forEach((note) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = note.text;

      const button = document.createElement("button");
      button.textContent = "X";
      button.title = "Delete note";

      button.addEventListener("click", () => {
        this.deleteNote(note.id);
      });

      li.appendChild(span);
      li.appendChild(button);
      this.list.appendChild(li);
    });
  }
}
