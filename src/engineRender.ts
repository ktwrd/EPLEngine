import * as PIXI from 'pixi.js'

import Engine from './engine'

import * as EngineRenderParameter from './engineRenderParameter'

export default class EngineRender {
    public constructor(engine: Engine)
    {
        this.Engine = engine
    }

    public Engine: Engine = null

    public drawCircle(options?: EngineRenderParameter.Circle): PIXI.Graphics
    {
        options = { ...EngineRenderParameter.DefaultCircle, ...options }
        let graphics: PIXI.Graphics = new PIXI.Graphics()
        graphics.clear()

        graphics.beginFill(
            options.fill.color,
            options.fill.opacity
        )
        graphics.lineStyle(
            options.stroke.width,
            options.stroke.color,
            options.stroke.opacity
        )
        graphics.drawCircle(0, 0, options.radius)
        graphics.endFill()

        return graphics
    }

    public drawLine(options?: EngineRenderParameter.PointArray): PIXI.Graphics
    {
        options = { ...EngineRenderParameter.DefaultPointArray, ...options }
        let graphics: PIXI.Graphics = new PIXI.Graphics()
        graphics.clear()

        graphics.position.set(0, 0)
        graphics.beginFill()

        graphics.lineStyle(
            options.stroke.width,
            options.stroke.color,
            options.stroke.opacity
        )

        for (let i = 0; i < options.points.length; i++)
        {
            let point = options.points[i]
            let pointNext = options.points[i + 1]

            graphics.moveTo(point[0], point[1])
            if (pointNext != undefined)
                graphics.lineTo(pointNext[0], pointNext[1])
        }

        graphics.endFill()

        return graphics
    }

    public drawRectangle(options?: EngineRenderParameter.Rectangle): PIXI.Graphics
    {
        options = { ...EngineRenderParameter.DefaultRectangle, ...options }

        let newpoints: number[][] = [
            options.points[0],
            [options.points[0][0], options.points[1][1]],
            options.points[1],
            [options.points[1][0], options.points[0][1]]
        ]

        let graphics: PIXI.Graphics = new PIXI.Graphics()
        graphics.clear()

        graphics.beginFill(
            options.fill.color,
            options.fill.opacity
        )
        graphics.lineStyle(
            options.stroke.width,
            options.stroke.color,
            options.stroke.opacity
        )

        let w = options.points[1][0] - options.points[0][0]
        let h = options.points[1][1] - options.points[0][1]
        graphics.drawRect(options.points[0][0], options.points[0][1], w, h)

        graphics.endFill()

        return graphics
    }

    public drawPolygon(options?: EngineRenderParameter.PointArray) : PIXI.Graphics
    {
        options = { ...EngineRenderParameter.DefaultPointArray, ...options }
        let graphics: PIXI.Graphics = new PIXI.Graphics()
        graphics.clear()

        let points: number[][] = this.rasterizePoints(options.points)

        graphics.beginFill(
            options.fill.color,
            options.fill.opacity
        )
        graphics.lineStyle(
            options.stroke.width,
            options.stroke.color,
            options.stroke.opacity
        )
        console.log(options)
        for (let i = 0; i < points.length; i++)
        {
            let point = points[i]
            let pointNext = points[i + 1]

            graphics.moveTo(point[0], point[1])
            if (pointNext != undefined)
                graphics.lineTo(pointNext[0], pointNext[1])
        }
        graphics.endFill()

        return graphics
    }

    public rasterizePoints(rawpoints: number[][]) : number[][]
    {
        // Generate PIXI Points
        let points: any[] = rawpoints.map(r => new PIXI.Point(...r))

        let center = {
            y: 0,
            x: 0
        }
        // Sort Coordinates T -> B
        points = points.sort((a, b) => a.y - b.y);
    
        // Get center Y-axis
        center.y = (points[0].y + points[points.length - 1].y) / 2;
    
        // Sort Coordinates L -> R
        points = points.sort((a, b) => b.x - a.x);
    
        // Get center X-Axis
        center.x = (points[0].x + points[points.length - 1].x) / 2;
    
        let startAngle
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
    
            let angle = Math.atan2(point.y - center.y, point.x - center.x);
            if (!startAngle) {
                startAngle = angle
            } else {
                if (angle < startAngle) {
                    angle += Math.PI * 2;
                }
            }
            point.angle = angle;
        }
    
        points = points.sort((a, b) => a.angle - b.angle);
    
        // Reverse points
        let reversed = [].concat(points).reverse();
    
        // Move last point to begining
        reversed.unshift(reversed.pop());
    
        let resultPoints: number[][] = reversed.map(p => [p.x, p.y]);
    
        return resultPoints;
    }
}