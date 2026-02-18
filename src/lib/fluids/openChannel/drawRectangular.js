// @ts-nocheck

export const createDrawRectangular = ({
	getWidthInPixels,
	getWallRisePx,
	getDimensionInsetPx,
	getBaseLineOffsetPx,
	getCanvasTopPaddingPx,
	getCanvasBottomPaddingPx,
	getMaxDepthPx
}) => {
	return (baseValue, depthValue, canvas) => {
		const widthInPixels = getWidthInPixels?.()
		if (!canvas || !widthInPixels) return null

		const wallRisePx = getWallRisePx?.() ?? 0
		const dimensionInsetPx = getDimensionInsetPx?.() ?? 0
		const baseLineOffsetPx = getBaseLineOffsetPx?.() ?? 0
		const canvasTopPaddingPx = getCanvasTopPaddingPx?.() ?? 0
		const canvasBottomPaddingPx = getCanvasBottomPaddingPx?.() ?? 0
		const maxDepthPx = getMaxDepthPx?.() ?? 150

		const ratio =
			Math.round(Math.min(Math.max(Number(baseValue) / Number(depthValue), 1 / 6), 8) * 100) / 100

		// https://www.geeksforgeeks.org/javascript/javascript-anonymous-functions/
		let bpx = (() => {
			let d
			if (ratio < 1) {
				// maps aspectRatio of 1/6 to 10% of divWidth, 1 to 40% of divWidth
				d = 36 * ratio + 4
			} else {
				// maps ... 1 to 40, 8 to 89
				d = 7 * ratio + 33
			}
			return Math.round((d / 100) * widthInPixels)
		})()
		let ypx = Math.round(bpx / ratio)
		if (ypx > maxDepthPx) {
			ypx = maxDepthPx
			bpx = Math.round(ypx * ratio)
		}

		const canvasHeight = ypx + canvasTopPaddingPx + canvasBottomPaddingPx
		canvas.width = bpx
		canvas.height = canvasHeight
		const context = canvas.getContext('2d')
		context.clearRect(0, 0, canvas.width, canvas.height)
		const waterTop = canvasTopPaddingPx + wallRisePx
		const waterBottom = waterTop + ypx
		const gradient = context.createLinearGradient(0, waterTop, 0, waterBottom)
		gradient.addColorStop(0, '#0cc')
		gradient.addColorStop(1, '#066')
		context.fillStyle = gradient
		context.fillRect(0, waterTop, bpx, ypx)

		// Draw channel walls: left/right/bottom, extending wallRise above water surface
		context.strokeStyle = '#333'
		context.lineWidth = 4.5
		context.lineCap = 'round'
		context.beginPath()
		context.moveTo(0, 0)
		context.lineTo(0, waterBottom)
		context.lineTo(bpx, waterBottom)
		context.lineTo(bpx, 0)
		context.stroke()

		// Draw dimension lines (b and y) with arrowheads
		const drawDirectedLine = (x1, y1, x2, y2, both = true, size = 6) => {
			context.beginPath()
			context.moveTo(x1, y1)
			context.lineTo(x2, y2)
			context.stroke()

			const angle = Math.atan2(y2 - y1, x2 - x1)
			const drawHead = (x, y, theta) => {
				context.beginPath()
				context.moveTo(x, y)
				context.lineTo(
					x - size * Math.cos(theta - Math.PI / 6),
					y - size * Math.sin(theta - Math.PI / 6)
				)
				context.lineTo(
					x - size * Math.cos(theta + Math.PI / 6),
					y - size * Math.sin(theta + Math.PI / 6)
				)
				context.closePath()
				context.fill()
			}

			if (both) {
				drawHead(x1, y1, angle + Math.PI)
			}
			drawHead(x2, y2, angle)
		}

		context.strokeStyle = '#111'
		context.fillStyle = '#111'
		context.lineWidth = 1
		context.lineCap = 'butt'
		const snap = (value) => Math.round(value) + 0.5

		const yLineTop = snap(waterTop)
		const yLineBottom = snap(waterBottom - dimensionInsetPx)
		const yLineX = snap(bpx / 2)
		drawDirectedLine(yLineX, yLineTop, yLineX, yLineBottom)

		const baseLineY = snap(waterBottom + baseLineOffsetPx)
		const bLineLeft = snap(dimensionInsetPx)
		const bLineRight = snap(bpx - dimensionInsetPx)
		drawDirectedLine(bLineLeft, baseLineY, bLineRight, baseLineY)

		return {
			bpx,
			ypx,
			baseLineY,
			waterTop,
			waterBottom,
			canvasHeight
		}
	}
}
