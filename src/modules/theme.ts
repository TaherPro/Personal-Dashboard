// src/modules/theme.ts

export enum Theme {
  Light = "light",
  Dark = "dark",
}

const STORAGE_KEY = "dashboard:theme";

export class ThemeManager {
  private root: HTMLElement;
  private button: HTMLButtonElement;
  private status: HTMLParagraphElement;
  private currentTheme: Theme;

  constructor(rootElement: HTMLElement) {
    this.root = rootElement;

    this.button = this.root.querySelector("[data-theme-toggle]") as HTMLButtonElement;
    this.status = this.root.querySelector("[data-theme-status]") as HTMLParagraphElement;

    this.currentTheme = this.loadTheme();

    this.applyTheme(this.currentTheme);
    this.updateStatus();

    this.button.addEventListener("click", () => this.toggleTheme());
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? Theme.Light;
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  private toggleTheme(): void {
    this.currentTheme =
      this.currentTheme === Theme.Light ? Theme.Dark : Theme.Light;

    this.applyTheme(this.currentTheme);
    this.saveTheme(this.currentTheme);
    this.updateStatus();
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute("data-theme", theme);
  }

  private updateStatus(): void {
    const label = this.currentTheme === Theme.Dark ? "Dark" : "Light";
    this.status.textContent = `Current theme: ${label}`;
  }
}
