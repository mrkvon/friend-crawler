import React, { useEffect, useState, useContext } from 'react'
import Visualization from './Visualization'
import Simulation, { SimulationLinkExt } from '../simulation'
import { SimulationNode, SimulationLink } from '../simulation/types'
import { Vector } from '../helpers/draw'
import { Grid } from '../helpers/draw'
import numeric from 'numeric'
import PersonCard from './PersonCard'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { PeopleContext, Person } from './DataContainer'
import { IriString } from '@inrupt/solid-client'
import { Helmet } from 'react-helmet'

type PeopleGraph = {
  [uri: string]: Person
}

const transform = (matrix: number[][], vector: Vector): Vector => {
  const raw = numeric.dot(
    matrix,
    numeric.transpose([[...vector, 1]]),
  ) as number[][]
  const [[x], [y]] = raw
  return [x, y]
}

type VisualizationNode = {
  x: number
  y: number
  uri: string
  label: string
  style: string
  r: number
}

type VisualizationLink = {
  source: VisualizationNode
  target: VisualizationNode
}

export type VisualizationGraph = {
  nodes: VisualizationNode[]
  links: VisualizationLink[]
}

interface SimulationGraph {
  nodes: SimulationNode[]
  links: SimulationLinkExt[]
}

const basicGrid: Grid = {
  origin: [0, 0],
  distance: 20,
  highlight: 5,
}

const transformGrid = (matrix: number[][], grid: Grid): Grid => {
  let distance = grid.distance * matrix[0][0]
  while (distance < 20) {
    distance *= 5
  }
  return {
    origin: transform(matrix, grid.origin),
    distance,
    highlight: grid.highlight,
  }
}

const transformLayout = (
  matrix: number[][],
  graph: SimulationGraph,
  people: PeopleGraph,
  highlighted: string | undefined,
  selected: string | undefined,
  selectedDependencies: string[],
): VisualizationGraph => {
  const transformedNodesDict = Object.fromEntries(
    graph.nodes.map(node => {
      const [x, y] = transform(matrix, [node.x, node.y])
      const r = matrix[0][0] * node.r
      const status = people[node.uri]?.status ?? ''
      const style =
        status === 'success' ? 'success' : status === 'error' ? 'error' : ''
      return [
        node.uri,
        {
          ...node,
          x,
          y,
          r,
          style,
          label: people[node.uri]?.name ?? '',
        },
      ]
    }),
  )

  if (highlighted && transformedNodesDict[highlighted]) {
    transformedNodesDict[highlighted].style = 'accent'
  }

  selectedDependencies.forEach(uri => {
    if (transformedNodesDict[uri]) transformedNodesDict[uri].style = 'accent'
  })

  if (selected && transformedNodesDict[selected]) {
    transformedNodesDict[selected].style = 'focus'
  }

  const links = graph.links.map(link => {
    const sourceUri =
      typeof link.source === 'string'
        ? link.source
        : typeof link.source === 'number'
        ? graph.nodes[link.source].uri
        : link.source.uri
    const targetUri =
      typeof link.target === 'string'
        ? link.target
        : typeof link.target === 'number'
        ? graph.nodes[link.target].uri
        : link.target.uri
    const source = transformedNodesDict[sourceUri]
    const target = transformedNodesDict[targetUri]
    return { source, target }
  })

  return { nodes: Object.values(transformedNodesDict), links }
}

function nodeRadius(person: Person) {
  let count = person.known?.size ?? 0
  count = count < 1 ? 1 : count
  return count ** 0.42 * 5
}

const selectNodeDependencies = (
  selectedNodeUri: string | undefined,
  graph: PeopleGraph,
): string[] => {
  if (!selectedNodeUri) return []
  return Array.from(graph?.[selectedNodeUri]?.knows ?? new Set())
}

const VisualizationContainer: React.FC<RouteComponentProps> = ({
  location,
  history,
  ...props
}: RouteComponentProps) => {
  const [simulation] = useState(new Simulation())

  const [layout, setLayout] = useState<SimulationGraph>({
    nodes: [],
    links: [],
  })

  const [highlightedNode, setHighlightedNode] = useState<string | undefined>()

  const people = useContext(PeopleContext)

  // transformation matrix
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])

  // initialize simulation
  useEffect(() => {
    let lastUpdate = Date.now() - 20
    simulation.start({
      nodes: [],
      links: [],
      onTick: ({ nodes, links }) => {
        const now = Date.now()
        if (now > lastUpdate + 20) {
          setLayout({ nodes: [...nodes], links: [...links] })
          lastUpdate = now
        }
      },
    })
    return () => {
      simulation.stop()
    }
  }, [simulation])

  // when graph changes, update simulation
  useEffect(() => {
    const nodes = Object.values(people).map(node => ({
      label: node.name,
      uri: node.uri,
      r: nodeRadius(node),
    }))

    const links = Object.values(people).reduce(
      (nodes, { uri: source, knows }) => {
        knows.forEach(target => nodes.push({ source, target }))
        return nodes
      },
      [] as SimulationLink[],
    )

    simulation.update({ nodes, links })
  }, [people, simulation])

  const handleTransform = (matrix: number[][]): void => {
    setMatrix(prevMatrix => numeric.dot(matrix, prevMatrix) as number[][])
  }

  const withNode = (action: (uri: string) => unknown) => {
    return (position: Vector): void => {
      // first transform to local coordinates
      const [x, y] = transform(numeric.inv(matrix), position)
      // then find the node in simulation
      action(simulation.selectNode({ x, y })?.uri)
    }
  }

  const handleHover = withNode(setHighlightedNode)
  const selectNode = (node: IriString) => {
    const uri = node ? `/${encodeURIComponent(node)}` : '/'
    if (uri !== history.location.pathname) history.push(uri)
  }
  const handleSelect = withNode(selectNode)

  const selectedNode = decodeURIComponent(location.pathname.slice(1))

  const selectedNodeDependencies = selectNodeDependencies(selectedNode, people)
  // transform layout to TransformedLayout
  const transformedLayout = transformLayout(
    matrix,
    layout,
    people,
    highlightedNode,
    selectedNode,
    selectedNodeDependencies,
  )

  const grid = transformGrid(matrix, basicGrid)

  let person, knows, known

  if (selectedNode) {
    person = people[selectedNode]
    if (person) {
      knows = Array.from(person.knows).map(f => people[f])
      if (person.known) {
        known = Array.from(person.known).map(f => people[f])
      }
    }
  }

  return (
    <>
      <Visualization
        graph={transformedLayout}
        grid={grid}
        onTransform={handleTransform}
        onHover={handleHover}
        onSelectNode={handleSelect}
        {...props}
      />

      <Helmet>
        <title>
          {selectedNode && `${people[selectedNode]?.name || selectedNode} - `}
          Friend Crawler
        </title>
      </Helmet>

      {person && knows && known && (
        <PersonCard
          person={person}
          knows={knows}
          known={known}
          onSelectPerson={selectNode}
        />
      )}
    </>
  )
}

export default withRouter(VisualizationContainer)
