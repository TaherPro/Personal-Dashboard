// src/modules/theme.ts
export var Theme;
(function (Theme) {
    Theme["Light"] = "light";
    Theme["Dark"] = "dark";
})(Theme || (Theme = {}));
const STORAGE_KEY = "dashboard:theme";
export class ThemeManager {
    constructor(rootElement) {
        this.root = rootElement;
        this.button = this.root.querySelector("[data-theme-toggle]");
        this.status = this.root.querySelector("[data-theme-status]");
        this.currentTheme = this.loadTheme();
        this.applyTheme(this.currentTheme);
        this.updateStatus();
        this.button.addEventListener("click", () => this.toggleTheme());
    }
    loadTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ?? Theme.Light;
    }
    saveTheme(theme) {
        localStorage.setItem(STORAGE_KEY, theme);
    }
    toggleTheme() {
        this.currentTheme =
            this.currentTheme === Theme.Light ? Theme.Dark : Theme.Light;
        this.applyTheme(this.currentTheme);
        this.saveTheme(this.currentTheme);
        this.updateStatus();
    }
    applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
    }
    updateStatus() {
        const label = this.currentTheme === Theme.Dark ? "Dark" : "Light";
        this.status.textContent = `Current theme: ${label}`;
    }
}
