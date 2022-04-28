import * as PIXI from 'pixi.js'

import Engine from './engine'
import DemoBase from './demobase'

function fx(a: number, x: number): number
{
    const x2 = x * x
    const top = 2 * (1 - a) * x2
    const bottom = 1 + x2
    return (a * x) + (top / bottom)
}

export interface IMiraParams
{
    a: number,
    b: number,
    x: number,
    y: number,
    maxIteration: number,
    scale: number
}
export const IMiraParamsDefault: IMiraParams = {
    a: 0.16,
    b: 0.9998,
    x: 0.0,
    y: 0.0,
    maxIteration: 10000,
    scale: 10
}

export interface IMiraYieldPoint
{
    x: number,
    y: number
}
export interface IMiraYield
{
    current: number,
    point: IMiraYieldPoint
}

function* mira(params: IMiraParams): Generator<IMiraYield>
{
    params = { ...IMiraParamsDefault, ...params }

    let xn: number = params.x
    let yn: number = params.y

    for (let i = 0; i < params.maxIteration; i++)
    {
        let previousX = xn

        xn = params.b * yn + fx(params.a, previousX);
        yn = -previousX + fx(params.a, xn);

        yield {
            current: i,
            point: {
                x: xn * params.scale,
                y: yn * params.scale 
            }
        };
    }
}

export default class FractalDemo extends DemoBase
{
    public constructor(engine: Engine, parent: PIXI.Container)
    {
        super(engine, parent)
    }

    public miraGenerator: Generator<IMiraYield>

    public Graphics: PIXI.Graphics = new PIXI.Graphics()

    public run() : void
    {
        this.miraGenerator = mira(IMiraParamsDefault)
    }

    public draw() : void
    {
        let x = 0
        let y = 0
        this.Graphics.drawCircle(x, y, 1)
    }
}