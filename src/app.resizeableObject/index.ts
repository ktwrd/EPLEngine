import * as PIXI from 'pixi.js'

import Engine from '../engine'
import DemoBase, { IDemoBase } from '../demobase'

import ResizeableObjectStroke from './stroke'

export interface IResizeableObject
{
    stroke: ResizeableObjectStroke
    strokeOptions: IStrokeOptions

    TargetContainer: PIXI.Container
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
    public TargetContainer: PIXI.Container = null
    public WidgetContainer: PIXI.Container = null

    private initalize() : void
    {
        this.TargetContainer = new PIXI.Container()
        this.WidgetContainer = new PIXI.Container()
        this.stroke = new ResizeableObjectStroke(this)

        this.initalizeContainer()
    }

    private initalizeContainer() : void
    {
        this.Container.removeChildren()

        this.stroke.create(this.strokeOptions)
        this.Container.addChild(this.stroke.Graphics)
        this.Container.x = 0
        this.Container.y = 0
        this.Container.addChild(this.TargetContainer)
        this.Container.addChild(this.WidgetContainer)

        this.Engine.Interaction.on('mouse:up', (event) => this.onmouseup(event))
        this.Engine.Interaction.on('mouse:move', (event) => this.onmousemove(event))
        this.Engine.Interaction.on('mouse:move', (event) => this.onmousemove(event))
    }
    public strokeOptions: IStrokeOptions =
    {
        width: 2,
        color: 0xffffff,
        alignment: 1
    }

    public setTarget(target: PIXI.IDisplayObjectExtended) : void
    {
        this.TargetContainer.removeChildren()
        this.TargetContainer.addChild(target)

        this.draw()
    }

    public draw() : void
    {

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