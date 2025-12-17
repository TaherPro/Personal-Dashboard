import { StorageService } from "./storage.js";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category?: string;
  createdAt: string;
}

const STORAGE_KEY = "dashboard:bookmarks";

export class BookmarksManager {
  private root: HTMLElement;
  private form: HTMLFormElement;
  private titleInput: HTMLInputElement;
  private urlInput: HTMLInputElement;
  private categoryInput: HTMLInputElement;
  private list: HTMLUListElement;
  private summary: HTMLParagraphElement;

  private bookmarks: Bookmark[] = [];
  private urlSet: Set<string> = new Set(); // ensure unique URLs

  constructor(rootElement: HTMLElement) {
    this.root = rootElement;

    this.form = this.root.querySelector("[data-bookmark-form]") as HTMLFormElement;
    this.titleInput = this.root.querySelector("[data-bookmark-title]") as HTMLInputElement;
    this.urlInput = this.root.querySelector("[data-bookmark-url]") as HTMLInputElement;
    this.categoryInput = this.root.querySelector("[data-bookmark-category]") as HTMLInputElement;
    this.list = this.root.querySelector("[data-bookmark-list]") as HTMLUListElement;
    this.summary = this.root.querySelector("[data-bookmark-summary]") as HTMLParagraphElement;

    this.handleSubmit = this.handleSubmit.bind(this);

    this.init();
  }

  private init(): void {
    this.bookmarks = StorageService.load<Bookmark[]>(STORAGE_KEY, []);
    this.rebuildUrlSet();
    this.render();

    this.form.addEventListener("submit", this.handleSubmit);
  }

  private handleSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const title = this.titleInput.value.trim();
    const rawUrl = this.urlInput.value.trim();
    const category = this.categoryInput.value.trim() || undefined;

    if (!title || !rawUrl) return;

    const normalizedUrl = this.normalizeUrl(rawUrl);

    if (this.urlSet.has(normalizedUrl)) {
      alert("This URL is already saved as a bookmark.");
      return;
    }

    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      title,
      url: normalizedUrl,
      category,
      createdAt: new Date().toISOString(),
    };

    this.bookmarks = [newBookmark, ...this.bookmarks];

    this.titleInput.value = "";
    this.urlInput.value = "";
    this.categoryInput.value = "";

    this.sync();
  }

  private normalizeUrl(url: string): string {
    try {
      const u = new URL(url.startsWith("http") ? url : `https://${url}`);
      return u.href;
    } catch {
      // if invalid, just return original and hope it's OK
      return url;
    }
  }

  private rebuildUrlSet(): void {
    this.urlSet = new Set(this.bookmarks.map((b) => b.url));
  }

  private deleteBookmark(id: string): void {
    this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
    this.sync();
  }

  private sync(): void {
    this.rebuildUrlSet();
    StorageService.save(STORAGE_KEY, this.bookmarks);
    this.render();
  }

  private buildCategoryMap(): Map<string, number> {
    const categories = new Map<string, number>();

    for (const b of this.bookmarks) {
      if (!b.category) continue;
      const key = b.category.trim().toLowerCase();
      const current = categories.get(key) ?? 0;
      categories.set(key, current + 1);
    }

    return categories;
  }

  private renderSummary(): void {
    if (this.bookmarks.length === 0) {
      this.summary.textContent = "No bookmarks yet.";
      return;
    }

    const categories = this.buildCategoryMap();

    if (categories.size === 0) {
      this.summary.textContent = `Total bookmarks: ${this.bookmarks.length}`;
      return;
    }

    const parts: string[] = [];
    categories.forEach((count, name) => {
      parts.push(`${name} (${count})`);
    });

    this.summary.textContent = `Total: ${this.bookmarks.length} | Categories: ${parts.join(
      ", "
    )}`;
  }

  private render(): void {
    this.list.innerHTML = "";

    if (this.bookmarks.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No bookmarks saved yet.";
      empty.style.color = "#9ca3af";
      this.list.appendChild(empty);
      this.renderSummary();
      return;
    }

    this.bookmarks.forEach((bookmark) => {
      const li = document.createElement("li");

      const main = document.createElement("div");
      main.className = "bookmark-main";

      const titleEl = document.createElement("span");
      titleEl.className = "bookmark-title";
      titleEl.textContent = bookmark.title;

      const urlEl = document.createElement("a");
      urlEl.className = "bookmark-url";
      urlEl.href = bookmark.url;
      urlEl.target = "_blank";
      urlEl.rel = "noopener noreferrer";
      urlEl.textContent = bookmark.url;

      const metaEl = document.createElement("span");
      metaEl.className = "bookmark-meta";
      metaEl.textContent = bookmark.category
        ? `Category: ${bookmark.category}`
        : "No category";

      main.appendChild(titleEl);
      main.appendChild(urlEl);
      main.appendChild(metaEl);

      const del = document.createElement("button");
      del.className = "bookmark-delete";
      del.textContent = "X";
      del.title = "Delete bookmark";
      del.addEventListener("click", () => this.deleteBookmark(bookmark.id));

      li.appendChild(main);
      li.appendChild(del);

      this.list.appendChild(li);
    });

    this.renderSummary();
  }
}
