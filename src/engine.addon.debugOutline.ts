import * as PIXI from 'pixi.js'

import Engine from './engine'
import BaseEngineAddon from './engine.addon.base'

export type IndexedObject = [PIXI.Graphics?, PIXI.Container?]
export class DebugOutlineAddon extends BaseEngineAddon
{
    public constructor (engine: Engine)
    {
        super(engine)
        this.walkChildren(this.Engine.Application.stage)

        let isPaused = false
        let updateInterval_f = () =>
        {
            if (this.enabled && !isPaused)
                this.update()
        }
        let updateInterval = setInterval(updateInterval_f, 100)
        setInterval(() =>
        {
            if (this.enabled)
            {
                isPaused = true
                this.clean()
                this.walkChildren(this.Engine.Application.stage)
                isPaused = false
            }
        }, 1000)

    }

    public IndexedObjects: IndexedObject[] = []

    public walkChildren (object: PIXI.Container): void
    {
        if (object == this.Container) return
        for (let i = 0; i < object.children.length; i++)
        {
            let child: any = object.children[i]
            this.IndexedObjects.push(this.initalizeObject(child))
            if (child.children != undefined && child.children.length > 0)
                this.walkChildren(child)
        }
    }

    public update (): void
    {
        for (let i = 0; i < this.IndexedObjects.length; i++)
        {
            let obj = this.IndexedObjects[i]
            let pos = obj[1].getGlobalPosition()
            obj[0].width = obj[1].width
            obj[0].height = obj[1].height
            obj[0].scale = obj[1].scale
            obj[0].x = pos.x
            obj[0].y = pos.y
        }
    }

    public initalizeObject (object: PIXI.Container): IndexedObject
    {
        let result: IndexedObject = [null, null]

        result[1] = object
        let bounds = object.getBounds()
        let globalPosition = object.getGlobalPosition()
        let gfx = new PIXI.Graphics()
        gfx.lineStyle(1, 0xff0000, 1, 0, true)
        gfx.drawRect(0, 0, bounds.width, bounds.height)
        gfx.x = globalPosition.x
        gfx.y = globalPosition.y
        gfx.scale = object.scale
        result[0] = gfx
        this.Container.addChild(result[0])

        return result
    }

    public clean (): void
    {
        for (let i = 0; i < this.IndexedObjects.length; i++)
        {
            this.IndexedObjects[i][0].parent.removeChild(this.IndexedObjects[i][0])
        }
        this.Container.removeChildren()
        this.IndexedObjects = []
    }

    public enable (): void
    {
        super.enable()
        if (!this.enabled) return
        this.clean()
        this.walkChildren(this.Engine.Application.stage)
        this.update()
    }
    public disable (): void
    {
        super.disable()
        if (this.enabled) return
        this.clean()
    }
}
export default DebugOutlineAddon