export interface JiraIssuesResponse {
  expand: string
  startAt: number
  maxResults: number
  total: number
  issues: IJiraIssue[]
}

export interface IJiraIssue {
  expand: string
  id: string
  self: string
  key: string
  fields: Fields
}

export interface Fields {
  parent?: Parent
  assignee?: Assignee
  status: StatusInner
  sprint: any
  project: Project
  description?: Description
}

export interface Parent {
  id: string
  key: string
  self: string
  fields: FieldsInner
}

export interface Assignee {
  accountId: string
  displayName: string
  accountType: string
}

export interface Description {
  type: string
  version: number
  content: Content[]
}     

export interface Content {
  type: string
  content?: ContentInner[]
}

export interface ContentInner {
  type: string
  text?: string
}

export interface FieldsInner {
  summary: string
  status: Status
  priority: Priority
  issuetype: Issuetype
}

export interface Status {
  self: string
  description: string
  iconUrl: string
  name: string
  id: string
}

export interface Priority {
  self: string
  iconUrl: string
  name: string
  id: string
}

export interface Issuetype {
  id: string
  description: string
  name: string
}

export interface StatusInner {
  description: string
  name: string
  id: string
}


export interface Project {
  id: string
  key: string
  name: string
  projectTypeKey: string
}






