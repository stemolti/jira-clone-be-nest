export interface JiraSprintsResponse {
  isLast: boolean
  maxResults: number
  startAt: number
  total: number
  values: JiraSprint[]
}

export interface JiraSprint {
  id: number
  self: string
  state: string
  name: string
  startDate?: string
  endDate?: string
  completeDate?: string
  originBoardId?: number
  goal: string
}