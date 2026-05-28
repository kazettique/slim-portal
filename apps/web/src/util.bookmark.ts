import { BookmarkPage, type Bookmark, type TransitBookmarkParam, type PlaceDetailBookmarkParam, type TransitRouteBookmarkParam } from "./type.bookmark";

export abstract class BookmarkUtil {
  private static readonly LS_KEY: string = "bookmarks";

  public static readonly BOOKMARK_PAGE_LABELS: Record<BookmarkPage, string> = {
    [BookmarkPage.TRANSIT]: "Transit",
    [BookmarkPage.PLACE]: "Places",
    [BookmarkPage.SEARCH]: "Search",
    [BookmarkPage.PLACE_DETAIL]: "Place Details",
    [BookmarkPage.TRANSIT_ROUTE]: "Saved Routes",
  };

  public static readonly PAGE_ORDER: BookmarkPage[] = [
    BookmarkPage.TRANSIT,
    BookmarkPage.TRANSIT_ROUTE,
    BookmarkPage.PLACE,
    BookmarkPage.PLACE_DETAIL,
    BookmarkPage.SEARCH,
  ];

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

  public static buildUrl(bookmark: Bookmark): string {
    if (bookmark.page === BookmarkPage.TRANSIT) {
      const p = bookmark.params as TransitBookmarkParam;
      const sp = new URLSearchParams({ from: p.from, to: p.to, from_name: p.from_name, to_name: p.to_name, restore: "1" });
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
      const p = bookmark.params as PlaceDetailBookmarkParam;
      if (!p.id) return "#";
      const sp = new URLSearchParams({ id: p.id });
      return `/place/detail?${sp.toString()}`;
    }
    const p = bookmark.params as { q: string };
    const sp = new URLSearchParams({ q: p.q, restore: "1" });
    return `/search?${sp.toString()}`;
  }

  public static getById(id: string): Bookmark | null {
    return BookmarkUtil.getAll().find((b) => b.id === id) ?? null;
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

  public static add(bookmark: Bookmark): void {
    try {
      const list = BookmarkUtil.getAll();
      list.unshift(bookmark);
      localStorage.setItem(this.LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public static delete(id: string): void {
    try {
      const list = BookmarkUtil.getAll().filter((b) => b.id !== id);
      localStorage.setItem(this.LS_KEY, JSON.stringify(list));
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

  public static deleteAll(): void {
    try {
      localStorage.removeItem(this.LS_KEY);
    } catch {
      // ignore
    }
  }
}
