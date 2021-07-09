import React, { useRef, useEffect, useState } from 'react'
import { Vector, drawGrid } from '../helpers/draw'
import classnames from 'classnames'

type Props = Partial<React.CanvasHTMLAttributes<HTMLCanvasElement>>

const Visualization: React.FC<Props> = (props: Props) => {
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
        context.clearRect(0, 0, width, height)
        drawGrid(context, width, height, offset)

        return () => context.restore()
      }
    }
  }, [width, height, canvasEl])

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
