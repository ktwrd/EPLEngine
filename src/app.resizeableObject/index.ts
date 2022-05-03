import * as PIXI from 'pixi.js'

import Engine from '../engine'
import DemoBase, { IDemoBase } from '../demobase'

import ResizeableObjectStroke from './stroke'
import SideInteractive, { ESideLocation } from './sideInteractive'

export interface IResizeableObject
{
    stroke: ResizeableObjectStroke
    strokeOptions: IStrokeOptions

    TargetContainer: PIXI.Container
    WidgetContainer: PIXI.Container
    ProposedTarget: PIXI.Graphics

    widgetVisibility(alpha: number) : void

    setTarget(target: PIXI.IDisplayObjectExtended) : void

    draw(bounds: PIXI.Rectangle) : void
    drawProposedTarget() : void

    onmouseup(event: PIXI.InteractionEvent) : void
    onmousedown(event: PIXI.InteractionEvent) : void
    onmousemove(event: PIXI.InteractionEvent) : void

    sideHeight: number,
    sideInstances: SideInteractive[]
    SideStatus: { [key in ESideLocation]?: boolean }

    setSideStatus(side: ESideLocation, status: boolean) : void
    declaredown(side: ESideLocation) : void

    fetchCalculatedBounds(snapshot: IMouseSnapshot) : PIXI.Rectangle
    calculateBounds() : void
}

export interface IStrokeOptions extends PIXI.ILineStyleOptions
{
    width: number,
    color: number
}

export interface IMouseSnapshot
{
    cursorOffset: PIXI.Point,
    cursorPositions: [PIXI.Point, Nullable<PIXI.Point>],
    timestamps: [number, Nullable<number>],
    containerPosition: PIXI.Point,
    location: ESideLocation,
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
    public ProposedTarget: PIXI.Graphics = new PIXI.Graphics()

    private initalize() : void
    {
        this.Container = new PIXI.Container()
        this.TargetContainer = new PIXI.Container()
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
        this.Container.addChild(this.WidgetContainer)
        this.Container.addChild(this.TargetContainer)
        this.Container.addChild(this.stroke.Graphics)
        this.Container.x = 0
        this.Container.y = 0
        this.WidgetContainer.alpha = 0

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

    public widgetVisibility(alpha: number=this.WidgetContainer.alpha) : void
    {
        this.WidgetContainer.alpha = alpha
    }

    public setTarget(target: PIXI.Container) : void
    {
        this.Container.x = target.x
        this.Container.y = target.y
        target.x = 0
        target.y = 0
        this.TargetContainer.removeChildren()
        this.TargetContainer.addChild(target)

        this.draw()
    }

    public draw(bounds: PIXI.Rectangle=this.TargetContainer.getBounds()) : void
    {

        console.log(`[app.resizeableObject->draw] bounds (w,h) [${bounds.width}, ${bounds.height}]`)

        let strokeBounds = new PIXI.Rectangle(0, 0, bounds.width, bounds.height)
        this.stroke.draw({}, strokeBounds)
        for (let i = 0; i < this.sideInstances.length; i++)
        {
            this.sideInstances[i].Height = this.sideHeight
            this.sideInstances[i].draw(null, bounds)
        }

        this.drawProposedTarget()
    }
    public drawProposedTarget() : void
    {
        this.ProposedTarget.clear()
        this.ProposedTarget.lineStyle(1, 0xffffff, 0.8, 1, true)
        this.ProposedTarget.drawRect(0, 0, 8, 8)
        this.ProposedTarget.x = 0
        this.ProposedTarget.y = 0

        this.ProposedTarget.alpha = 0
    }

    public sideHeight: number = 16
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
        if (status)
        {
            this.declaredown(side)
        }
    }

    public declaredown(side: ESideLocation) : void
    {
        this.mouseSnapshot = {
            cursorOffset: new PIXI.Point(
                this.Engine.Interaction.MousePosition.data.global.x - this.Container.x,
                this.Engine.Interaction.MousePosition.data.global.y - this.Container.y
            ),
            cursorPositions: [
                new PIXI.Point(this.Engine.Interaction.MousePosition.data.global.x, this.Engine.Interaction.MousePosition.data.global.y),
                null
            ],
            timestamps: [
                Date.now(),
                null
            ],
            containerPosition: new PIXI.Point(this.Container.x, this.Container.y),
            location: side
        }
        console.log(`[app.resizeableObject->declaredown] pos: { [${this.mouseSnapshot.cursorPositions[0].x}, ${this.mouseSnapshot.cursorPositions[0].y}], null } ts: { ${this.mouseSnapshot.timestamps[0]}, null }, sd: ${ESideLocation[this.mouseSnapshot.location]}`)
    }

    private mouseSnapshot: IMouseSnapshot = null

