import graphlib, { Graph } from 'graphlib'
// import { Dependency } from './simulation/types'
// import findCyclesAdjacency from 'elementary-circuits-directed-graph'
import { Graph as AbstractGraph } from './hooks/graph'

function pruneCore(graph: Graph) {
  if (!graphlib.alg.isAcyclic(graph)) {
    // const cycles = graphlib.alg.findCycles(graph);
    throw new Error('pruning is possible on DAG only')
  }
  const edges = graph.edges()
  edges.forEach(edge => {
    // remove edge
    graph.removeEdge(edge)
    // see if another path exists
    const paths = graphlib.alg.dijkstra(graph, edge.v)
    // if the other path doesn't exist, add the node back
    if (paths[edge.w].distance === Infinity) {
      graph.setEdge(edge)
    }
  })
  return graph
}

export const prune = (input: AbstractGraph): AbstractGraph => {
  const graph = new graphlib.Graph()

  Object.values(input).forEach(node => {
    graph.setNode(node.uri)

    Object.values(node.dependsOn).forEach(dependency =>
      graph.setEdge(node.uri, dependency.uri),
    )
  })

  const output: AbstractGraph = Object.fromEntries(
    Object.entries(input).map(([uri, node]) => [
      uri,
      { ...node, dependsOn: {} },
    ]),
  )

  const prunedEdges = pruneCore(graph)
    .edges()
    .map(({ v: source, w: target }) => ({ source, target }))

  prunedEdges.forEach(({ source, target }) => {
    output[source].dependsOn[target] = output[target]
  })

  return output
}

/*
export function getCycles(dependencies: Dependency[]): Dependency[][] {
  const nodes = Array.from(
    new Set([
      ...dependencies.map(d => d.dependent),
      ...dependencies.map(d => d.dependency),
    ]),
  )
  const nodeIndexes = Object.fromEntries(
    Object.entries(nodes).map(([key, value]) => [value, +key]),
  )

  const adjacency = Array(nodes.length)
    .fill(null)
    .map(() => [] as number[])
  dependencies.forEach(({ dependent, dependency }) => {
    const dependentIndex = nodeIndexes[dependent]
    const dependencyIndex = nodeIndexes[dependency]
    adjacency[dependentIndex].push(dependencyIndex)
  })

  // try to detect loops (cycles of length 1)
  // this is due to the limits of the findCyclesAdjacency, which fails to detect loops
  // https://github.com/antoinerg/elementary-circuits-directed-graph/issues/13
  // @TODO remove loop detection when the issue is fixed
  const loops = adjacency.reduce((loops, adj, i) => {
    if (adj.includes(i)) loops.push([i, i])
    return loops
  }, [] as number[][])

  const rawCycles = loops.length > 0 ? loops : findCyclesAdjacency(adjacency)

  const simpleCycles = rawCycles.map(cycle =>
    cycle.slice(0, -1).map(i => nodes[i]),
  )

  return simpleCycles
    .map(cycle => simpleCycleToCycle(cycle, dependencies))
    .sort((a, b) => a.length - b.length)
    .slice(0, 5)
}

function simpleCycleToCycle(
  simpleCycle: string[],
  dependencies: Dependency[],
): Dependency[] {
  return simpleCycle.map((uri, index) => {
    const dependent = simpleCycle[index]
    const dependency = simpleCycle[(index + 1) % simpleCycle.length]
    return (
      dependencies.find(
        d => d.dependency === dependency && d.dependent === dependent,
      ) || {
        dependent,
        dependency,
        doc: '',
      }
    )
  })
  }
  */
