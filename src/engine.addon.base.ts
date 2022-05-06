import * as PIXI from 'pixi.js'

import Engine, { IEngineAddon } from './engine'

export class BaseEngineAddon implements IEngineAddon
{
    public constructor (engine: Engine)
    {
        this.Engine = engine
    }

    public Engine: Engine
    public Container: PIXI.Container = new PIXI.Container()

    public enabled: boolean = false
    public enable (): void
    {
        if (this.enabled) return
        this.enabled = true
        
        this.Engine.Viewport.addChild(this.Container)
    }
    public disable (): void
    {
        if (!this.enabled) return
        this.enabled = false

        this.Engine.Viewport.removeChild(this.Container)
    }
}
export default BaseEngineAddon