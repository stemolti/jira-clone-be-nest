
export interface JiraBoardsResponse {
  isLast: boolean
  maxResults: number
  startAt: number
  total: number
  values: IJiraBoard[]
}

export interface IJiraBoard {
  id: number
  name: string
}
