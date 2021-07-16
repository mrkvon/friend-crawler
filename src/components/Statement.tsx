import React from 'react'
import { GraphNode } from '../hooks/graph'
import Math from './Math'

interface Props {
  node: GraphNode
  onSelectNode: (uri: string) => void
}

const Statement = ({ node, onSelectNode }: Props) => {
  const dependencies: GraphNode[] = Object.values(node.dependsOn)
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        top: '0',
        bottom: 0,
        pointerEvents: 'none',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div className="columns mr-1 mt-6">
        <div className="column is-one-quarter is-offset-three-quarters">
          <div
            className="card"
            style={{ pointerEvents: 'all', overflowX: 'auto', width: '100%' }}
          >
            <header className="card-header">
              <p className="card-header-title">{node.label}</p>
            </header>
            <section className="card-content">
              <Math>{node.description}</Math>
            </section>
            <header className="card-header">
              <p className="card-header-title">
                dependencies: {dependencies.length}
              </p>
            </header>
            <section className="card-content">
              <ul className="buttons are-small">
                {dependencies.map(dependency => (
                  <li
                    onClick={() => onSelectNode(dependency.uri)}
                    key={dependency.uri}
                    className="button is-link is-inverted"
                  >
                    {dependency.label}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statement
