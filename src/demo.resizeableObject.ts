import * as PIXI from 'pixi.js'

import Engine from './engine'
import DemoBase from './demobase'

import * as _imgData from './image'
import ResizeableObject from './app.resizeableObject'

const ImageData: string[] = _imgData.Data

export default class DemoResizeableObject extends DemoBase
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)

        this.DemoInstance = new ResizeableObject(engine, this.Container)
        this.Initalize()
    }

    public DemoInstance: ResizeableObject
    public Target: PIXI.IDisplayObjectExtended

    public async fetchTestImage(index: number, scale: PIXI.Point = new PIXI.Point(1, 1)) : Promise<PIXI.Sprite>
    {
        let teture = await PIXI.Texture.fromURL(ImageData[0])
        let sprite = new PIXI.Sprite(teture)
        sprite.scale.set(scale.x, scale.y)
        sprite.x = 0
        sprite.y = 0
        return sprite
    }
    public async Initalize() : Promise<void>
    {
        this.Target = await this.fetchTestImage(0, new PIXI.Point(0.1, 0.1))
        this.DemoInstance.setTarget(this.Target)
    }
}