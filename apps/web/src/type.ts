export interface PageMeta {
  title: string;
  description: string;
  url: string;
}

export enum BookmarkPage {
  TRANSIT = "transit",
  PLACES = "places",
  SEARCH = "search",
}

export interface TransitBookmarkParams {
  from: string;
  to: string;
  from_name: string;
  to_name: string;
}

export interface PlacesBookmarkParams {
  q: string;
}

export interface SearchBookmarkParams {
  q: string;
}

export type BookmarkParams =
  | TransitBookmarkParams
  | PlacesBookmarkParams
  | SearchBookmarkParams;

export interface Bookmark {
  id: string;
  page: BookmarkPage;
  label: string;
  params: BookmarkParams;
  createdAt: string;
}
