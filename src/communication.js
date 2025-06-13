const js2py = document.querySelector('#js2py')

export function send_js2py(signal, data){
    const evt = new CustomEvent('custom', {'detail': [signal, data]})
    js2py.dispatchEvent(evt)
}