    //- Event.Mouse.Up
    public onmouseup(event: PIXI.InteractionEvent) : void
    {   if (this.destroyed) return
        if (this.mouseSnapshot == null) return
        this.mouseSnapshot.cursorPositions[1] = new PIXI.Point(event.data.global.x, event.data.global.y)
        this.mouseSnapshot.timestamps[1] = Date.now()

        let distance = {
            x: this.mouseSnapshot.cursorPositions[1].x - this.mouseSnapshot.cursorPositions[0].x,
            y: this.mouseSnapshot.cursorPositions[1].y - this.mouseSnapshot.cursorPositions[0].y
        }
        console.log(`[app.resizeableObject->onmouseup] distance [${distance.x}, ${distance.y}]`)

        if (this.stroke.Graphics.x < 0)
            this.Container.x -= this.stroke.Graphics.x
        if (this.stroke.Graphics.y < 0)
            this.Container.y -= this.stroke.Graphics.y

        this.calculateBounds()

        this.mouseSnapshot = null
    }
    //- Event.Mouse.Down
    public onmousedown(event: PIXI.InteractionEvent) : void
    {   if (this.destroyed) return
    }
    //- Event.Mouse.Move
    public onmousemove(event: PIXI.InteractionEvent) : void
    {   if (this.destroyed) return
        if (this.mouseSnapshot != null)
        {
            let distance = {
                x: event.data.global.x - this.mouseSnapshot.cursorPositions[0].x,
                y: event.data.global.y - this.mouseSnapshot.cursorPositions[0].y
            }
            if (this.mouseSnapshot.location == ESideLocation.NONE)
            {
                this.Container.x = event.data.global.x - this.mouseSnapshot.cursorOffset.x
                this.Container.y = event.data.global.y - this.mouseSnapshot.cursorOffset.y
            }
            else
            {
                let b = this.fetchCalculatedBounds({ ...this.mouseSnapshot, cursorPositions: [this.mouseSnapshot.cursorPositions[0], new PIXI.Point(event.data.global.x, event.data.global.y)]})
                b.x = this.Container.x == b.x ? 0 : event.data.global.x - this.mouseSnapshot.cursorPositions[0].x
                b.y = this.Container.y == b.y ? 0 : event.data.global.y - this.mouseSnapshot.cursorPositions[0].y
                this.stroke.draw({}, b)
            }
        }
    }

    public fetchCalculatedBounds(snapshot: IMouseSnapshot) : PIXI.Rectangle
    {
        let distance = {
            x: snapshot.cursorPositions[1].x - snapshot.cursorPositions[0].x,
            y: snapshot.cursorPositions[1].y - snapshot.cursorPositions[0].y
        }
        let bounds = this.TargetContainer.getBounds()
        let proposedBounds = new PIXI.Rectangle(
            this.Container.getBounds().x,
            this.Container.getBounds().y,
            this.TargetContainer.getBounds().width,
            this.TargetContainer.getBounds().height)
        switch (snapshot.location)
        {
            case ESideLocation.BOTTOM:
                proposedBounds.height += distance.y
                break
            case ESideLocation.RIGHT:
                proposedBounds.width += distance.x
                break
            case ESideLocation.TOP:
                proposedBounds.height -= distance.y
                if (distance.y < bounds.height)
                {
                    proposedBounds.y += distance.y
                }
                break
            case ESideLocation.LEFT:
                proposedBounds.width -= distance.x
                proposedBounds.x += distance.x
                break
        }

        if (proposedBounds.width < this.sideHeight * 2)
            proposedBounds.width = this.sideHeight * 2
        if (proposedBounds.height < this.sideHeight * 2)
            proposedBounds.height = this.sideHeight * 2
        let sh_width = proposedBounds.width < this.sideHeight * 2
        let sh_height = proposedBounds.height < this.sideHeight * 2

        if (sh_height || sh_width)
        {
            if (sh_height)
            {
                switch (snapshot.location)
                {
                    case ESideLocation.TOP:
                        proposedBounds.y = bounds.y + (bounds.height - this.sideHeight * 2)
                        break
                }
                proposedBounds.height = this.sideHeight * 2
            }
            if (sh_width)
            {
                switch (snapshot.location)
                {
                    case ESideLocation.LEFT:
                        proposedBounds.x = bounds.x + (bounds.width - this.sideHeight * 2)
                        break
                }
                proposedBounds.width = this.sideHeight * 2
            }
        }
        else
        {
            proposedBounds.y = proposedBounds.y + 0.5
            proposedBounds.x = proposedBounds.x + 0.5
        }
        return proposedBounds
    }

    public calculateBounds() : void
    {
        if (this.mouseSnapshot == null) return
        let newBounds: PIXI.Rectangle = this.fetchCalculatedBounds(this.mouseSnapshot)
        this.Container.x = newBounds.x
        this.Container.y = newBounds.y
        if (newBounds.width != this.Container.getBounds().width)
            this.TargetContainer.width = newBounds.width
        if (newBounds.height != this.Container.getBounds().height)
            this.TargetContainer.height = newBounds.height

        
        this.draw(newBounds)
        this.draw()
    }
}