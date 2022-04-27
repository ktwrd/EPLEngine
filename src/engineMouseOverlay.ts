import * as PIXI from 'pixi.js'

import Engine from './engine'

export enum EngineMouseState
{
    UP,
    DOWN
}

export default class EngineMouseOverlay
{
    public constructor(engine: Engine)
    {
        this.Engine = engine

        this.Container = new PIXI.Container()
        this.AssetText = new PIXI.Text(this.generateText(), {
            fontSize: 16,
            fill: 0xffffff,
            align: 'left'
        })
        this.Container.addChild(this.AssetText)
        this.Engine.Application.stage.addChild(this.Container)

        this.Engine.Interaction.on('mouse:move', (event) => this.onmousemove(event))
        this.Engine.Interaction.on('mouse:down', (event) => this.onmousedown(event))
        this.Engine.Interaction.on('mouse:up', (event) => this.onmouseup(event))
    }
    public Engine: Engine = null

    public Container: PIXI.Container = null

    public AssetText: PIXI.Text = null

    private mouseState: EngineMouseState = EngineMouseState.UP
    get MouseState()
    {
        return this.mouseState
    }
    set MouseState(value: EngineMouseState)
    {
        this.mouseState = value
        this.UpdateText()
    }

    get X()
    {
        return this.Container.x
    }
    get Y()
    {
        return this.Container.y
    }

    set X(value: number)
    {
        this.Container.x = value
        this.generateText()
    }
    set Y(value: number)
    {
        this.Container.y = value
        this.generateText()
    }

    private static textTemplate : string[] = 
    [
        `X: %s`,    // X Position
        `Y: %s`,    // Y Position
        `%s`        // Mouse State
    ]

    private generateText() : string
    {
        let text: string[] = [].concat(EngineMouseOverlay.textTemplate)

        text[0] = text[0].replace('%s', this.Container.x.toString())
        text[1] = text[1].replace('%s', this.Container.y.toString())
        text[2] = this.MouseState == EngineMouseState.DOWN ? 'Down' : 'Up'

        return text.join('\n')
    }

    public UpdateText() : void
    {
        this.AssetText.text = this.generateText()
    }

    public onmousemove(event: PIXI.InteractionEvent) : void
    {
        this.Container.x = event.data.global.x
        this.Container.y = event.data.global.y
        this.UpdateText()
    }

    public onmousedown(event: PIXI.InteractionEvent) : void
    {
        this.MouseState = EngineMouseState.DOWN
    }
    public onmouseup(event: PIXI.InteractionEvent) : void
    {
        this.MouseState = EngineMouseState.UP
    }
}