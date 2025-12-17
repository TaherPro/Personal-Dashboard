import { NotesManager } from "./modules/notes.js";
import { TodoManager } from "./modules/todo.js";
import { BookmarksManager } from "./modules/bookmarks.js";
import { QuotesManager } from "./modules/quotes.js";
document.addEventListener("DOMContentLoaded", () => {
    const notesWidget = document.getElementById("notes-widget");
    const todoWidget = document.getElementById("todo-widget");
    const bookmarksWidget = document.getElementById("bookmarks-widget");
    const quotesWidget = document.getElementById("quotes-widget");
    new NotesManager(notesWidget);
    new TodoManager(todoWidget);
    new BookmarksManager(bookmarksWidget);
    new QuotesManager(quotesWidget);
});
