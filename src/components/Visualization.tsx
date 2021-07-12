import React, { useRef, useEffect, useState } from 'react'
import {
  Vector,
  drawGrid,
  drawCircle,
  drawLine,
  drawText,
} from '../helpers/draw'
import classnames from 'classnames'
import { SimulationNode } from '../simulation/types'
import { SimulationLinkExt } from '../simulation'

type Props = Partial<React.CanvasHTMLAttributes<HTMLCanvasElement>> & {
  nodes: SimulationNode[]
  links: SimulationLinkExt[]
}

const Visualization: React.FC<Props> = ({ nodes, links, ...props }: Props) => {
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
        drawGrid(context, width, height, offset)
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
        nodes.forEach(({ x, y }) =>
          drawCircle(context, [x, y], 10, {
            fillStyle: '#fff8',
          }),
        )

        nodes.forEach(({ x, y, label }) =>
          drawText(context, [x + 15, y], label, {}),
        )

        return () => context.restore()
      }
    }
  }, [width, height, nodes, links, canvasEl])

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

  return (
    <canvas
      {...props}
      ref={canvasEl}
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
