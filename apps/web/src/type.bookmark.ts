export enum BookmarkPage {
  TRANSIT = "transit",
  PLACE = "place",
  SEARCH = "search",
}

export interface TransitBookmarkParam {
  from: string;
  to: string;
  from_name: string;
  to_name: string;
}

export interface PlaceBookmarkParam {
  q: string;
}

export interface SearchBookmarkParam {
  q: string;
}

export type BookmarkParam =
  | TransitBookmarkParam
  | PlaceBookmarkParam
  | SearchBookmarkParam;

export interface Bookmark {
  id: string;
  page: BookmarkPage;
  label: string;
  params: BookmarkParam;
  createdAt: string;
}
