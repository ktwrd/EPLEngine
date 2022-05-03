import * as PIXI from 'pixi.js'

import Engine from './engine'
import DemoBase from './demobase'

export default class LineDrawer extends DemoBase
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)

        this.Engine.Interaction.on('mouse:up', (d) => this.onmouseup(d))
        this.Engine.Interaction.on('mouse:down', (d) => this.onmousedown(d))
        this.Engine.Interaction.on('mouse:move', (d) => this.onmousemove(d))

        this.mouseLine = new PIXI.Graphics()
        this.Container.addChild(this.mouseLine)
    }

    public positionBuffer: PIXI.Point[] = []

    public destroy()
    {
        super.destroy()
    }

    private drawMouseLine: boolean = false
    private mouseLine: PIXI.Graphics = null

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
        this.drawMouseLine = true
    }

    public onmouseup(event: PIXI.InteractionEvent) : void
    {
        if (this.destroyed) return
        this.mouseLine.clear()
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
        this.drawMouseLine = false
    }

    private previousMousePosition: PIXI.Point = null

    private mouseLineDrawing: boolean = false
    private mouseMoveOffset: number = 0

    public async onmousemove(event: PIXI.InteractionEvent) : Promise<void>
    {
        if (this.destroyed) return
        if (this.mouseMoveOffset < 2)
        {
            this.mouseMoveOffset++
            return
        }
        this.mouseMoveOffset = 0
        if (this.drawMouseLine
            && this.previousMousePosition != null
            && event.data.global.x != this.previousMousePosition.x
            && event.data.global.y != this.previousMousePosition.y
            && !this.mouseLineDrawing)
        {
            this.mouseLineDrawing = true
            this.mouseLine.clear()
            this.mouseLine.lineStyle(2, 0xffffff, 1, 0.5, false)
            this.mouseLine.drawRect(this.positionBuffer[0].x, this.positionBuffer[0].y, event.data.global.x - this.positionBuffer[0].x, event.data.global.y - this.positionBuffer[0].y)
            this.mouseLine.moveTo(this.positionBuffer[0].x, this.positionBuffer[0].y)
            this.mouseLine.lineTo(event.data.global.x, event.data.global.y)
            this.Engine.Application.render()
            this.mouseLineDrawing = false
        }
        else
        {
            if (!this.mouseLineDrawing)
                this.previousMousePosition = null
        }
        this.previousMousePosition = new PIXI.Point(event.data.global.x, event.data.global.y)
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