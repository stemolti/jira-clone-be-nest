export interface JiraProjectsResponse {
  maxResults: number
  nextPage: string
  startAt: number
  total: number
  values: JiraProject[]
}

export interface JiraProject {
  id: string
  name: string
  description: string

}