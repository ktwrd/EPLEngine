import * as PIXI from 'pixi.js'

import ResizeableObject from './index'

export interface IStrokeOptions extends PIXI.ILineStyleOptions
{
    width?: number,
    color?: number
}
export const IStrokeOptionsDefault: IStrokeOptions =
{
    cap: PIXI.LINE_CAP.BUTT,
    join: PIXI.LINE_JOIN.MITER,
    miterLimit: 10,
    native: false,
    width: 2,

    alpha: 1,
    color: 0xffffff,
    matrix: null
}

export interface IResizeableObjectStroke
{
    create(options: IStrokeOptions, bounds: PIXI.Rectangle) : void
    draw(options: IStrokeOptions, bounds: PIXI.Rectangle) : void
    dirtyDraw(bounds: PIXI.Rectangle) : void

    ResizeableObject: ResizeableObject
    Graphics: PIXI.Graphics
    Options: IStrokeOptions
}
export default class ResizeableObjectStroke implements IResizeableObjectStroke
{
    public constructor(parent: ResizeableObject)
    {
        this.ResizeableObject = parent
    }

    public ResizeableObject: ResizeableObject = null
    public Graphics: PIXI.Graphics = null

    private options: IStrokeOptions = { ...IStrokeOptionsDefault }
    get Options() 
    {
        return this.options
    }
    set Options(value: IStrokeOptions)
    {
        this.options = { ...IStrokeOptionsDefault, ...this.options, ...value }
    }

    public create(options: IStrokeOptions, bounds: PIXI.Rectangle=new PIXI.Rectangle()) : void
    {
        if (this.Graphics == null)
            this.Graphics = new PIXI.Graphics()
        this.Graphics.x = 0
        this.Graphics.y = 0

        this.draw(options, bounds)
    }

    public draw(options: IStrokeOptions={}, bounds: PIXI.Rectangle=new PIXI.Rectangle()) : void
    {
        this.Options = options

        let positions = [
            [0, 0],
            [bounds.width, 0],
            [bounds.width, bounds.height],
            [0, bounds.height],
            [0, 0]
        ]
        this.Graphics.clear()

        this.Graphics.lineStyle(this.Options)

        for (let i = 0; i < positions.length; i++)
        {
            let curr = positions[i]
            let next = positions[i + 1]
            this.Graphics.moveTo(curr[0], curr[1])
            if (next != undefined)
                this.Graphics.lineTo(next[0], next[1])
        }
    }

    public dirtyDraw(bounds: PIXI.Rectangle=new PIXI.Rectangle()) : void
    {
        this.Graphics.width = bounds.width
        this.Graphics.height = bounds.height
    }
}