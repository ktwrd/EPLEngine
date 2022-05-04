import * as PIXI from 'pixi.js'

export function enumKeysAsString<TEnum> (theEnum: TEnum): keyof TEnum
{
    // eliminate numeric keys
    const keys = Object.keys(theEnum).filter(x =>
        (+x) + "" !== x) as (keyof TEnum)[]
    // return some random key
    return keys[Math.floor(Math.random() * keys.length)]
}
export function numberSnapToGrid (point: number, gridSize: number): number
{
    return Math.round(point / gridSize) * gridSize
}
export function pointSnapToGrid (point: PIXI.Point, gridSize: number): PIXI.Point
{
    return new PIXI.Point(
        numberSnapToGrid(point.x, gridSize),
        numberSnapToGrid(point.y, gridSize)
    )
}