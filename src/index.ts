import Engine from './engine'
import LineDrawer from './app.lineDrawer'
import RectangleResize from './app.rectResize'

console.log('hello world!')
let element: HTMLElement = document.querySelector('.engine')
let engineInstance: Engine = new Engine(element)
console.log(engineInstance)

let active: any = null

interface KeyValuePair<T, A>
{
    Key: T,
    Value: A
}

let tests: KeyValuePair<string, Function>[] =
[
    {
        Key: 'Resizeable Image',
        Value: () => { active =  new RectangleResize(engineInstance) }
    },
    {
        Key: 'Rectangle Drawer',
        Value: () => { active = new LineDrawer(engineInstance) }
    }
]

for (let i = 0; i < tests.length; i++)
{
    document.querySelector('#demoselect').innerHTML += `<option value="${i}">${tests[i].Key}</option>`
    console.log(tests[i])
}

let btn: HTMLButtonElement = document.querySelector('[action=start]')
btn.onclick = () => {
    let selected = document.querySelector('select').selectedOptions[0]
    if (selected != undefined && document.querySelector('select').selectedOptions.length > 0)
    {
        engineInstance.Container.removeChildren()
        if (active != null)
            active.destroy()
        active = tests[parseInt(document.querySelector('select').selectedOptions[0].value)].Value()
    }
}

window.addEventListener('resize', () => {
    let element: HTMLDivElement = document.querySelector('.engine')
    engineInstance.setSize(element.clientWidth, element.clientHeight)
})

