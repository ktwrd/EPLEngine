import * as PIXI from 'pixi.js'
import EventEmitter from 'events'

import Engine from './engine'
import { EngineMouseState } from './engineMouseOverlay'
import DemoBase from './demobase'

import * as _imgData from './image'

const ImageData: string[] = _imgData.Data

export interface IWidgetAnchor
{
    point?: PIXI.Point,
    position: string,
    graphics?: PIXI.Graphics,
    generatePoint() : PIXI.Point
}

export default class RectangleResize extends DemoBase
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)
        this.proc()
    }

    private async proc() : Promise<void>
    {
        this.square = new PIXI.Graphics()
        this.square.lineStyle(1, 0xffffff, 1)
        this.square.drawRect(0, 0, 255, 255)
        this.square.x = 100
        this.square.y = 100
        console.log(_imgData)
        let teture = await PIXI.Texture.fromURL(ImageData[0])
        let sprite = new PIXI.Sprite(teture)
        sprite.width = 256
        sprite.height = 108
        sprite.x = 100
        sprite.y = 100

        this.Target = sprite
        this.Target.interactive = true
        this.Target.on('mousedown', (event) => this.target_onmousedown(event))
        this.Target.on('mouseup', (event) => this.target_onmouseup(event))

        this.Container.addChild(this.Target)
        this.anchorContainer = new PIXI.Container()
        this.ContainerOutline = new PIXI.Graphics()
        this.ContainerOutline.lineStyle(1, 0xffffff, 1, 0.5, true)
        this.ContainerOutline.drawRect(0, 0, this.Target.width, this.Target.height)
        this.ContainerOutline.x = this.Target.x
        this.ContainerOutline.y = this.Target.y
        this.Container.addChild(this.ContainerOutline)

        this.Container.addChild(this.anchorContainer)

        this.initalizeAnchors()

        this.Initalize()

        this.widgetEventEmitter = new EventEmitter()

        this.widgetEventEmitter.on('mouseup', (p1, p2, p3) => this.widget_onmouseup(p1, p2, p3))
        this.widgetEventEmitter.on('mousedown', (p1, p2, p3) => this.widget_onmousedown(p1, p2, p3))
        this.Engine.Interaction.on('mouse:move', (event) => this.onmousemove(event))
        this.Engine.Interaction.on('mouse:up', (event) => this.global_mouseup(event))
    }

    public enableMouseFollow: string[] = []
    public ContainerOutline: PIXI.Graphics = null

    private calculateBox(widget: IWidgetAnchor) : void
    {
        this.enableMouseFollow = this.enableMouseFollow.filter(m => m != widget.position)

        let targetWidth = 0
        let targetHeight = 0

        targetWidth = this.Target.width - (widget.point.x - widget.graphics.x)
        targetHeight = this.Target.height - (widget.point.y - widget.graphics.y)

        if (targetWidth < 0 || targetHeight < 0)
        {
            targetWidth = this.Target.width
            targetHeight = this.Target.height
        }
        else
        {
            if (widget.position.endsWith('left'))
            {
                if (widget.point.x - widget.graphics.x < 0)
                {
                    this.Target.x += Math.abs(widget.point.x - widget.graphics.x)
                    targetWidth -= Math.abs(widget.point.x - widget.graphics.x) * 2
                }
                else
                {
                    this.Target.x -= widget.point.x - widget.graphics.x
                    targetWidth = this.Target.width + Math.abs(widget.point.x - widget.graphics.x)
                }
            }
            if (widget.position.startsWith('top'))
            {
                if (widget.point.y - widget.graphics.y < 0)
                {
                    this.Target.y += Math.abs(widget.point.y - widget.graphics.y)
                    targetHeight -= Math.abs(widget.point.y - widget.graphics.y) * 2
                }
                else
                {
                    this.Target.y -= widget.point.y - widget.graphics.y
                    targetHeight = this.Target.height + Math.abs(widget.point.y - widget.graphics.y)
                }
            }
        }
        this.Target.width = targetWidth
        this.Target.height = targetHeight
        this.initalizeAnchors()
        this.redrawAnchors()
    }

    private widget_onmousedown(event: PIXI.InteractionEvent, i: number, widget: IWidgetAnchor) : void
    {
        if (this.destroyed) return
        this.enableMouseFollow = this.enableMouseFollow.filter(m => m != widget.position)
        this.enableMouseFollow.push(widget.position)
    }
    private widget_onmouseup(event: PIXI.InteractionEvent, i: number, widget: IWidgetAnchor) : void
    {
        if (this.destroyed) return
        return
        this.calculateBox(widget)
    }

    private target_onmousedown(event: PIXI.InteractionEvent) : void
    {
        if (this.destroyed) return
        if (event.target == this.Target)
        {
            this.MoveTarget = true
            this.MoveTargetOffset = new PIXI.Point(event.data.global.x - event.target.x, event.data.global.y - event.target.y)
        }
    }
    private target_onmouseup(event: PIXI.InteractionEvent) : void
    {
        if (this.destroyed) return
        this.MoveTarget = false
        this.Target.x = event.data.global.x - this.MoveTargetOffset.x
        this.Target.y = event.data.global.y - this.MoveTargetOffset.y
        this.initalizeAnchors()
        this.redrawAnchors()
    }

    private global_mouseup(event: PIXI.InteractionEvent) : void
    {
        if (this.destroyed) return
        if (this.MoveTarget == true)
        {
            this.Target.x = event.data.global.x - this.MoveTargetOffset.x
            this.Target.y = event.data.global.y - this.MoveTargetOffset.y
            this.initalizeAnchors()
            this.redrawAnchors()
            this.MoveTarget = false
        }

        if (this.enableMouseFollow.length > 0)
        {
            for (let i = 0; i < this.enableMouseFollow.length; i++)
            {
                let filtered = this.WidgetAnchors.filter(a => a.position == this.enableMouseFollow[i])
                if (filtered.length > 0)
                {
                    this.calculateBox(filtered[0])
                }
            }
            this.initalizeAnchors()
            this.redrawAnchors()
        }
    }

    private MoveTarget: boolean = false
    private MoveTargetOffset: PIXI.Point = null

    private onmousemove(event: PIXI.InteractionEvent) : void
    {
        if (this.destroyed) return
        if (this.enableMouseFollow.length > 0)
        {
            this.ContainerOutline.x = this.Target.x
            this.ContainerOutline.y = this.Target.y
            this.ContainerOutline.width = this.Target.width
            this.ContainerOutline.height = this.Target.height
            for (let i = 0; i < this.enableMouseFollow.length; i++)
            {
                let target = this.getAnchor(this.enableMouseFollow[i])
                if (target == null)
                    continue
                target.graphics.x = event.data.global.x
                target.graphics.y = event.data.global.y
            }
        }

        if (this.MoveTarget)
        {
            this.Target.x = event.data.global.x - this.MoveTargetOffset.x
            this.Target.y = event.data.global.y - this.MoveTargetOffset.y
            this.updateAnchorPosition()
        }
        if (this.Target != undefined && this.ContainerOutline != undefined)
        {
            this.ContainerOutline.x = this.Target.x
            this.ContainerOutline.y = this.Target.y
            this.ContainerOutline.width = this.Target.width
            this.ContainerOutline.height = this.Target.height
        }
    }


    public Target: PIXI.Sprite = null

    public Initalize() : void
    {
        if (this.destroyed) return
        this.initalizeAnchors()
        this.redrawAnchors()
    }

    public InitalizeEvents() : void
    {
        if (this.destroyed) return
        let cursorMap: string[][] = [
            ['top.left', 'nw-resize'],
            ['top.right', 'ne-resize'],
            ['bottom.left', 'sw-resize'],
            ['bottom.right', 'se-resize']
        ]
        for (let i = 0; i < this.WidgetAnchors.length; i++)
        {
            let widget = this.WidgetAnchors[i]
            if (widget == null || widget.graphics == null) continue
            let targetCursor: string = Object.fromEntries(cursorMap)[widget.position] == undefined ? 'default' : Object.fromEntries(cursorMap)[widget.position]
            widget.graphics.cursor = targetCursor
            widget.graphics.removeAllListeners()
            let eventAlias = [
                'mousedown',
                'mouseup',
                'mousemove',
                'mouseover'
            ]
            for (let x = 0; x < eventAlias.length; x++)
            {
                widget.graphics.on(eventAlias[x], (event) => this.widgetEventEmitter.emit(eventAlias[x], event, i, widget))
            }
        }
    }

    private widgetEventEmitter: EventEmitter = null

    private anchorContainer: PIXI.Container = null

    private getAnchor(label: string) : IWidgetAnchor
    {
        if (this.destroyed) return
        for (let i = 0; i < this.WidgetAnchors.length; i++)
        {
            if (this.WidgetAnchors[i] != null)
            {
                if (this.WidgetAnchors[i].position == label)
                    return this.WidgetAnchors[i]
            }
        }
        return null
    }

    private setAnchor(data: IWidgetAnchor) : IWidgetAnchor
    {
        if (this.destroyed) return
        for (let i = 0; i < this.WidgetAnchors.length; i++)
        {
            if (this.WidgetAnchors[i] != null)
            {
                if (this.WidgetAnchors[i].position == data.position)
                {
                    this.WidgetAnchors[i] = { ...this.WidgetAnchors[i], ...data}
                    return this.WidgetAnchors[i]
                }                
            }
        }
        return null
    }

    public drawWidget(widget: PIXI.Graphics) : PIXI.Graphics
    {
        if (this.destroyed) return
        widget.clear()
        widget.beginFill(0, 1)
        widget.lineStyle(1, 0xffffffff, 1)
        widget.drawRect(0, 0, this.WidgetWidth, this.WidgetWidth)
        widget.endFill()
        widget.interactive = true
        return widget
    }

    private initalizeAnchors() : void
    {
        if (this.destroyed) return
        let anchors: IWidgetAnchor[] = [
            {
                position: 'top.left',
                generatePoint: (): PIXI.Point =>
                {
                    return new PIXI.Point(this.Target.x, this.Target.y)
                }
            },
            {
                position: 'top.right',
                generatePoint: (): PIXI.Point =>
                {
                    return new PIXI.Point(this.Target.x + this.Target.width, this.Target.y)
                }
            },
            {
                position: 'bottom.left',
                generatePoint: (): PIXI.Point =>
                {
                    return new PIXI.Point(this.Target.x, this.Target.y + this.Target.height)
                }
            },
            {
                position: 'bottom.right',
                generatePoint: (): PIXI.Point =>
                {
                    return new PIXI.Point(this.Target.x + this.Target.width, this.Target.y + this.Target.height)
                }
            }
        ]
        this.WidgetAnchors = anchors
        this.updateAnchorPosition()
    }
    private redrawAnchors() : void
    {
        if (this.destroyed) return
        let widgetLabels: string[] = [
            'bottom.left',
            'bottom.right',
            'top.left',
            'top.right',
        ]
        if (this.anchorContainer == null)
            this.anchorContainer = new PIXI.Container()
        this.anchorContainer.removeChildren()
        for (let i = 0; i < widgetLabels.length; i++)
        {
            let g = new PIXI.Graphics()
            g.name = widgetLabels[i]
            g = this.drawWidget(g)
            let anchor: IWidgetAnchor = this.getAnchor(widgetLabels[i])
            if (anchor != null)
            {
                g.x = anchor.point.x - (g.width / 2)
                g.y = anchor.point.y - (g.height / 2)
                this.setAnchor({
                    ...anchor,
                    graphics: g
                })
                g.interactive = true
                this.anchorContainer.addChild(g)
            }
        }
        this.ContainerOutline.clear()
        this.ContainerOutline.lineStyle(1, 0xffffff, 1, 0.5, true)
        this.ContainerOutline.drawRect(0, 0, this.Container.width - this.WidgetWidth, this.Container.height - this.WidgetWidth)
        this.ContainerOutline.x = this.Target.x
        this.ContainerOutline.y = this.Target.y

        this.InitalizeEvents()
    }
    private updateAnchorPosition() : void
    {
        if (this.Target == undefined || this.Target == null) return
        for (let i = 0; i < this.WidgetAnchors.length; i++)
        {
            let anchor: IWidgetAnchor = this.WidgetAnchors[i]
            anchor.point = anchor.generatePoint()
            if (anchor.graphics != null)
            {
                anchor.graphics.x = anchor.point.x - (this.WidgetWidth / 2)
                anchor.graphics.y = anchor.point.y - (this.WidgetWidth / 2)
            }
            this.WidgetAnchors[i] = anchor
        }
    }

    public destroy() : void
    {
        super.destroy()
    }

    public WidgetWidth: number = 12

    public square: PIXI.Graphics = null

    public Widgets: PIXI.Graphics[] = [null, null, null, null]

    public WidgetAnchors: IWidgetAnchor[] = []

    public bottomLeft: PIXI.Graphics = null
    public bottomRight: PIXI.Graphics = null
    public topLeft: PIXI.Graphics = null
    public topRight: PIXI.Graphics = null
}