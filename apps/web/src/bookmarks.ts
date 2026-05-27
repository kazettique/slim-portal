import type { Bookmark } from "./type";

const LS_KEY = "bookmarks";

export abstract class AppBookmarks {
  public static getAll(): Bookmark[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Bookmark[];
    } catch {
      return [];
    }
  }

  public static add(bookmark: Bookmark): void {
    try {
      const list = AppBookmarks.getAll();
      list.unshift(bookmark);
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public static delete(id: string): void {
    try {
      const list = AppBookmarks.getAll().filter((b) => b.id !== id);
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public static deleteMany(ids: string[]): void {
    try {
      const idSet = new Set(ids);
      const list = AppBookmarks.getAll().filter((b) => !idSet.has(b.id));
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public static deleteAll(): void {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }
}
