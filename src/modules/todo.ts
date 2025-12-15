import { StorageService } from "./storage.js";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "dashboard:todos";

export class TodoManager {
  private root: HTMLElement;
  private form: HTMLFormElement;
  private input: HTMLInputElement;
  private list: HTMLUListElement;
  private filterButtons: NodeListOf<HTMLButtonElement>;

  private todos: Todo[] = [];
  private currentFilter: "all" | "active" | "completed" = "all";

  constructor(rootElement: HTMLElement) {
    this.root = rootElement;

    this.form = this.root.querySelector("[data-todo-form]") as HTMLFormElement;
    this.input = this.root.querySelector("[data-todo-input]") as HTMLInputElement;
    this.list = this.root.querySelector("[data-todo-list]") as HTMLUListElement;
    this.filterButtons = this.root.querySelectorAll("[data-filter]");

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilter = this.handleFilter.bind(this);

    this.init();
  }

  private init(): void {
    this.todos = StorageService.load<Todo[]>(STORAGE_KEY, []);
    this.render();

    this.form.addEventListener("submit", this.handleSubmit);
    this.filterButtons.forEach((btn) =>
      btn.addEventListener("click", this.handleFilter)
    );
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const text = this.input.value.trim();
    if (!text) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };

    this.todos = [newTodo, ...this.todos];
    this.input.value = "";

    this.sync();
  }

  private toggleTodo(id: string): void {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.sync();
  }

  private deleteTodo(id: string): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.sync();
  }

  private handleFilter(event: Event): void {
    const btn = event.target as HTMLButtonElement;
    const filter = btn.dataset.filter as "all" | "active" | "completed";

    this.currentFilter = filter;

    this.filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    this.render();
  }

  private getFilteredTodos(): Todo[] {
    if (this.currentFilter === "active")
      return this.todos.filter((t) => !t.completed);
    if (this.currentFilter === "completed")
      return this.todos.filter((t) => t.completed);
    return this.todos;
  }

  private sync(): void {
    StorageService.save(STORAGE_KEY, this.todos);
    this.render();
  }

  private render(): void {
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

      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "X";
      del.addEventListener("click", () => this.deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(del);

      this.list.appendChild(li);
    });
  }
}
