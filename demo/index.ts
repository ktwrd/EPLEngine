import './styles/index.scss'

import EPLEngine from 'eplengine'
const Engine = EPLEngine.Engine.default
const DemoLoader = EPLEngine.DemoLoader.default

let element: HTMLElement = document.querySelector('.engine')
let engineInstance = new Engine({
    width: element.clientWidth,
    height: element.clientHeight,
    resizeTo: element
}, element)

let btn: HTMLButtonElement = document.querySelector('button[action=start]')
let sel: HTMLSelectElement = document.querySelector('select#demoselect_input')
let demoInstance = new DemoLoader(engineInstance, sel, btn)

function generateEngineAddonList (): void
{
    let htmlArray = []
    let entries = Object.entries(engineInstance.registeredAddons)
    for (let i = 0; i < entries.length; i++)
    {
        let id = `toggle_addon_${entries[i][0]}`
        htmlArray.push(`
        <div class="row">
            <div class="form-check">
                <input type="checkbox" id="${id}" class="form-check-input" action="toggle_addon" label="${entries[i][0]}">
                <label for="${id}"class="form-check-label" ${entries[i][1].enabled ? 'checked' : ''}>${entries[i][0]}</label>
            </div>
        </div>
        `)
    }
    document.querySelector('#engine_addons_toggle_list').innerHTML = htmlArray.join('\n')

    let allQueries = document.querySelectorAll('[action=toggle_addon]')
    for (let i = 0; i < allQueries.length; i++)
    {
        allQueries[i].addEventListener('click', (event) =>
        {
            let target: any = event.target
            if (target.attributes.label == undefined || typeof target.attributes.label != 'object') return
            if (target.checked == undefined || typeof target.checked != 'boolean') return
            engineInstance.setAddon(target.attributes.label.value, target.checked)
        })
    }
}
generateEngineAddonList()
engineInstance.on('registerAddon', () => generateEngineAddonList())

