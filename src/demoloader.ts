import * as PIXI from 'pixi.js'
import EventEmitter from 'events'

import Engine from './engine'

import LineDrawer from './demo.lineDrawer'
import FractalDemo from './demo.fractal'
import DemoResizeableObject from './demo.resizeableObject'
import { IDemoBase } from './demobase'

export interface IRegisteredDemo
{
    Key: string,
    Value(engineInstance: Engine, parentContainer: PIXI.Container): IDemoBase
}
export interface IDemoLoader
{
    Engine: Engine
    RegisteredDemos: IRegisteredDemo[]

    DemoContainer: PIXI.Container
    TargetDemo: IDemoBase
    TargetRegisteredDemo: IRegisteredDemo

    selectDemo(demo: IRegisteredDemo) : void

    HTMLDemoSelect: HTMLSelectElement
    HTMLButtonStart: HTMLButtonElement

    initalizeHTMLElements() : void
    initalizeHTMLButton() : void

    onstart() : void

    getSelectedOption() : IRegisteredDemo

    destroy() : void
}
export default class DemoLoader extends EventEmitter implements IDemoLoader
{
    public constructor(engine: Engine, selectElement: HTMLSelectElement, startButtonElement: HTMLButtonElement)
    {
        super()
        this.Engine = engine
        this.HTMLButtonStart = startButtonElement
        this.HTMLDemoSelect = selectElement

        this.registerDemos(DemoLoader.DefaultRegisteredDemos)

        this.DemoContainer = new PIXI.Container()
        this.Engine.Container.addChild(this.DemoContainer)

        this.on('start', this.onstart)

        this.initalizeHTMLButton()
        this.initalizeHTMLElements()
    }

    public Engine: Engine = null

    public RegisteredDemos: IRegisteredDemo[] = []
    public static DefaultRegisteredDemos: IRegisteredDemo[] = [
        {
            Key: 'Resizeable Objects',
            Value: (engineInstance: Engine, parentContainer: PIXI.Container): IDemoBase =>
            {
                return new DemoResizeableObject(engineInstance, parentContainer)
            }
        },
        {
            Key: 'Rectangle Drawer',
            Value: (engineInstance: Engine, parentContainer: PIXI.Container): IDemoBase =>
            {
                return new LineDrawer(engineInstance, parentContainer)
            }
        },
        {
            Key: 'Fractal Test',
            Value: (engineInstance: Engine, parentContainer: PIXI.Container): IDemoBase =>
            {
                return new FractalDemo(engineInstance, parentContainer)
            }
        }
    ]

    public registerDemo(demo: IRegisteredDemo) : void
    {
        this.RegisteredDemos.push(demo)
        this.initalizeHTMLElements()
    }
    public registerDemos(demos: IRegisteredDemo[]) : void
    {
        this.RegisteredDemos = this.RegisteredDemos.concat(demos)
        this.initalizeHTMLElements()
    }

    public DemoContainer: PIXI.Container = null
    public TargetDemo: IDemoBase = null
    public TargetRegisteredDemo: IRegisteredDemo = null

    public selectDemo(demo: IRegisteredDemo) : void
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
        this.HTMLDemoSelect.innerHTML = `<option value="null" selected>None</option>`
        for (let i = 0; i < this.RegisteredDemos.length; i++)
        {
            this.HTMLDemoSelect.innerHTML += `<option value="${i}">${this.RegisteredDemos[i].Key}</option>`
        }
    }
    public initalizeHTMLButton() : void
    {
        this.HTMLButtonStart.onclick = () => {this.emit('start')}
    }

    public onstart() : void
    {
        let selected = this.getSelectedOption()
        if (this.TargetDemo != null)
            this.TargetDemo.destroy()
        if (selected == null)
            return
        
        this.TargetRegisteredDemo = selected
        this.TargetDemo = this.TargetRegisteredDemo.Value(this.Engine, this.DemoContainer)
    }

    public getSelectedOption() : IRegisteredDemo
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
    

        return this.RegisteredDemos[parseInt(targetItem)]
    }

    protected destroyed: boolean = false
    public destroy() : void
    {
        this.Engine.Container.removeChild(this.DemoContainer)
        this.removeAllListeners()
        this.destroyed = true
    }
}