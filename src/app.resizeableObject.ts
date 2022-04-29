import * as PIXI from 'pixi.js'

import Engine from './engine'
import DemoBase from './demobase'

import * as _imgData from './image'

const ImageData: string[] = _imgData.Data

export default class ResizeableObject extends DemoBase
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)
    }
}