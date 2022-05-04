import * as PIXI from 'pixi.js'

import { IResizeableObject } from './index'

export default interface IBaseDrawable
{
    draw (options: any, bounds: PIXI.Rectangle): void
    Graphics: PIXI.Graphics
    ResizeableObject: IResizeableObject
}