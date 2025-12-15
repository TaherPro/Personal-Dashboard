import { StorageService } from "./storage.js";

interface Note {
  id: string;
  text: string;
  createdAt: string;
}

const STORAGE_KEY = "dashboard:notes";

export class NotesManager {
  private root: HTMLElement;
  private form: HTMLFormElement;
  private input: HTMLInputElement;
  private list: HTMLUListElement;
  private notes: Note[] = [];

  constructor(rootElement: HTMLElement) {
    this.root = rootElement;

    this.form = this.root.querySelector("[data-note-form]") as HTMLFormElement;
    this.input = this.root.querySelector("[data-note-input]") as HTMLInputElement;
    this.list = this.root.querySelector("[data-notes-list]") as HTMLUListElement;

    this.handleSubmit = this.handleSubmit.bind(this);

    this.init();
  }

  private init(): void {
    this.notes = StorageService.load<Note[]>(STORAGE_KEY, []);
    this.render();

    this.form.addEventListener("submit", this.handleSubmit);
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const text = this.input.value.trim();
    if (!text) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };

    this.notes = [newNote, ...this.notes];
    this.input.value = "";

    this.sync();
  }

  private deleteNote(id: string): void {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.sync();
  }

  private sync(): void {
    StorageService.save(STORAGE_KEY, this.notes);
    this.render();
  }

  private render(): void {
    this.list.innerHTML = "";

    if (this.notes.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No notes yet. Add your first note!";
      empty.style.color = "#9ca3af";
      this.list.appendChild(empty);
      return;
    }

    this.notes.forEach((note) => {
      const li = document.createElement("li");

      const text = document.createElement("span");
      text.textContent = note.text;

      const del = document.createElement("button");
      del.textContent = "X";
      del.addEventListener("click", () => this.deleteNote(note.id));

      li.appendChild(text);
      li.appendChild(del);

      this.list.appendChild(li);
    });
  }
}
