import * as PIXI from 'pixi.js'
import { EventEmitter } from 'events'

import EngineRender from './engineRender'
import EngineInteraction from './engineInteraction'
import EngineMouseOverlay from './engineMouseOverlay'
import ExampleAddon from './engine.addon.example'
import DebugOutlineAddon from './engine.addon.debugOutline'

export interface IEngineAddon
{
    enabled: boolean,

    enable() : void,
    disable() : void
}
export type EngineAddonArray = [string, IEngineAddon][]
export type EngineAddonDictionary = {
    [key: string]:
    {
        enabled: boolean,
        addon: IEngineAddon
    }
}

export interface IEngine
{
    constructor(engineElement: HTMLElement, initalize: boolean) : void

    HTMLElement: HTMLElement
    Application: PIXI.Application
    Container: PIXI.Container

    Render: EngineRender
    Interaction: EngineInteraction

    MouseOverlay: EngineMouseOverlay

    initalize() : void

    beforeDestroy() : void
    destroy() : void

    setSize(width: number, height: number) : void

    registeredAddons: EngineAddonDictionary

    registerAddon(label: string, addon: IEngineAddon) : void
}
export default class Engine extends EventEmitter {
    public constructor(engineElement: HTMLElement, initalize: boolean=true)
    {
        super()
        this.HTMLElement = engineElement
        if (initalize)
            this.initalize()
    }

    public HTMLElement: HTMLElement = null
    public Application: PIXI.Application = null
    public Container: PIXI.Container = null

    public Render: EngineRender = null
    public Interaction: EngineInteraction = null

    public MouseOverlay: EngineMouseOverlay = null

    public initalize() : void
    {
        if (this.Application != null)
        {
            this.HTMLElement.removeChild(this.Application.view)
            this.destroy()
        }
        
        this.Application = new PIXI.Application({
            width: this.HTMLElement.clientWidth,
            height: this.HTMLElement.clientHeight,
            resizeTo: this.HTMLElement
        })
        this.HTMLElement.appendChild(this.Application.view)
        this.Application.stage.interactive = true
        this.Container = new PIXI.Container()

        this.Container.interactive = true
        this.Application.stage.addChild(this.Container)

        this.Render = new EngineRender(this)
        this.Interaction = new EngineInteraction(this)
        this.registerAddon('cursorPositionOverlay', new EngineMouseOverlay(this))
        this.registerAddon('example', new ExampleAddon(this))
        this.registerAddon('debugOutline', new DebugOutlineAddon(this))
    }

    public beforeDestroy() : void
    {
        this.emit('beforeDestroy')
    }
    public destroy() : void
    {
        this.beforeDestroy()
        this.emit('destroy')
        this.Application.destroy()
        this.removeAllListeners()
    }


    public setSize(width: number, height: number) : void
    {
        this.Application.stage.width = width
        this.Application.stage.height = height
        this.Application.view.style.width = `${width}px`
        this.Application.view.style.height = `${height}px`
    }

    public registeredAddons: EngineAddonDictionary = {}

    public setAddon(label: string, enable: boolean) : void
    {
        console.log(`[engine->setAddon] label: ${label} -> enable: ${enable}`)
        if (this.registeredAddons[label] == undefined)
            return
        if (this.registeredAddons[label].enabled == enable)
            return
        this.registeredAddons[label].enabled = enable
        if (enable)
            this.registeredAddons[label].addon.enable()
        else
            this.registeredAddons[label].addon.disable()
    }
    public registerAddon(label: string, addon: IEngineAddon) : void
    {
        this.emit('beforeregisterAddon')
        this.registeredAddons[label] = {
            enabled: false,
            addon
        }
        this.emit('registerAddon')
    }
}