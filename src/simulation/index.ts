import {
  forceSimulation,
  forceCollide,
  forceLink,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  SimulationNodeDatum,
  SimulationLinkDatum,
  ForceLink,
} from 'd3-force'
import { Coords, Uri, SimulationNode, SimulationLink, Node } from './types'

interface SimulationNodeExt extends SimulationNodeDatum {
  uri: Uri
}

export type SimulationLinkExt = SimulationLinkDatum<SimulationNodeExt>

export default class Simulation {
  nodes: SimulationNodeExt[] = []
  links: SimulationLinkExt[] = []

  runs = false

  simulation = forceSimulation()
    .alphaDecay(0.005)
    .force(
      'link',
      forceLink()
        .id(node => (node as SimulationNodeExt).uri)
        .distance(50)
        .strength(0.1),
    )
    .force('charge', forceManyBody().strength(-150).distanceMax(500))
    .force('gravityX', forceX(0).strength(0.01))
    .force('gravityY', forceY(0).strength(0.01))
    .force('collide', forceCollide(15))
    .force('center', forceCenter(0, 0))
    .stop()

  start = ({
    nodes,
    links,
    onTick,
  }: {
    nodes: SimulationNode[]
    links: SimulationLink[]
    onTick: (simulation: {
      nodes: SimulationNode[]
      links: SimulationLinkExt[]
    }) => void
  }) => {
    this.nodes = nodes as SimulationNodeExt[]
    this.links = links.map(link => ({ ...link })) as SimulationLinkExt[]

    this.simulation.nodes(this.nodes)
    ;(
      this.simulation.force('link') as ForceLink<
        SimulationNodeExt,
        SimulationLinkExt
      >
    ).links(this.links)

    this.simulation.on('tick', () => {
      onTick({
        nodes: this.nodes as SimulationNode[],
        links: this.links,
      })
    })

    this.simulation.restart()
    this.runs = true
  }

  stop = () => {
    this.runs = false
    return this.simulation.stop()
  }

  update = ({ nodes, links }: { nodes: Node[]; links: SimulationLink[] }) => {
    this.simulation.stop()
    // combine current visualization and
    const thisNodeDict: { [uri: string]: SimulationNodeExt } =
      Object.fromEntries(this.nodes.map(node => [node.uri, node]))
    const nodeDict: { [uri: string]: SimulationNodeExt } = Object.fromEntries(
      nodes.map(node => [
        node.uri,
        {
          ...node,
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
      ]),
    )
    this.nodes = Object.values({ ...nodeDict, ...thisNodeDict })
    this.links = links.map(link => ({ ...link })) as SimulationLinkExt[]

    this.simulation.nodes(this.nodes)
    ;(
      this.simulation.force('link') as ForceLink<
        SimulationNodeExt,
        SimulationLinkExt
      >
    ).links(this.links)

    this.simulation.alpha(0.5).restart()
  }

  selectNode = ({ x, y }: Coords) =>
    this.simulation.find(x, y, 32) as SimulationNodeExt
}
