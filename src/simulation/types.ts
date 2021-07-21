export type Uri = string

export interface Access {
  [role: string]: string[]
}

export interface Statement {
  uri: Uri
  doc: Uri
  label: string
  description?: string
}

export interface StatementWithAccess extends Statement {
  access: Access
}

export interface Dependency {
  dependent: Uri
  dependency: Uri
  doc: Uri
}

export interface Document {
  uri: Uri
  access: Access
}

export interface DependencyExtended {
  dependent: StatementWithAccess
  dependency: StatementWithAccess
  doc: Document
}

export interface Node {
  label: string
  uri: Uri
  r: number
}

export interface Coords {
  x: number
  y: number
}

export interface SimulationNode extends Node, Coords {}

export interface SimulationLink {
  source: Uri
  target: Uri
}

export interface Dict<T> {
  [key: string]: T
}
