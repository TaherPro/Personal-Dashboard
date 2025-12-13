// src/modules/todo.js
import { StorageService } from "./storage.js";

const STORAGE_KEY = "dashboard:todos";

export class TodoManager {
  constructor(rootElement) {
    this.root = rootElement;

    this.form = this.root.querySelector("[data-todo-form]");
    this.input = this.root.querySelector("[data-todo-input]");
    this.list = this.root.querySelector("[data-todo-list]");
    this.filterButtons = this.root.querySelectorAll("[data-filter]");

    this.todos = [];

    // Bind methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilter = this.handleFilter.bind(this);

    this.currentFilter = "all";

    this.init();
  }

  init() {
    this.todos = StorageService.load(STORAGE_KEY, []);
    this.render();

    this.form.addEventListener("submit", this.handleSubmit);

    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", this.handleFilter);
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const text = this.input.value.trim();
    if (!text) return;

    const newTodo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };

    this.todos = [newTodo, ...this.todos];
    this.input.value = "";

    this.sync();
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    this.sync();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.sync();
  }

  handleFilter(event) {
    const filter = event.target.dataset.filter;
    this.currentFilter = filter;

    // Toggle active class
    this.filterButtons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    this.render();
  }

  getFilteredTodos() {
    const f = this.currentFilter;

    if (f === "active") return this.todos.filter((t) => !t.completed);
    if (f === "completed") return this.todos.filter((t) => t.completed);
    return this.todos; // all
  }

  sync() {
    StorageService.save(STORAGE_KEY, this.todos);
    this.render();
  }

  render() {
    this.list.innerHTML = "";

    const items = this.getFilteredTodos();

    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No tasks found.";
      empty.style.color = "#9ca3af";
      this.list.appendChild(empty);
      return;
    }

    items.forEach((todo) => {
      const li = document.createElement("li");
      li.className = todo.completed ? "completed" : "";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => this.toggleTodo(todo.id));

      const text = document.createElement("span");
      text.className = "text";
      text.textContent = todo.text;

      const btn = document.createElement("button");
      btn.className = "delete";
      btn.textContent = "X";
      btn.addEventListener("click", () => this.deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(btn);

      this.list.appendChild(li);
    });
  }
}
