

export interface JiraIssuesResponse {
  issues: IJiraIssue[]
  startAt: number
  maxResults: number
  total: number
}

export interface IJiraIssue {
  id: string
  key: string
  fields: Fields
}

export interface Fields {
  sprint: Sprint
  closedSprints: ClosedSprint[]
  description: string
  project: IJiraProject
  comment: IJiraComment[]
  updated: number
}

export interface Sprint {
  id: number
  self: string
  state: string
  name: string
  goal: string
}

export interface ClosedSprint {
  id: number
  state: string
  name: string
  startDate: string
  endDate: string
  goal: string
}

export interface IJiraProject {
  id: string
  key: string
  name: string
}

export interface IJiraComment {
  author: Author
  body: Body
  id: string
}

export interface Author {
  accountId: string
  displayName: string
}

export interface Body {
  type: string
  content: Content[]
}

export interface Content {
  type: string
  content: ContentInner[]
}

export interface ContentInner {
  type: string
  text: string
}







