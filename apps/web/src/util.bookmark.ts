import { type Bookmark, BookmarkPage, type TransitBookmarkParam } from "./type.bookmark";

export abstract class BookmarkUtil {
  public static readonly BOOKMARK_PAGE_LABELS: Record<BookmarkPage, string> = {
    [BookmarkPage.PLACE]: "Places",
    [BookmarkPage.PLACE_DETAIL]: "Place Details",
    [BookmarkPage.SEARCH]: "Search",
    [BookmarkPage.TRANSIT]: "Transit",
    [BookmarkPage.TRANSIT_ROUTE]: "Saved Routes",
  };

  public static readonly QUERY_PAGES: BookmarkPage[] = [
    BookmarkPage.TRANSIT,
    BookmarkPage.PLACE,
    BookmarkPage.SEARCH,
  ];

  public static readonly SNAPSHOT_PAGES: BookmarkPage[] = [
    BookmarkPage.TRANSIT_ROUTE,
    BookmarkPage.PLACE_DETAIL,
  ];

  public static readonly CATEGORIES: Array<{ label: string; pages: BookmarkPage[] }> = [
    { label: "Searches", pages: this.QUERY_PAGES },
    { label: "Snapshots", pages: this.SNAPSHOT_PAGES },
  ];

  public static readonly PAGE_ORDER: BookmarkPage[] = [
    BookmarkPage.TRANSIT,
    BookmarkPage.TRANSIT_ROUTE,
    BookmarkPage.PLACE,
    BookmarkPage.PLACE_DETAIL,
    BookmarkPage.SEARCH,
  ];

  private static readonly LS_KEY: string = "bookmarks";

  public static add(bookmark: Bookmark): void {
    try {
      const list = BookmarkUtil.getAll();
      list.unshift(bookmark);
      localStorage.setItem(this.LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public static buildUrl(bookmark: Bookmark): string {
    if (bookmark.page === BookmarkPage.TRANSIT) {
      const p = bookmark.params as TransitBookmarkParam;
      const sp = new URLSearchParams({
        from: p.from,
        from_name: p.from_name,
        restore: "1",
        to: p.to,
        to_name: p.to_name,
      });
      return `/transit?${sp.toString()}`;
    }
    if (bookmark.page === BookmarkPage.TRANSIT_ROUTE) {
      return `/transit/detail?id=${encodeURIComponent(bookmark.id)}`;
    }
    if (bookmark.page === BookmarkPage.PLACE) {
      const p = bookmark.params as { q: string };
      const sp = new URLSearchParams({ q: p.q, restore: "1" });
      return `/place?${sp.toString()}`;
    }
    if (bookmark.page === BookmarkPage.PLACE_DETAIL) {
      return `/place/detail?snapshot=${encodeURIComponent(bookmark.id)}`;
    }
    const p = bookmark.params as { q: string };
    const sp = new URLSearchParams({ q: p.q, restore: "1" });
    return `/search?${sp.toString()}`;
  }

  public static delete(id: string): void {
    try {
      const list = BookmarkUtil.getAll().filter((b) => b.id !== id);
      localStorage.setItem(this.LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public static deleteAll(): void {
    try {
      localStorage.removeItem(this.LS_KEY);
    } catch {
      // ignore
    }
  }

  public static deleteMany(ids: string[]): void {
    try {
      const idSet = new Set(ids);
      const list = BookmarkUtil.getAll().filter((b) => !idSet.has(b.id));
      localStorage.setItem(this.LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public static getAll(): Bookmark[] {
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Bookmark[];
    } catch {
      return [];
    }
  }

  public static getById(id: string): Bookmark | null {
    return BookmarkUtil.getAll().find((b) => b.id === id) ?? null;
  }
}
