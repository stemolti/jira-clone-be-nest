export interface JiraConfigIssueResponse {
  id: number
  name: string
  columnConfig: ColumnConfig
}

export interface ColumnConfig {
  columns: Column[]
}

export interface Column {
  name: string
  statuses: Status[]
}

export interface Status {
  id: string
}