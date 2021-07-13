import React, { useEffect, useState, useContext } from 'react'
import Visualization from './Visualization'
import useGraph from '../hooks/graph'
import Simulation, { SimulationLinkExt } from '../simulation'
import { SimulationNode, SimulationLink } from '../simulation/types'
import { Vector } from '../helpers/draw'
import { SessionContext } from '../contexts/session'
import { Grid } from '../helpers/draw'
import numeric from 'numeric'
// import useSimulation from '../hooks/simulation'

const transform = (matrix: number[][], vector: Vector): Vector => {
  const raw = numeric.dot(
    matrix,
    numeric.transpose([[...vector, 1]]),
  ) as number[][]
  const [[x], [y]] = raw
  return [x, y]
}

const simulation = new Simulation()

/*
type VisualizationNode = {
  x: number
  y: number
  uri: string
  label: string
}

type VisualizationGraph = {
  nodes: VisualizationNode[]
  links: [VisualizationNode, VisualizationNode][]
}
*/

type SimulationGraph = {
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

const transformSimulation = (
  matrix: number[][],
  graph: SimulationGraph,
): SimulationGraph => {
  const transformedNodesDict = Object.fromEntries(
    graph.nodes.map(node => {
      const [x, y] = transform(matrix, [node.x, node.y])
      return [node.uri, { ...node, x, y }]
    }),
  )

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

const VisualizationContainer: React.FC = props => {
  const [layout, setLayout] = useState<SimulationGraph>({
    nodes: [],
    links: [],
  })

  const [transformedLayout, setTransformedLayout] = useState<SimulationGraph>({
    nodes: [],
    links: [],
  })

  const [grid, setGrid] = useState<Grid>(basicGrid)

  const [info] = useContext(SessionContext)
  const [graph, revalidate] = useGraph()

  const [matrix, setMatrix] = useState<number[][]>([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])

  useEffect(() => {
    setGrid(transformGrid(matrix, basicGrid))
  }, [matrix])

  // transform layout to TransformedLayout
  useEffect(() => {
    setTransformedLayout(transformSimulation(matrix, layout))
  }, [layout, matrix])

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
  }, [])

  useEffect(() => {
    ;(async () => {
      await revalidate()
    })()
  }, [info, revalidate])

  useEffect(() => {
    const nodes = Object.values(graph).map(({ label, uri }) => ({
      label,
      x: Math.random() * 400,
      y: Math.random() * 400,
      uri,
    }))

    const links = Object.values(graph).reduce(
      (nodes, { uri: source, dependsOn }) => {
        Object.keys(dependsOn).forEach(target => nodes.push({ source, target }))
        return nodes
      },
      [] as SimulationLink[],
    )

    simulation.update({ nodes, links })
  }, [graph])

  function handleTransform(matrix: number[][]): void {
    setMatrix(prevMatrix => numeric.dot(matrix, prevMatrix) as number[][])
  }

  return (
    <Visualization
      nodes={transformedLayout.nodes}
      links={transformedLayout.links}
      grid={grid}
      onTransform={handleTransform}
      {...props}
    />
  )
}

export default VisualizationContainer
