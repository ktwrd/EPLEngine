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
}
export default Utilities