import React, { useRef, useEffect, useState } from 'react'
import {
  Vector,
  Grid,
  drawGrid,
  drawCircle,
  drawLine,
  drawText,
} from '../helpers/draw'
import classnames from 'classnames'
import { SimulationNode } from '../simulation/types'
import { SimulationLinkExt } from '../simulation'
import { drag } from 'd3-drag'
import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'
import numeric from 'numeric'

type Props = Partial<React.CanvasHTMLAttributes<HTMLCanvasElement>> & {
  nodes: (SimulationNode & { style: string })[]
  links: SimulationLinkExt[]
  grid: Grid
  onTransform: (matrix: number[][]) => void
  onHover: (position: Vector) => void
}

let old: number[][]

const Visualization: React.FC<Props> = ({
  nodes,
  links,
  grid,
  onTransform,
  onHover,
  ...props
}: Props) => {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [{ width, height }, setVisualizationSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      const context = canvasEl.current.getContext('2d')
      if (context) {
        const offset: Vector = [width / 2, height / 2]
        context.save()
        context.translate(...offset)
        context.clearRect(-offset[0], -offset[1], width, height)
        drawGrid(context, grid, width, height, offset)
        links.forEach(link => {
          if (
            typeof link.source === 'object' &&
            typeof link.target === 'object' &&
            typeof link.source.x === 'number' &&
            typeof link.target.x === 'number' &&
            typeof link.source.y === 'number' &&
            typeof link.target.y === 'number'
          ) {
            const source: Vector = [link.source.x, link.source.y]
            const target: Vector = [link.target.x, link.target.y]
            drawLine(context, source, target, {
              strokeStyle: 'white',
              lineWidth: 0.5,
            })
          }
        })

        const accentedColor = 'violet' // '#ff5d'
        const accented = nodes.filter(({ style }) => style === 'accent')
        const rest = nodes.filter(({ style }) => !style)

        rest.forEach(({ x, y }) =>
          drawCircle(context, [x, y], 10, { fillStyle: '#fff8' }),
        )

        rest.forEach(({ x, y, label }) => {
          drawText(context, [x + 15, y], label, {})
        })

        // draw accented nodes
        accented.forEach(({ x, y }) =>
          drawCircle(context, [x, y], 10, { fillStyle: accentedColor }),
        )

        accented.forEach(({ x, y, label }) => {
          drawText(context, [x + 15, y], label, { fillStyle: accentedColor })
        })

        return () => context.restore()
      }
    }
  }, [width, height, nodes, links, canvasEl, grid])

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasEl && canvasEl.current) {
        const size = getElementSize(canvasEl)
        setVisualizationSize(size)
      }
    }

    updateCanvasSize()
    window.addEventListener('load', updateCanvasSize)
    window.addEventListener('resize', updateCanvasSize)

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      window.removeEventListener('load', updateCanvasSize)
    }
  }, [width, height, canvasEl])

  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      select(canvasEl.current).call(
        drag<HTMLCanvasElement, unknown>()
          .clickDistance(2)
          .on('start', console.log)
          .on('drag', e => {
            onTransform([
              [1, 0, e.dx],
              [0, 1, e.dy],
              [0, 0, 1],
            ])
          })
          .on('end', console.log),
      )

      select(canvasEl.current).call(
        zoom<HTMLCanvasElement, unknown>()
          .clickDistance(2)
          .scaleExtent([0.05, 3])
          .on('zoom', e => {
            old = old ?? [
              [1, 0, -width / 2],
              [0, 1, -height / 2],
              [0, 0, 1],
            ]
            const { x, y, k } = e.transform

            const zoom = [
              [k, 0, x - width / 2],
              [0, k, y - height / 2],
              [0, 0, 1],
            ]

            const transform = numeric.dot(zoom, numeric.inv(old)) as number[][]
            old = zoom

            onTransform(transform)
          }),
      )
    }
  }, [canvasEl, onTransform, height, width])

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = e =>
    onHover([e.clientX - width / 2, e.clientY - height / 2])

  return (
    <canvas
      {...props}
      ref={canvasEl}
      onMouseMove={handleMouseMove}
      // @TODO this piece is very inefficient, we search for a nonexistent node, just to unhighlight everything; but it works
      onMouseOut={() => onHover([Infinity, Infinity])}
      width={width}
      height={height}
      className={classnames(props.className, 'has-background-dark')}
    />
  )
}

export default Visualization

function getElementSize(elementRef: React.RefObject<HTMLCanvasElement>) {
  if (elementRef && elementRef.current) {
    const { clientHeight: height, clientWidth: width } = elementRef.current
    return { height, width }
  } else return { height: 0, width: 0 }
}
