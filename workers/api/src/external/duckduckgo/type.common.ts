export interface DdgSublink {
  snippet: string;
  targetUrl: string;
  text: string;
}

export interface DdgResult {
  position: number;
  url: string;
  title: string;
  description: string;
  description_html: string;
  types: string;
  host: string;
  sublinks: DdgSublink[];
}
