export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  details: string | null;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    webcast: string | null;
  };
}


// Represents each entry returned by the Public APIs API
export interface ApiEntry {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}

// Represents the whole API response
export interface ApiResponse {
  count: number;
  entries: ApiEntry[];
}