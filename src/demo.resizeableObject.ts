import * as PIXI from 'pixi.js'

import Engine from './engine'
import DemoBase from './demobase'

import ResizeableObject from './app.resizeableObject/index'

import { TextureGenerators } from './demo.textureGenerators'

export class DemoResizeableObject extends DemoBase
{
    public constructor (engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)

        this.DemoInstance = new ResizeableObject(engine, this.Container)
        this.Initalize()
    }

    public DemoInstance: ResizeableObject
    public Target: PIXI.IDisplayObjectExtended
    public TargetContainer: PIXI.Container

    public async fetchGeneratorImage (index: number, scale: PIXI.Point = new PIXI.Point(1, 1)): Promise<PIXI.Sprite>
    {
        let item = TextureGenerators[index]()
        item.setTransform()
        let bounds = item.getBounds()
        let renderTexture = PIXI.RenderTexture.create({ width: bounds.width + bounds.x, height: bounds.height + bounds.y })
        this.Engine.Application.renderer.render(item, { renderTexture })

        let sprite = new PIXI.Sprite(renderTexture)
        sprite.scale.set(scale.x, scale.y)
        sprite.x = 0
        sprite.y = 0
        return sprite
    }

    public async Initalize (): Promise<void>
    {
        this.TargetContainer = new PIXI.Container()
        this.Target = await this.fetchGeneratorImage(0, new PIXI.Point(10, 10))
        let targetBounds = this.Target.getBounds()
        this.TargetContainer.x = 100
        this.TargetContainer.y = 100
        this.TargetContainer.width = targetBounds.width
        this.TargetContainer.height = targetBounds.height
        this.TargetContainer.addChild(this.Target)
        let spriteBounds = this.Target.getBounds()
        this.TargetContainer.width = spriteBounds.width / 10
        this.TargetContainer.height = spriteBounds.height / 10
        this.DemoInstance.setTarget(this.TargetContainer)
        this.Container.addChild(this.DemoInstance.Container)
    }
}
export default DemoResizeableObject