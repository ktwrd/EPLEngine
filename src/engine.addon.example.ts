import * as PIXI from 'pixi.js'

import Engine, {IEngineAddon} from './engine'

export default class ExampleAddon implements IEngineAddon
{
    public constructor(engine: Engine)
    {
        this.Engine = engine

        let text = new PIXI.Text('hello world!', {
            fill: 0xffffff,
            fontSize: 69
        })
        text.x = 100
        text.y = 100

        this.Container.addChild(text)
    }

    public Engine: Engine
    public Container: PIXI.Container = new PIXI.Container()

    public enabled: boolean = false
    public enable() : void
    {
        if (this.enabled) return
        this.enabled = true
        this.Engine.Application.stage.addChild(this.Container)
    }
    public disable() : void
    {
        if (!this.enabled) return
        this.enabled = false

        this.Engine.Application.stage.removeChild(this.Container)
    }
}