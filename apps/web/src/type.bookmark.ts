import type { PlaceDetails, TransitRoute } from "@slim-portal/share";

export enum BookmarkPage {
  TRANSIT = "transit",
  PLACE = "place",
  SEARCH = "search",
  PLACE_DETAIL = "place_detail",
  TRANSIT_ROUTE = "transit_route",
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

export type PlaceDetailBookmarkParam = PlaceDetails;

export interface TransitRouteBookmarkParam {
  from: string;
  to: string;
  from_name: string;
  to_name: string;
  route: TransitRoute;
}

export type BookmarkParam =
  | TransitBookmarkParam
  | PlaceBookmarkParam
  | SearchBookmarkParam
  | PlaceDetailBookmarkParam
  | TransitRouteBookmarkParam;

export interface Bookmark {
  id: string;
  page: BookmarkPage;
  label: string;
  params: BookmarkParam;
  createdAt: string;
}
