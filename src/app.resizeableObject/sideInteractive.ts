import * as PIXI from 'pixi.js'

import IBaseDrawable from './baseDrawable'
import ResizeableObject from './index'

import * as InteractiveBounds from './interactiveBounds'

export enum ESideLocation
{
    NONE,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}
export interface ISideInteractive
{
    ResizeableObject: ResizeableObject
    Location?: ESideLocation
    Height?: number
    getLocationMap(bounds: PIXI.Rectangle, targetHeight: number) : { [key in ESideLocation]?: number[][]; }
    draw(options: any, bounds: PIXI.Rectangle) : void

    onmousedown(event: PIXI.InteractionEvent) : void
    onmouseup(event: PIXI.InteractionEvent) : void
}
export default class SideInteractive implements IBaseDrawable, ISideInteractive
{
    public constructor(parent: ResizeableObject)
    {
        this.ResizeableObject = parent

        this.Graphics.on('mousedown', (event) => this.onmousedown(event))
        this.Graphics.on('mouseup',   (event) => this.onmouseup(event))
    }

    public ResizeableObject: ResizeableObject
    public Graphics: PIXI.Graphics = new PIXI.Graphics()
    public Location: ESideLocation = ESideLocation.NONE

    public Height: number = 16

    public getLocationMap(bounds: PIXI.Rectangle, targetHeight: number) : { [key in ESideLocation]?: number[][]; }
    {
        targetHeight = bounds.height < targetHeight ? bounds.height / 2 : targetHeight
        let _locationMap: [ESideLocation, number[][]][] = [
            [ESideLocation.NONE, [
                [targetHeight, targetHeight],
                [bounds.width - targetHeight, targetHeight],
                [bounds.width - targetHeight, bounds.height - targetHeight],
                [targetHeight, bounds.height - targetHeight],
                [targetHeight, targetHeight]
            ]],
            [ESideLocation.TOP, [
                [0, 0],
                [bounds.width, 0],
                [bounds.width - targetHeight, targetHeight],
                [targetHeight, targetHeight],
                [0, 0]
            ]],
            [ESideLocation.BOTTOM, [
                [0, bounds.height],
                [bounds.width, bounds.height],
                [bounds.width - targetHeight, bounds.height - targetHeight],
                [targetHeight, bounds.height - targetHeight],
                [0, 0]
            ]],
            [ESideLocation.LEFT, [
                [0, 0],
                [targetHeight, targetHeight],
                [targetHeight, bounds.height - targetHeight],
                [0, bounds.height],
                [0, 0]
            ]],
            [ESideLocation.RIGHT, [
                [bounds.width, 0],
                [bounds.width - targetHeight, targetHeight],
                [bounds.width - targetHeight, bounds.height - targetHeight],
                [bounds.width, bounds.height],
                [bounds.width, 0]
            ]]
        ]
        return Object.fromEntries(_locationMap)
    }

    public draw(options: any=null, bounds: PIXI.Rectangle=new PIXI.Rectangle()) : void
    {
        let targetHeight = bounds.height < this.Height ? bounds.height / 2 : this.Height
        let locationMap = this.getLocationMap(bounds, targetHeight)
        if (locationMap[this.Location] == undefined) return

        let positions = locationMap[this.Location]

        this.Graphics.clear()

        this.Graphics.beginFill(
            InteractiveBounds.ColorMap[this.Location],    // color
            1)                                                  // alpha

        this.Graphics.lineStyle(
            1,                                                  // width
            InteractiveBounds.ColorMap[this.Location],    // color
            1)                                                  // alpha

        this.Graphics.moveTo(positions[0][0], positions[0][1])
        for (let i = 0; i < positions.length; i++)
        {
            this.Graphics.lineTo(positions[i][0], positions[i][1])
        }
        this.Graphics.endFill()

        this.Graphics.interactive = true
        this.Graphics.cursor = InteractiveBounds.CursorMap[this.Location]
    }

    public onmousedown(event: PIXI.InteractionEvent) : void
    {
        this.ResizeableObject.setSideStatus(this.Location, true)
    }
    public onmouseup(event: PIXI.InteractionEvent) : void
    {
        this.ResizeableObject.setSideStatus(this.Location, false)
    }
}