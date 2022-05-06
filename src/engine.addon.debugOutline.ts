import * as PIXI from 'pixi.js'

import Engine from './engine'
import BaseEngineAddon from './engine.addon.base'

export type IndexedObject = [PIXI.Graphics?, PIXI.Container?]
export class DebugOutlineAddon extends BaseEngineAddon
{
    public constructor (engine: Engine)
    {
        super(engine)
        this.walkChildren(this.Engine.Viewport)

        let isPaused = false
        let updateInterval = setInterval(() =>
        {
            if (this.enabled && !isPaused)
                this.update()
        }, 100)
        setInterval(() =>
        {
            if (this.enabled)
            {
                isPaused = true
                this.clean()
                this.walkChildren(s)
                isPaused = false
            }
        }, 1000)

        this.generateAxisOverlay()
        this.Container.addChild(this.AxisOverlay)

    }

    public IndexedObjects: IndexedObject[] = []
    public AxisOverlay: PIXI.Container = new PIXI.Container()

    public generateAxisOverlay (): void
    {
        this.AxisOverlay.removeChildren()

        let width = 10

        let gfx = new PIXI.Graphics()
        gfx.lineStyle(width, 0x00ff00, 1, 0.5, false)
        gfx.lineTo(1000, 0)

        gfx.lineStyle(width, 0xff0000, 1, 0.5, false)
        gfx.lineTo(0, 1000)
        
        gfx.lineStyle(width, 0xffff00, 1, 0.5, false)
        gfx.lineTo(1000, 1000)

        gfx.x = 0
        gfx.y = 0
        this.AxisOverlay.x = 0
        this.AxisOverlay.y = 0

        this.AxisOverlay.addChild(gfx)
    }


    public walkChildren (object: PIXI.Container): void
    {
        if (object == this.Container) return
        if (object == this.AxisOverlay) return
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
            let pos = obj[1].toGlobal(this.Engine.Viewport.position)
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
        let globalPosition = object.toGlobal(this.Engine.Viewport.position)
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
        this.walkChildren(this.Engine.Viewport)
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