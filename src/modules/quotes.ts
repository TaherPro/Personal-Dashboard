// src/modules/quotes.ts

// API returns this shape
interface QuoteApi {
  content: string;
  author: string;
}

export class QuotesManager {
  private root: HTMLElement;
  private textEl: HTMLParagraphElement;
  private authorEl: HTMLParagraphElement;
  private button: HTMLButtonElement;

  constructor(rootElement: HTMLElement) {
    this.root = rootElement;

    this.textEl = this.root.querySelector("[data-quote-text]") as HTMLParagraphElement;
    this.authorEl = this.root.querySelector("[data-quote-author]") as HTMLParagraphElement;
    this.button = this.root.querySelector("[data-quote-btn]") as HTMLButtonElement;

    this.button.addEventListener("click", () => this.loadQuote());

    // Load a quote on start
    this.loadQuote();
  }

  /** Load quote from API with local fallback */
  private async loadQuote(): Promise<void> {
    this.textEl.textContent = "Loading...";
    this.authorEl.textContent = "";

    try {
      const quote = await this.fetchQuote();
      this.displayQuote(quote.content, quote.author);
    } catch {
      const fallback = this.getLocalFallbackQuote();
      this.displayQuote(fallback.content, fallback.author + " (local)");
    }
  }

  /** Fetch quote from a public API */
  private async fetchQuote(): Promise<QuoteApi> {
    const res = await fetch("https://api.quotable.io/random");

    if (!res.ok) {
      throw new Error("Failed to fetch quote");
    }

    const data: QuoteApi = await res.json();

    return data;
  }

  /** Local quotes in case API fails */
  private getLocalFallbackQuote(): QuoteApi {
    const localQuotes: QuoteApi[] = [
      { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
      { content: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
      { content: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
      { content: "Make it work, make it right, make it fast.", author: "Kent Beck" }
    ];

    const index = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[index];
  }

  /** Update UI */
  private displayQuote(text: string, author: string): void {
    this.textEl.textContent = `"${text}"`;
    this.authorEl.textContent = `— ${author}`;
  }
}
