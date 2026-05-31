export interface DdgResult {
  description: string;
  description_html: string;
  host: string;
  position: number;
  sublinks: DdgSublink[];
  title: string;
  types: string;
  url: string;
}

export interface DdgSublink {
  snippet: string;
  targetUrl: string;
  text: string;
}
