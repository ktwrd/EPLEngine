import * as PIXI from 'pixi.js'

import Engine from './engine'
import { EngineMouseState } from './engineMouseOverlay'
import DemoBase from './demobase'

export default class LineDrawer extends DemoBase
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)

        this.Engine.Interaction.on('mouse:up', (d) => this.onmouseup(d))
        this.Engine.Interaction.on('mouse:down', (d) => this.onmousedown(d))
    }

    public positionBuffer: PIXI.Point[] = []

    public destroy()
    {
        super.destroy()
    }

    public onmousedown(event: PIXI.InteractionEvent) : void
    {
        if (this.destroyed) return
        let position: PIXI.Point = JSON.parse(JSON.stringify(event.data.global))
        this.positionBuffer[0] = position

        let circle = this.Engine.Render.drawCircle({
            fill: {
                color: 0xff0000
            },
            radius: 8
        })
        circle.x = position.x
        circle.y = position.y
        this.Container.addChild(circle)
    }

    public onmouseup(event: PIXI.InteractionEvent) : void
    {
        if (this.destroyed) return
        let position: PIXI.Point = JSON.parse(JSON.stringify(event.data.global))
        this.positionBuffer[1] = position

        let circle = this.Engine.Render.drawCircle({
            fill: {
                color: 0x009900
            },
            radius: 8
        })
        circle.x = position.x
        circle.y = position.y
        this.Container.addChild(circle)

        this.drawLineGraphics()
        this.drawBoundingGraphics()
    }

    public drawLineGraphics() : void
    {
        if (this.destroyed) return
        let pointArray: number[][] = this.positionBuffer.map(p => [p.x, p.y])
        let lineGraphics = this.Engine.Render.drawLine({
            points: pointArray,
            stroke: {
                width: 1,
                color: 0xffffff
            }
        })
        this.Container.addChild(lineGraphics)
    }
    public drawBoundingGraphics() : void
    {
        if (this.destroyed) return
        let pointArray: number[][] = this.positionBuffer.map(p => [p.x, p.y])
        let graphics = this.Engine.Render.drawRectangle({
            points: pointArray,
            stroke: {
                width: 1,
                color: 0xffffff
            },
            fill: {
                color: 0x0000ff,
                opacity: 0.3
            }
        })

        let topleft = []
        if (pointArray[0][0] < pointArray[1][0])
            topleft[0] = pointArray[0][0]
        else
            topleft[0] = pointArray[1][0]
        
        if (pointArray[0][1] < pointArray[1][1])
            topleft[1] = pointArray[0][1]
        else
            topleft[1] = pointArray[1][1]

        let style = new PIXI.TextStyle(LineDrawer.TextStyle)
        let text = new PIXI.Text(`X: ${topleft[0]}\nY: ${topleft[1]}\nW: ${graphics.width}\nH: ${graphics.height}`, style)
        text.x = topleft[0]

        text.y = topleft[1]
        graphics.addChild(text)
        this.Container.addChild(graphics)
    }

    public static TextStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontSize: 16,
        fill: 0xffffff,
        align: 'left'
    })
}