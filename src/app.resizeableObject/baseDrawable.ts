import * as PIXI from 'pixi.js'

import { IResizeableObject } from './index'

export interface IBaseDrawable
{
    draw (options: any, bounds: PIXI.Rectangle): void
    Graphics: PIXI.Graphics
    ResizeableObject: IResizeableObject
}
export abstract class BaseDrawable implements IBaseDrawable
{
    public abstract draw (options: any, bounds: PIXI.Rectangle): void

    public Graphics: PIXI.Graphics = new PIXI.Graphics()
    public ResizeableObject: IResizeableObject = null
}
export default BaseDrawable