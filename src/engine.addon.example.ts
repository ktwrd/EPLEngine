import * as PIXI from 'pixi.js'

import Engine from './engine'
import BaseEngineAddon from './engine.addon.base'

export default class ExampleAddon extends BaseEngineAddon
{
    public constructor (engine: Engine)
    {
        super(engine)

        let text = new PIXI.Text('hello world!', {
            fill: 0xffffff,
            fontSize: 69
        })
        text.x = 100
        text.y = 100

        this.Container.addChild(text)
    }

    public enable (): void
    {
        super.enable()
    }
    public disable (): void
    {
        super.disable()
    }
}