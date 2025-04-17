export interface Release {
  releaseId: string;
  projectId: string;
  name: string;
  status: string;
  releaseDate: Date;
  description?: string;
}
