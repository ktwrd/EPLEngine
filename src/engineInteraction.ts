import * as PIXI from 'pixi.js'

import { EventEmitter } from 'events'
import Engine from './engine'

export default class EngineInteraction extends EventEmitter
{
    public constructor (engine: Engine, emitEvents: boolean = true)
    {
        super()
        this.Engine = engine
        this.enableEmit = emitEvents
        this.Initalize()

        this.Engine.Application.view.addEventListener('mousedown', () => this.emit('mouse:down', this.MousePosition))
        this.Engine.Application.view.addEventListener('mouseup', () => this.emit('mouse:up', this.MousePosition))

        this.Engine.Application.stage.on('mousemove', (event: PIXI.InteractionEvent) => this.MousePosition = event)
    }

    public MousePosition: PIXI.InteractionEvent
    public enableEmit: boolean = true

    public AliasedEvents = {
        'mousemove': 'mouse:move',
        'mousedown': 'mouse:down',
        'mouseup': 'mouse:up',
        'mousecontext': 'mouse:context'
    }

    public Initalize (): void
    {
        let entries = Object.entries(this.AliasedEvents)
        for (let i = 0; i < entries.length; i++)
        {
            let item = entries[i]
            this.Engine.Application.stage.on(
                item[0],
                (...param) => 
                {
                    if (this.enableEmit)
                        this.emit(item[1], ...param)
                })
        }
    }

    public destroy (): void
    {
        this.removeAllListeners()
    }

    public Engine: Engine = null
}