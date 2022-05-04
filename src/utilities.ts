import * as PIXI from 'pixi.js'
import * as EPLEngine from './index'

import { TextureGenerators } from './demo.textureGenerators'
export class Utilities
{
    public static enumKeysAsString<TEnum> (theEnum: TEnum): keyof TEnum
    {
        // eliminate numeric keys
        const keys = Object.keys(theEnum).filter(x =>
            (+x) + "" !== x) as (keyof TEnum)[]
        // return some random key
        return keys[Math.floor(Math.random() * keys.length)]
    }
    public static numberSnapToGrid (point: number, gridSize: number): number
    {
        return Math.round(point / gridSize) * gridSize
    }
    public static pointSnapToGrid (point: PIXI.Point, gridSize: number): PIXI.Point
    {
        return new PIXI.Point(
            Utilities.numberSnapToGrid(point.x, gridSize),
            Utilities.numberSnapToGrid(point.y, gridSize)
        )
    }
    public static async imageElementFromInputElement (element: HTMLInputElement): Promise<HTMLImageElement[]>
    {
        let imageArray: HTMLImageElement[] = []

        let promiseArr: Promise<void>[] = []
        for (let i = 0; i < element.files.length; i++)
        {
            promiseArr.push(new Promise((resolve) =>
            {
                let imageElement = new Image()
                let reader = new FileReader()
                reader.onload = () =>
                {
                    imageElement.src = reader.result.toString()
                    imageArray.push(imageElement)
                    resolve()
                }
                reader.readAsDataURL(element.files[i])
            }))
        }

        await Promise.all(promiseArr)

        return imageArray
    }
    public static async fetchGeneratorImage (engine: EPLEngine.Engine, index: number, scale: PIXI.Point = new PIXI.Point(1, 1)): Promise<PIXI.Sprite>
    {
        let item = TextureGenerators[index]()
        item.setTransform()
        let bounds = item.getBounds()
        let renderTexture = PIXI.RenderTexture.create({ width: bounds.width + bounds.x, height: bounds.height + bounds.y })
        engine.Application.renderer.render(item, { renderTexture })

        let sprite = new PIXI.Sprite(renderTexture)
        sprite.scale.set(scale.x, scale.y)
        sprite.x = 0
        sprite.y = 0
        return sprite
    }
}
export default Utilities