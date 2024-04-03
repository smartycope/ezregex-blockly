const js2py = document.querySelector('#js2py')
const py2js = document.querySelector('#py2js')

export function send_js2py(signal, data){
    const evt = new CustomEvent('custom', {'detail': [signal, data]})
    js2py.dispatchEvent(evt)
}

export function send_py2js(signal, data){
    const evt = new CustomEvent('custom', {'detail': [signal, data]})
    py2js.dispatchEvent(evt)
}
