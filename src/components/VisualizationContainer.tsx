import React, { useEffect, useState, useContext } from 'react'
import Visualization from './Visualization'
import useGraph from '../hooks/graph'
import Simulation, { SimulationLinkExt } from '../simulation'
import { SimulationNode, SimulationLink } from '../simulation/types'
import { SessionContext } from '../contexts/session'
// import useSimulation from '../hooks/simulation'

const simulation = new Simulation()

const VisualizationContainer: React.FC = props => {
  const [layout, setLayout] = useState<{
    nodes: SimulationNode[]
    links: SimulationLinkExt[]
  }>({ nodes: [], links: [] })

  const [info] = useContext(SessionContext)
  const [graph, revalidate] = useGraph()

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

  return <Visualization nodes={layout.nodes} links={layout.links} {...props} />
}

export default VisualizationContainer
