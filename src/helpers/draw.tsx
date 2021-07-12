export type Vector = [number, number]

type Options = Partial<CanvasRenderingContext2D>

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
  width: number,
  height: number,
  offset: Vector = [0, 0],
) => {
  const getLineWidth = (i: number) => (i === 0 ? 2 : i % 5 === 0 ? 1 : 0.5)

  const negLinesX = Math.ceil(-offset[0] / 10)
  const posLinesX = Math.ceil((width - offset[0]) / 10)
  const negLinesY = Math.ceil(-offset[1] / 10)
  const posLinesY = Math.ceil((height - offset[1]) / 10)

  for (let i = negLinesY; i < posLinesY; ++i) {
    const y = 10 * i
    drawLine(context, [0 - offset[0], y], [width - offset[0], y], {
      strokeStyle: 'white',
      lineWidth: getLineWidth(i),
    })
  }
  for (let i = negLinesX; i < posLinesX; ++i) {
    const x = 10 * i
    drawLine(context, [x, 0 - offset[1]], [x, height - offset[1]], {
      strokeStyle: 'white',
      lineWidth: getLineWidth(i),
    })
  }
}
