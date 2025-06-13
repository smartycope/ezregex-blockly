const py2js = document.querySelector('#py2js')

export function send_py2js(signal, data){
    const evt = new CustomEvent('custom', {'detail': [signal, data]})
    py2js.dispatchEvent(evt)
}
