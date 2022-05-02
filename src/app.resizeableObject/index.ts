import * as PIXI from 'pixi.js'

import * as Utility from '../utilities'

import Engine from '../engine'
import DemoBase, { IDemoBase } from '../demobase'

import ResizeableObjectStroke from './stroke'
import SideInteractive, { ESideLocation } from './sideInteractive'

export interface IResizeableObject
{
    stroke: ResizeableObjectStroke
    strokeOptions: IStrokeOptions

    Target: PIXI.Container
    WidgetContainer: PIXI.Container

    setTarget(target: PIXI.IDisplayObjectExtended) : void

    onmouseup(event: PIXI.InteractionEvent) : void
    onmousedown(event: PIXI.InteractionEvent) : void
    onmousemove(event: PIXI.InteractionEvent) : void
}

export interface IStrokeOptions extends PIXI.ILineStyleOptions
{
    width: number,
    color: number
}

export default class ResizeableObject extends DemoBase implements IResizeableObject, IDemoBase
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)
        this.initalize()
    }

    public stroke: ResizeableObjectStroke = null
    public Target: PIXI.Container = null
    public WidgetContainer: PIXI.Container = null

    private initalize() : void
    {
        this.WidgetContainer = new PIXI.Container()
        this.stroke = new ResizeableObjectStroke(this)

        this.initalizeContainer()

        let sides: ESideLocation[] = [
            ESideLocation.NONE,
            ESideLocation.TOP,
            ESideLocation.BOTTOM,
            ESideLocation.LEFT,
            ESideLocation.RIGHT
        ]
        for (let i = 0; i < sides.length; i++)
        {
            let side: SideInteractive = new SideInteractive(this)
            side.Location = sides[i]
            this.WidgetContainer.addChild(side.Graphics)
            this.sideInstances.push(side)
        }
    }

    private initalizeContainer() : void
    {
        this.Container.removeChildren()

        this.stroke.create(this.strokeOptions)
        this.Container.addChild(this.stroke.Graphics)
        this.Container.x = 0
        this.Container.y = 0
        this.Container.addChild(this.WidgetContainer)

        this.Engine.Interaction.on('mouse:up', (event) => this.onmouseup(event))
        this.Engine.Interaction.on('mouse:down', (event) => this.onmousedown(event))
        this.Engine.Interaction.on('mouse:move', (event) => this.onmousemove(event))
    }
    public strokeOptions: IStrokeOptions =
    {
        width: 2,
        color: 0xffffff,
        alignment: 1
    }

    public setTarget(target: PIXI.Container) : void
    {
        target.removeChild(this.Container)
        this.Target = target

        this.Target.addChild(this.Container)

        this.draw()
    }

    public draw() : void
    {
        let bounds = this.Target.getBounds()

        console.log(`[app.resizeableObject->draw] bounds (w,h) [${bounds.width}, ${bounds.height}]`)

        this.stroke.draw({}, bounds)
        for (let i = 0; i < this.sideInstances.length; i++)
        {
            this.sideInstances[i].draw(null, bounds)
        }
    }

    public sideInstances: SideInteractive[] = []

    //- GetterSetter.SideStatus
    private _sideStatus: { [key in ESideLocation]?: boolean } = {}
    get SideStatus()
    {
        if (this._sideStatus[0] == undefined || this._sideStatus[0] == null)
        {
            this._sideStatus = Object.fromEntries(Object.entries(ESideLocation).filter(r => typeof r[0] == 'string').map(r => [r[0], false]))
        }
        return this._sideStatus
    }
    set SideStatus(value)
    {
        this._sideStatus = value
    }

    public setSideStatus(side: ESideLocation, status: boolean) : void
    {
        console.log(`[app.resizeableObject->setSideStatus] ${ESideLocation[side]}: ${this.SideStatus[side]} -> ${status}`)
        this.SideStatus[side] = status
    }

    //- Event.Mouse.Up
    public onmouseup(event: PIXI.InteractionEvent) : void
    {   if (this.destroyed) return
    }
    //- Event.Mouse.Down
    public onmousedown(event: PIXI.InteractionEvent) : void
    {   if (this.destroyed) return
    }
    //- Event.Mouse.Move
    public onmousemove(event: PIXI.InteractionEvent) : void
    {   if (this.destroyed) return
    }
}