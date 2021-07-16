export type Vector = [number, number]

export type Grid = {
  origin: Vector // coordinate of the origin
  distance: number // distance between lines
  highlight: number // which lines should be highlighted
}

type Options = Partial<CanvasRenderingContext2D>

export const drawText = (
  context: CanvasRenderingContext2D,
  [x, y]: Vector,
  text: string,
  options: Options,
) => {
  context.font = '20px Arial'
  context.textBaseline = 'middle'
  context.textAlign = 'left'
  // context.fillStyle = '#fff7'
  Object.assign(context, options)
  context.fillText(text, x, y)
}

export const drawCircle = (
  context: CanvasRenderingContext2D,
  [x, y]: Vector,
  radius: number,
  options: Options,
) => {
  Object.assign(context, options)
  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI)
  context.fill()
}

export const drawLine = (
  context: CanvasRenderingContext2D,
  start: Vector,
  end: Vector,
  options: Options,
) => {
  Object.assign(context, options)

  context.beginPath()
  context.moveTo(...start)
  context.lineTo(...end)
  context.stroke()
}

export const drawGrid = (
  context: CanvasRenderingContext2D,
  grid: Grid,
  width: number,
  height: number,
  offset: Vector = [0, 0],
) => {
  const strokeStyle = '#fff2'
  const min1 = -offset[1]
  const max1 = height - offset[1]
  const min0 = -offset[0]
  const max0 = width - offset[0]

  const getLineWidth = (i: number) =>
    i === 0 ? 2 : i % grid.highlight === 0 ? 1 : 0.5

  let i = 0
  while (i * grid.distance + grid.origin[0] <= max0) {
    const x = i * grid.distance + grid.origin[0]
    if (x >= min0) {
      drawLine(context, [x, min1], [x, max1], {
        strokeStyle,
        lineWidth: getLineWidth(i),
      })
    }
    i++
  }

  i = -1
  while (i * grid.distance + grid.origin[0] >= min0) {
    const x = i * grid.distance + grid.origin[0]
    if (x <= max0) {
      drawLine(context, [x, min1], [x, max1], {
        strokeStyle,
        lineWidth: getLineWidth(i),
      })
    }
    i--
  }

  i = 0
  while (i * grid.distance + grid.origin[1] <= max1) {
    const y = i * grid.distance + grid.origin[1]
    if (y >= min1) {
      drawLine(context, [min0, y], [max0, y], {
        strokeStyle,
        lineWidth: getLineWidth(i),
      })
    }
    i++
  }

  i = -1
  while (i * grid.distance + grid.origin[1] >= min1) {
    const y = i * grid.distance + grid.origin[1]
    if (y <= max1) {
      drawLine(context, [min0, y], [max0, y], {
        strokeStyle,
        lineWidth: getLineWidth(i),
      })
    }
    i--
  }
}
