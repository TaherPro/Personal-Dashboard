import { StorageService } from "./storage.js";
const STORAGE_KEY = "dashboard:notes";
export class NotesManager {
    constructor(rootElement) {
        this.notes = [];
        this.root = rootElement;
        this.form = this.root.querySelector("[data-note-form]");
        this.input = this.root.querySelector("[data-note-input]");
        this.list = this.root.querySelector("[data-notes-list]");
        this.handleSubmit = this.handleSubmit.bind(this);
        this.init();
    }
    init() {
        this.notes = StorageService.load(STORAGE_KEY, []);
        this.render();
        this.form.addEventListener("submit", this.handleSubmit);
    }
    handleSubmit(event) {
        event.preventDefault();
        const text = this.input.value.trim();
        if (!text)
            return;
        const newNote = {
            id: crypto.randomUUID(),
            text,
            createdAt: new Date().toISOString(),
        };
        this.notes = [newNote, ...this.notes];
        this.input.value = "";
        this.sync();
    }
    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id !== id);
        this.sync();
    }
    sync() {
        StorageService.save(STORAGE_KEY, this.notes);
        this.render();
    }
    render() {
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
