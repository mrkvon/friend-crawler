import { SimulationLinkExt } from './index'

export default function gravity() {
  let links: SimulationLinkExt[] = []
  let strength = 3
  function force(alpha: number) {
    const k = strength * alpha
    links.forEach(function (d) {
      //// this works
      // d.source.y = Math.max(d.target.y + 50, d.source.y);
      //// this is original
      // d.source.vy += k;
      // d.target.vy -= k;
      //
      //// this works with velocities, so the graph looks less layered
      const { source, target } = d
      if (typeof source === 'object' && typeof target === 'object') {
        if (
          source.y &&
          target.y &&
          source.vy &&
          target.vy &&
          source.y < target.y + 50
        ) {
          const optimumDifference = (target.y + 50 - source.y) / 50
          source.vy += k * optimumDifference
          target.vy -= k * optimumDifference
        }
      }
    })
  }

  force.links = (_: SimulationLinkExt[]) => {
    links = _
    return force
  }

  force.strength = (_: number) => {
    strength = _
    return force
  }

  return force
}
