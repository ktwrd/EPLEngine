import * as PIXI from 'pixi.js'
import EventEmitter from 'events'

import Engine from './engine'

export default class DemoBase extends EventEmitter
{
    public constructor(engine: Engine, parentContainer: PIXI.Container)
    {
        super()
        this.Container = new PIXI.Container()

        this.parent = parentContainer
        this.Engine = engine;

        this.parent.addChild(this.Container)
    }
    private parent: PIXI.Container = null
    public Engine: Engine = null
    public Container: PIXI.Container = null

    public destroyed: boolean = false

    public destroy() : void
    {
        this.parent.removeChild(this.Container)
        this.removeAllListeners()
        this.destroyed = true
    }
}