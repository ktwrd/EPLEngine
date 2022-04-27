import * as PIXI from 'pixi.js'
import { EventEmitter } from 'events'

import EngineRender from './engineRender'
import EngineInteraction from './engineInteraction'
import EngineMouseOverlay from './engineMouseOverlay'

export default class Engine extends EventEmitter {
    public constructor(engineElement: HTMLElement)
    {
        super()
        this.HTMLElement = engineElement
        this.initalize()
        engineElement.appendChild(this.Application.view)
    }

    public HTMLElement: HTMLElement = null
    public Application: PIXI.Application = null
    public Container: PIXI.Container = null

    public Render: EngineRender = null
    public Interaction: EngineInteraction = null

    public MouseOverlay: EngineMouseOverlay = null

    private initalize() : void
    {
        if (this.Application != null)
            this.destroy()
        
        this.Application = new PIXI.Application({
            width: this.HTMLElement.clientWidth,
            height: this.HTMLElement.clientHeight,
            resizeTo: this.HTMLElement
        })
        this.Application.stage.interactive = true
        this.Container = new PIXI.Container()

        this.Container.interactive = true
        this.Application.stage.addChild(this.Container)

        this.Render = new EngineRender(this)
        this.Interaction = new EngineInteraction(this)
        this.MouseOverlay = new EngineMouseOverlay(this)
    }

    public destroy() : void
    {
        this.beforeDestroy()
        this.emit('destroy')
        this.Application.destroy()
        this.removeAllListeners()
    }

    public beforeDestroy() : void
    {
        this.emit('beforeDestroy')
    }

    public setSize(width: number, height: number) : void
    {
        this.Application.stage.width = width
        this.Application.stage.height = height
        this.Application.view.style.width = `${width}px`
        this.Application.view.style.height = `${height}px`
    }
}