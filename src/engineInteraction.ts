import { EventEmitter } from 'events';
import Engine from './engine'

export default class EngineInteraction extends EventEmitter {
    public constructor(engine: Engine)
    {
        super()
        this.Engine = engine
        this.Initalize()
    }

    public AliasedEvents = {
        'mousedown': 'mouse:down',
        'mouseup': 'mouse:up',
        'mousemove': 'mouse:move',
        'mousecontext': 'mouse:context'
    }

    public Initalize() : void
    {
        let entries = Object.entries(this.AliasedEvents)
        for (let i = 0; i < entries.length; i++)
        {
            let item = entries[i]
            this.Engine.Application.stage.on(
                item[0],
                (...param) => 
                {
                    this.emit(item[1], ...param)
                })
        }
    }

    public destroy() : void
    {
        this.removeAllListeners()
    }

    public Engine: Engine = null
}