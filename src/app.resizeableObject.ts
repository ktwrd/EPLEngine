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
    update              (position: PIXI.Point, size: PIXI.Point) : void,
    initalizeGraphics   () : void
}
export class Widget implements IWidget
{
    public constructor(parentClass: ResizeableObject, anchor: PIXI.Point)
    {
        this.Parent = parentClass
        this.Anchor = anchor
    }

    // Center align by default
    public Anchor: PIXI.Point = new PIXI.Point(0.5, 0.5)

    public Parent: ResizeableObject = null

    public Graphics: PIXI.Graphics = new PIXI.Graphics()

    public getPosition(position: PIXI.Point, size: PIXI.Point) : PIXI.Point {
        let point: PIXI.Point = new PIXI.Point(position.x, position.y)
        return point
    }

    public initalizeGraphics() : void
    {
        if (this.Graphics == null)
            this.Graphics = new PIXI.Graphics()
    }

    public update(position: PIXI.Point, size: PIXI.Point) : void
    {

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

export default class ResizeableObject extends DemoBase implements IResizeableObject
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)

        this.createWidgets()
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
            }
            let xIndex = Math.round(o[0].x * 100)
            let yIndex = Math.round(o[0].y * 100)
            if (this.Widgets[xIndex] == undefined)
                this.Widgets[xIndex] = []
            this.Widgets[xIndex][yIndex] = o[1]
        }
        console.log(this.Widgets)
    }

    public async setTarget(target: PIXI.IDisplayObjectExtended) : Promise<void>
    {
        this.TargetObject = target
        this.TargetContainer.removeChildren()
        this.TargetContainer.addChild(this.TargetObject)

        let bounds: PIXI.Rectangle = this.TargetObject.getBounds()

        await this.updateWidgets(
            new PIXI.Point(this.TargetObject.x, this.TargetObject.y),
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

    public Widgets: Nullable<Widget>[][] = []
    public TargetObject: PIXI.IDisplayObjectExtended = null

    public TargetContainer: PIXI.Container = new PIXI.Container()
    public WidgetContainer: PIXI.Container = new PIXI.Container()
}