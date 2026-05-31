import type { PlaceDetails, TransitRoute } from "@slim-portal/share";

export enum BookmarkPage {
  PLACE = "place",
  PLACE_DETAIL = "place_detail",
  SEARCH = "search",
  TRANSIT = "transit",
  TRANSIT_ROUTE = "transit_route",
}

export interface Bookmark {
  createdAt: string;
  id: string;
  label: string;
  page: BookmarkPage;
  params: BookmarkParam;
}

export type BookmarkParam =
  | PlaceBookmarkParam
  | PlaceDetailBookmarkParam
  | SearchBookmarkParam
  | TransitBookmarkParam
  | TransitRouteBookmarkParam;

export interface PlaceBookmarkParam {
  q: string;
}

export type PlaceDetailBookmarkParam = PlaceDetails;

export interface SearchBookmarkParam {
  q: string;
}

export interface TransitBookmarkParam {
  from: string;
  from_name: string;
  to: string;
  to_name: string;
}

export interface TransitRouteBookmarkParam {
  from: string;
  from_name: string;
  route: TransitRoute;
  to: string;
  to_name: string;
}
