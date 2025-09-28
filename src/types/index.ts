// Represents the links for a launch
export interface LaunchLinks {
  flickr?: { original: string[] };
  wikipedia?: string;
  article?: string;
  patch?: {
    small: string | null;
    large: string | null;
  };
  webcast?: string | null;
}

// Represents a core for the launch
export interface Core {
  reused?: boolean;
}

// Represents a launch
export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  details: string | null;
  
  flight_number?: number;
  upcoming?: boolean;
  cores?: Core[];
  rocket?: string;
  launchpad?: string;
  payloads?: string[];
  
  links?: LaunchLinks;
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
