export interface JiraReleasesResponse {
  isLast: boolean;
  maxResults: number;
  nextPage: string;
  startAt: number;
  total: number;
  values: IJiraRelease[];
}

export interface IJiraRelease {
  id: string;
  projectId: number;
  name: string;
  description: string;
  releaseDate?: string;
  released: boolean;
  archived: boolean;
}


