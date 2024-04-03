import React, { useEffect, useRef, useState } from 'react';
import BlocklyComponent from "./BlocklyComponent"
import { send_js2py } from './communication';
// import { RadioButton, RadioGroup, ReversedRadioButton } from 'react-radio-buttons';

function ModePicker({setMode}){
    const handleChange = e => setMode(e.target.value)
    return <div id="radio-group">
        <div>
            <input type="radio" id="Search" name="mode" value="search" defaultChecked onChange={handleChange}/>
            <label htmlFor="Search">Search</label>
        </div>

        <div>
            <input type="radio" id="replace" name="mode" value="replace" onChange={handleChange}/>
            <label htmlFor="replace">Replace</label>
        </div>

        <div>
            <input type="radio" id="Split" name="mode" value="split" onChange={handleChange}/>
            <label htmlFor="Split">Split</label>
        </div>
    </div>
    // horizontal
    // return <RadioGroup onChange={ e => setMode(e) } horizontal id="radio-group">
    //     <RadioButton className="radio" padding={8} value="search">  Search  </RadioButton>
    //     <RadioButton className="radio" padding={8} value="replace"> Replace </RadioButton>
    //     <RadioButton className="radio" padding={8} value="split">   Split   </RadioButton>
    // </RadioGroup>
}

function PatternInput({text, replace=false}){
    return <pre id={replace ? "replaceInput" : "patternInput"}><code>{text}</code></pre>
}

function TextInput({generated, text, setText, setToUpdate}){
    return <textarea
            id='textInput'
            placeholder={text.length ? text : (generated ? generated : "Leave empty to generate an example")}
            onChange={e => { setText(e.target.value); setToUpdate(true) }}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            defaultValue={text.length ? text : undefined}
        ></textarea>
}

function TextOutput({html}){
    return <pre id="textOutput" dangerouslySetInnerHTML={{__html: html}}></pre>
}

function RegexDisplay({regex}){
    return <pre id="regexOutput"><code>{regex}</code></pre>;
}

function Matches({matches}){
    return matches.map(group => (<>
        <details key={`group-${group.match.start}-${group.match.end}`}>
            <summary>
                <pre dangerouslySetInnerHTML={{__html: group.match.stringHTML}}></pre>
                <em>{`(${group.match.start}:${group.match.end})`}</em>
            </summary>
            <div className='group-contents'>

                <h3>Unnamed Groups</h3>
                {group.unnamedGroups.map((g, i) => (
                    <pre className='group'>
                        <strong>{i+1}:</strong>
                        <span style={{backgroundColor: g.color}}>{g.string}</span>
                        <em> {`(${group.match.start}:${group.match.end})`}</em>
                    </pre>
                ))}

                <h3>Named Groups</h3>
                {Object.entries(group.namedGroups).map(([name, g]) => (
                    <pre className='group'>
                        <strong>{name}:</strong>
                        <span style={{backgroundColor: g.color}}>{g.string}</span>
                        <em> {`(${group.match.start}:${group.match.end})`}</em>
                    </pre>
                ))}
            </div>
        </details>
    </>))
}

function App() {
    const [code, setCode] = useState('')
    const [replaceCode, setReplaceCode] = useState('')
    const [data, setData] = useState(null)
    const [text, setText] = useState('')
    const [mode, setMode] = useState('search')
    const [needsUpdate, setToUpdate] = useState(true)

    const showMatches = data !== null && code.length

    useEffect(() => {
        // Set up communication with the python script
        const py2js = document.querySelector('#py2js')
        const func = e => {
            switch (e.detail[0]){
                case "response":
                    setData(JSON.parse(e.detail[1]))
                    break
                case "error":
                    console.log('Recieved error from Python script: ' + e.detail[1])
                    break
                default:
                    console.error(`Recieved unknown signal from py2js: ${e.detail[0]}`)
            }
        }
        py2js.addEventListener('custom', func)
        return () => py2js.removeEventListener('custom', func)
    }, [])

    // This needs to be a state, and not an update function that we pass the blockly component, because
    // the blockly component is set up, and thus passed the function that updates everything, in a
    // useEffect() hook, which, naturally, only gets run once. If we do that, then when we change the
    // body of the update function here (to pass updated text from the TextInput box to the py script),
    // those changes aren't reflected in the blockly component cause it doesn't re-pass the updated
    // function. Yes this took me a while to figure out.
    if (needsUpdate){
        send_js2py('update', JSON.stringify([code, text]))
        setToUpdate(false)
    }


    return (
        <div className="App">
            <ModePicker setMode={setMode}/>
            <PatternInput text={code}/>
            <BlocklyComponent setCode={setCode} text={text} setToUpdate={setToUpdate} replaceMode={mode === 'replace'}/>
            <TextInput generated={data?.string} text={text} setText={setText} setToUpdate={setToUpdate}/>
            {(mode === 'replace') && <PatternInput replace={true} text={replaceCode}/>}
            {showMatches && <>
                <hr/>
                <h2>Looking for matches in:</h2>
                <TextOutput html={data?.stringHTML}/>
                <h2>Using regex:</h2>
                <RegexDisplay regex={data?.regex}/>
                <h2>Matches:</h2>
                <Matches matches={data?.matches}/>
            </>}
        </div>
    );
}

export default App;
