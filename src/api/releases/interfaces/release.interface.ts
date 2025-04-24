export interface IRelease {
  releaseId: string;
  projectId: number;
  name: string;
  description: string;
  releaseDate: string;
  released: boolean;
  archived: boolean;
}
