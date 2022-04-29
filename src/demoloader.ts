import * as PIXI from 'pixi.js'
import EventEmitter from 'events'

import Engine from './engine'

import LineDrawer from './app.lineDrawer'
import RectangleResize from './app.rectResize'
import FractalDemo from './app.fractal'
import DemoResizeableObject from './demo.resizeableObject'

export interface KeyValuePair<T, A>
{
    Key: T,
    Value: A
}

export type ValidDemo = LineDrawer | RectangleResize | FractalDemo | DemoResizeableObject

export const DemoEntries: KeyValuePair<string, Function>[] =
[
    {
        Key: 'Resizeable Objects',
        Value: (engineInstance: Engine, parentContainer: PIXI.Container): ValidDemo =>
        {
            return new DemoResizeableObject(engineInstance, parentContainer)
        }
    },
    {
        Key: 'Resizeable Image',
        Value: (engineInstance: Engine, parentContainer: PIXI.Container): ValidDemo =>
        {
            return new RectangleResize(engineInstance, parentContainer)
        }
    },
    {
        Key: 'Rectangle Drawer',
        Value: (engineInstance: Engine, parentContainer: PIXI.Container): ValidDemo =>
        {
            return new LineDrawer(engineInstance, parentContainer)
        }
    },
    {
        Key: 'Fractal Test',
        Value: (engineInstance: Engine, parentContainer: PIXI.Container): ValidDemo =>
        {
            return new FractalDemo(engineInstance, parentContainer)
        }
    }
]

export default class DemoLoader extends EventEmitter
{
    public constructor(engine: Engine, selectElement: HTMLSelectElement, startButtonElement: HTMLButtonElement)
    {
        super()
        this.HTMLButtonStart = startButtonElement
        this.HTMLDemoSelect = selectElement

        this.Engine = engine

        this.DemoContainer = new PIXI.Container()
        this.Engine.Container.addChild(this.DemoContainer)

        this.on('start', this.onstart)

        this.initalizeHTMLButton()
        this.initalizeHTMLElements()
    }

    public Engine: Engine = null

    public DemoContainer: PIXI.Container = null
    public TargetDemo: ValidDemo = null
    public TargetDemoKeyValuePair: KeyValuePair<string, Function> = null

    private destroyed: boolean = false

    public selectDemo(demo: KeyValuePair<string, Function>) : void
    {
        if (this.TargetDemo != null)
        {
            this.TargetDemo.destroy()
        }
        this.TargetDemo = demo.Value(this.Engine, this.DemoContainer)
    }

    public HTMLDemoSelect: HTMLSelectElement = null
    public HTMLButtonStart: HTMLButtonElement = null

    public initalizeHTMLElements() : void
    {
        for (let i = 0; i < DemoEntries.length; i++)
        {
            this.HTMLDemoSelect.innerHTML += `<option value="${i}">${DemoEntries[i].Key}</option>`
        }
    }
    public initalizeHTMLButton() : void
    {
        this.HTMLButtonStart.onclick = () => {this.emit('start')}
    }

    public onstart() : void
    {
        console.log(this)
        let selected = this.getSelectedOption()
        if (this.TargetDemo != null)
            this.TargetDemo.destroy()
        if (selected == null)
            return
        
        this.TargetDemoKeyValuePair = selected
        this.TargetDemo = this.TargetDemoKeyValuePair.Value(this.Engine, this.DemoContainer)
    }

    public getSelectedOption() : KeyValuePair<string, Function>
    {
        let selectedItems = this.HTMLDemoSelect.selectedOptions

        let numberRegex = new RegExp(/^[0-9]{1,}(\.[0-9]{1,})?$/)

        let targetItem = null
        for (let i = 0; i < selectedItems.length; i++)
        {
            let value = selectedItems[i].value
            if (value.match(numberRegex) != null)
            {
                targetItem = value
                i = selectedItems.length
            }
        }

        if (targetItem == null)
            return null
    

        return DemoEntries[parseInt(targetItem)]
    }

    public destroy() : void
    {
        this.Engine.Container.removeChild(this.DemoContainer)
        this.removeAllListeners()
        this.destroyed = true
    }
}