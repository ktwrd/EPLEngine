import * as PIXI from 'pixi.js'

type TextureGeneratorMethod = () => PIXI.Container
export const TextureGenerators: TextureGeneratorMethod[] = [
    () : PIXI.Container => {
        let graphics = new PIXI.Graphics()
        graphics.lineStyle(1, 0x000000, 0, 0, true)

        let colors = [
            0xff00d9,
            0x000000
        ]

        let opts = {
            size: 16,
            count: 9
        }
        let curr = 0
        for (let y = 0; y < opts.count; y++)
        {
            for (let x = 0; x < opts.count; x++)
            {
                if (curr >= colors.length)
                    curr = 0
                console.log(`color:::: `, curr, colors[curr])
                graphics.beginFill(colors[curr], 1)
                graphics.drawRect(x * opts.size, y * opts.size, opts.size, opts.size)
                console.log(`X:${x* opts.size}, Y:${y* opts.size}`)

                graphics.endFill()
                curr += 1
            }
        }

        return graphics
    }
]