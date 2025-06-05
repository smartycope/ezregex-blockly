/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import BlocklyComponent from "./components/BlocklyComponent"
import { send_js2py } from './communication';

// Import components
import InputPicker from './components/InputPicker';
import ModePicker from './components/ModePicker';
import DialectPicker from './components/DialectPicker';
import PatternInput from './components/PatternInput';
import ReplacementInput from './components/ReplacementInput';
import TextInput from './components/TextInput';
import TextOutput from './components/TextOutput';
import RegexDisplay from './components/RegexDisplay';
import Matches from './components/Matches';

export default function App() {
    const [code, setCode] = useState('')
    const [replaceCode, setReplaceCode] = useState('')
    const [data, setData] = useState(null)
    const [text, setText] = useState('')
    const [error, setError] = useState(null)
    const [mode, setMode] = useState('search')
    const [dialect, setDialectState] = useState('python')
    const [inputType, setInputType] = useState('blocks')
    const [needsUpdate, setToUpdate] = useState(true)
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Set up screen size listener
    useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 1000px)');
      const handleResize = () => setIsSmallScreen(mediaQuery.matches);

      handleResize(); // Call once to set initial state
      mediaQuery.addEventListener('change', handleResize);
      return () => mediaQuery.removeEventListener('change', handleResize);
    }, [])


    const showMatches = data !== null && code.length

    function setDialect(to){
        setDialectState(to)
        send_js2py('set_dialect', to)
    }

    useEffect(() => {
        // Set up communication with the python script
        const py2js = document.querySelector('#py2js')
        const func = e => {
            switch (e.detail[0]){
                case "response":
                    setData(JSON.parse(e.detail[1]))
                    setError(null)
                    break
                case "error":
                    setError(e.detail[1])
                    break
                default:
                    console.error(`Recieved unknown signal from py2js: ${e.detail[0]}`)
                    setError('Internal Error')
            }
        }
        py2js.addEventListener('custom', func)
        return () => py2js.removeEventListener('custom', func)
    }, [])

    function setCodes(rawCode){
        const match = rawCode.match(/^replacement =(.+)\n?/m)

        if (match === null){
            setCode(rawCode)
            setReplaceCode('')
        } else {
            setCode((rawCode.slice(0, match.index) + rawCode.slice(match.index + match[0].length, rawCode.length)).trim())
            setReplaceCode('pattern = ' + match[1])
        }
    }

    // This needs to be a state, and not an update function that we pass the blockly component, because
    // the blockly component is set up, and thus passed the function that updates everything, in a
    // useEffect() hook, which, naturally, only gets run once. If we do that, then when we change the
    // body of the update function here (to pass updated text from the TextInput box to the py script),
    // those changes aren't reflected in the blockly component cause it doesn't re-pass the updated
    // function. Yes this took me a while to figure out.
    if (needsUpdate){
        if (mode === 'replace')
            send_js2py('update', JSON.stringify([code, replaceCode, text]))
        else
            send_js2py('update', JSON.stringify([code, null, text]))
        setToUpdate(false)
    }

    var input
    switch (inputType){
        case "blocks":
            input = <>
                    <BlocklyComponent setCodes={setCodes} text={text} setToUpdate={setToUpdate} replaceMode={mode === 'replace'}/>
                    <PatternInput text={code} blockly={true} setInputType={setInputType}/>
                </>
            break
        case "manual":
            input = <PatternInput text={code} setCode={setCode} setToUpdate={setToUpdate} setInputType={setInputType}/>
            break
        case "generate":
            input = <>
                <InputPicker setInputType={setInputType} inputType={inputType}/>
                <p>Auto-Generation is not supported in the updated website yet. It is in the old version: <a href="https://ezregex.streamlit.app/">ezregex.streamlit.app</a></p>
            </>
            break
    }

    return (
        <div className="App">
            <div id='input'>
                <span className='spread'>
                    <ModePicker setMode={setMode}/>
                    <DialectPicker setDialect={to => {setDialect(to); setToUpdate(true)}}/>
                </span>
                {input}
                <TextInput generated={data?.string} text={text} setText={setText} setToUpdate={setToUpdate}/>
                {(mode === 'replace') && <ReplacementInput
                    text={replaceCode}
                    setReplaceCode={setReplaceCode}
                    setToUpdate={setToUpdate}
                    blockly={inputType === "blockly"}
                />}
            </div>
            <div id='output'>
                {isSmallScreen && <hr/>}
                {
                    error ? <>
                        <p id='error-text'>{error}</p>
                    </> : showMatches && <>
                        <h2>Looking for matches in:</h2>
                        <TextOutput html={data['string HTML']}/>
                        <h2>Using regex:</h2>
                        <RegexDisplay regex={data?.regex}/>
                        <h2>Matches:</h2>
                        <Matches matches={data?.matches}/>
                    </>
                }
                {(mode === 'replace' && !error) && <>
                    <hr />
                    <h2>Replaced String:</h2>
                    <pre>{data?.replaced}</pre>
                </>}
                {(mode === 'split' && !error) && <>
                    <hr />
                    <h2>Split String:</h2>
                    {data?.split.map((i) =>
                        <pre>{i}</pre>
                    )}
                </>}
            </div>
        </div>
    );
}
