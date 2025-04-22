export interface JiraReleasesResponse {
  isLast: boolean;
  maxResults: number;
  nextPage: string;
  startAt: number;
  total: number;
  values: IJiraRelease[];
}

export interface IJiraRelease {
  description: string;
  id: string;
  name: string;
  projectId: number;
  releaseDate?: string;
  released: boolean;
}
