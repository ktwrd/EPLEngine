import * as PIXI from 'pixi.js'

import Engine from './engine'
import DemoBase from './demobase'

export interface IWidget
{
    Parent: ResizeableObject,

    Graphics: PIXI.Graphics,

    // Value represents the decimal % of how far it should go across.
    Anchor: PIXI.Point

    getPosition         (position: PIXI.Point, size: PIXI.Point) : PIXI.Point,
    setPosition         (position: PIXI.Point) : void
    update              (position: PIXI.Point, size: PIXI.Point) : void,
    initalizeGraphics   () : void
}
export class Widget implements IWidget
{
    public constructor(parentClass: ResizeableObject, anchor: PIXI.Point)
    {
        this.Parent = parentClass
        this.Anchor = anchor
        this.Graphics.x = 0 - (this.Parent.widgetWidth / 2)
        this.Graphics.y = 0 - (this.Parent.widgetWidth / 2)
        this.Container.addChild(this.Graphics)
        this.initalizeGraphics()
    }

    // Center align by default
    public Anchor: PIXI.Point = new PIXI.Point(0.5, 0.5)

    public Parent: ResizeableObject = null

    public Graphics: PIXI.Graphics = new PIXI.Graphics()
    public Container: PIXI.Container = new PIXI.Container()

    public getPosition(position: PIXI.Point, size: PIXI.Point) : PIXI.Point {
        let point: PIXI.Point = new PIXI.Point(position.x, position.y)
        return point
    }

    public initalizeGraphics() : void
    {
        this.Container.interactive = true
        
        this.Container.on('mousedown', (event) => this.onmousedown(event))
        this.Graphics.on('mousedown', console.log)
        this.Graphics.lineStyle({
            width: 1,
            color: 0xffffff,
            alpha: 1,
        })
        this.Graphics.beginFill(0x000000, 1)

        let positions = [
            [0, 0],
            [this.Parent.widgetWidth, 0],
            [this.Parent.widgetWidth, this.Parent.widgetWidth],
            [0, this.Parent.widgetWidth],
            [0, 0],
        ]

        this.Graphics.moveTo(0, 0)
        for (let i = 0; i < positions.length; i++)
        {
            let curr = positions[i]
            let next = positions[i + 1]
            if (next != undefined)
                this.Graphics.lineTo(next[0], next[1])
        }
        this.Graphics.endFill()
        console.log(this)
    }

    public update(position: PIXI.Point, size: PIXI.Point) : void
    {
        this.Container.x = size.x * this.Anchor.x
        this.Container.y = size.y * this.Anchor.y
    }

    public setPosition(position: PIXI.Point) : void
    {
        this.Container.x = position.x
        this.Container.y = position.y
    }

    public onmousedown(event: PIXI.InteractionEvent) : void
    {
        this.Parent.registerWidgetDown(this, event)
    }
}

export interface IResizeableObject extends DemoBase
{
    createWidgets   () : void
    setTarget       (target: PIXI.IDisplayObjectExtended) : void
    updateWidgets   (position: PIXI.Point, size: PIXI.Point) : Promise<void>

    Widgets: Nullable<Widget>[][]

    TargetObject: PIXI.IDisplayObjectExtended

    TargetContainer: PIXI.Container,
    WidgetContainer: PIXI.Container
}

export interface IStrokeOptions extends PIXI.ILineStyleOptions
{
    width: number,
    color: number
}

