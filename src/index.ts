import './styles/index.scss'
import Engine from './engine'
import DemoLoader from './demoloader'

let element: HTMLElement = document.querySelector('.engine')
let engineInstance: Engine = new Engine(element)

let btn: HTMLButtonElement = document.querySelector('button[action=start]')
let sel: HTMLSelectElement = document.querySelector('select#demoselect_input')
let demoInstance = new DemoLoader(engineInstance, sel, btn)

window.addEventListener('resize', () => {
    let element: HTMLDivElement = document.querySelector('.engine')
    engineInstance.setSize(element.clientWidth, element.clientHeight)
})