export default class ResizeableObject extends DemoBase implements IResizeableObject
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)
        this.initalizeContainer()
        this.createWidgets()
    }

    public initalizeContainer() : void
    {
        this.Container.removeChildren()

        this.createStroke(this.strokeOptions)
        this.Container.addChild(this.stroke)
        this.Container.x = 0
        this.Container.y = 0
        this.Container.addChild(this.TargetContainer)
        this.Container.addChild(this.WidgetContainer)

        this.Engine.Interaction.on('mouse:up', (event) => this.onmouseup(event))
        this.Engine.Interaction.on('mouse:move', (event) => this.onmousemove(event))
    }

    public strokeOptions: IStrokeOptions =
    {
        width: 2,
        color: 0xffffff,
        alignment: 1

    }
    public stroke: PIXI.Graphics = null

    public createStroke(options: IStrokeOptions, bounds: PIXI.Rectangle=new PIXI.Rectangle()) : void
    {
        if (this.stroke == null)
            this.stroke = new PIXI.Graphics()
        this.stroke.x = 0
        this.stroke.y = 0

        console.log(bounds)

        let positions = [
            [0, 0],
            [bounds.width, 0],
            [bounds.width, bounds.height],
            [0, bounds.height],
            [0, 0]
        ]
        console.log(positions)
        this.stroke.clear()

        this.stroke.lineStyle(options)

        for (let i = 0; i < positions.length; i++)
        {
            let curr = positions[i]
            let next = positions[i + 1]
            this.stroke.moveTo(curr[0], curr[1])
            if (next != undefined)
                this.stroke.lineTo(next[0], next[1])
        }
        this.stroke.zIndex = -1
    }

    public createWidgets() : void
    {
        let options: [PIXI.Point, Widget][] = [
            [new PIXI.Point(0, 0), null],
            [new PIXI.Point(1, 0), null],
            [new PIXI.Point(0, 1), null],
            [new PIXI.Point(1, 1), null],
        ]

        for (let i = 0; i < options.length; i++)
        {
            let o: [PIXI.Point, Widget] = options[i]
            if (o[1] == null)
            {
                o[1] = new Widget(this, o[0])
                this.WidgetContainer.addChild(o[1].Container)
            }
            let xIndex = Math.round(o[0].x * 100)
            let yIndex = Math.round(o[0].y * 100)
            if (this.Widgets[xIndex] == undefined)
                this.Widgets[xIndex] = []
            this.Widgets[xIndex][yIndex] = o[1]
        }
        this.WidgetContainer.zIndex = 1
        console.log(this.Widgets)
    }

    public async setTarget(target: PIXI.IDisplayObjectExtended) : Promise<void>
    {
        this.TargetObject = target

        this.Container.x = parseFloat(this.TargetObject.x.toString())
        this.Container.y = parseFloat(this.TargetObject.y.toString())
        this.TargetObject.x = 0
        this.TargetObject.y = 0

        this.TargetContainer.removeChildren()
        this.TargetContainer.addChild(this.TargetObject)

        let bounds: PIXI.Rectangle = this.TargetObject.getBounds()
        this.createStroke(this.strokeOptions, bounds)

        await this.updateWidgets(
            new PIXI.Point(this.Container.x, this.Container.y),
            new PIXI.Point(bounds.width, bounds.height)
        )
    }

    public async updateWidgets(position: PIXI.Point, size: PIXI.Point) : Promise<void>
    {
        for (let x = 0; x < this.Widgets.length; x++)
        {
            if (this.Widgets[x] == undefined)
                continue
            for (let y = 0; y < this.Widgets[x].length; y++)
            {
                if (this.Widgets[x][y] == undefined)
                    continue
                this.Widgets[x][y].update(position, size)
            }
        }
    }

    private downInitialPosition: PIXI.Point
    private downInitialWidget: Widget

    public registerWidgetDown(widget: Widget, event: PIXI.InteractionEvent) : void
    {
        console.log(`Widget Down`, widget.Anchor)
        if (this.downInitialPosition == null)
        {
            this.downInitialPosition = new PIXI.Point(event.data.global.x, event.data.global.y)
            this.downInitialWidget = widget
        }
    }

    public processWidgetMove(widget: Widget, mousePosition: PIXI.Point) : void
    {
        widget.setPosition(mousePosition)
    }

    public Widgets: Nullable<Widget>[][] = []
    public TargetObject: PIXI.IDisplayObjectExtended = null

    public TargetContainer: PIXI.Container = new PIXI.Container()
    public WidgetContainer: PIXI.Container = new PIXI.Container()

    private mouseDown: boolean = false
    private mouseWidgetDrag: boolean = false
    private mouseTargetDrag: boolean = false

    public widgetWidth: number = 12

    public onmouseup(event: PIXI.InteractionEvent) : void
    {
        if (this.downInitialPosition == null) return
        console.log('up!')
        console.log(`stt -> [${this.downInitialPosition.x}, ${this.downInitialPosition.y}]`)
        console.log(`end -> [${event.data.global.x}, ${event.data.global.y}]`)

        let distance = new PIXI.Point(event.data.global.x - this.downInitialPosition.x, event.data.global.y - this.downInitialPosition.y)
        console.log(`distance: [${distance.x}, ${distance.y}]`)

        this.downInitialPosition = null
    }
    public onmousemove(event: PIXI.InteractionEvent) : void
    {
        if (!this.mouseDown)
            return
        let currentContainerBounds: PIXI.Rectangle = this.Container.getBounds()
        if (this.mouseWidgetDrag)
        {
            for (let x = 0; x < this.Widgets.length; x++)
            {
                if (this.Widgets[x] == undefined) continue
                let xpos = (x / 100) * currentContainerBounds.width
                if (xpos > this.widgetWidth + event.data.global.x) continue
                for (let y = 0; y < this.Widgets[x].length; y++)
                {
                    if (this.Widgets[x][y] == undefined) continue
                    let ypos = (y / 100) * currentContainerBounds.height
                    if (ypos > this.widgetWidth + event.data.global.y) continue

                    this.processWidgetMove(this.Widgets[x][y], new PIXI.Point(event.data.global.x, event.data.global.y))
                }
            }
        }
    }
}