/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import BlocklyComponent from "./BlocklyComponent"
import { send_js2py } from './communication';


function InputPicker({setInputType}){
    const handleChange = e => setInputType(e.target.value)
    return <span>
            <label htmlFor="input-type-selector">Input method:</label>
            <select name="input-type" id='input-type-selector' required onChange={handleChange}>
                <option value="blocks">Blocks</option>
                <option value="manual">Manual</option>
                <option value="generate">Auto-Generate</option>
            </select>
            <br/>
        </span>
}

function ModePicker({setMode}){
    const handleChange = e => setMode(e.target.value)
    return <span>
        <label htmlFor="radio-group">Mode:</label>
        <div id="radio-group">
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
    </span>
}

function DialectPicker({setDialect}){
    const handleChange = e => setDialect(e.target.value)
    return <span id="dialect-picker">
            <label htmlFor="input-type-selector">Regex Dialect:</label>
            <select name="input-type" id='input-type-selector' required onChange={handleChange}>
                <option value="python">Python</option>
                <option value="perl">Perl (expiremental)</option>
                {/* <option value="javascript">JavaScript</option> */}
            </select>
            <br/>
        </span>
}

function PatternInput({text, setCode, setToUpdate, setInputType, blockly=false}){
    const props = {
        id: 'patternInput',
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'off',
        wrap: "soft",
        rows: text?.split('\n').length,
    }

    const label = <span className='spread'>
        <label htmlFor="patternInput">EZRegex Pattern:</label>
        <InputPicker setInputType={setInputType}/>
    </span>

    if (blockly)
        return <>
            {label}
            <textarea {...props}
                value={text.length ? text : undefined}
                readOnly={true}
            ></textarea>
        </>
    else
        return <>
            {label}
            <textarea {...props}
                onChange={e => {setCode(e.target.value); setToUpdate(true)}}
                defaultValue={text.length ? text : undefined}
            ></textarea>
        </>
}

function ReplacementInput({text, setReplaceCode, setToUpdate, blockly=false}){
    const props = {
        id: 'replacementInput',
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'off',
        wrap: "soft",
        rows: text?.split('\n').length,
    }
    const label = <label htmlFor="replacementInput">Replacement EZRegex Pattern:</label>

    if (blockly)
        return <>
            {label}
            <textarea {...props}
                value={text.length ? text : undefined}
                readOnly={true}
            ></textarea>
        </>
    else
        return <>
            {label}
            <textarea {...props}
                onChange={e => {setReplaceCode(e.target.value); setToUpdate(true)}}
                defaultValue={text.length ? text : undefined}
            ></textarea>
        </>
}

function TextInput({generated, text, setText, setToUpdate}){
    return <>
            <label htmlFor="textInput">String to match against:</label>
            <textarea
                id='textInput'
                rows={text?.split('\n').length}
                placeholder={text.length ? text : (generated ? generated : "Leave empty to generate an example")}
                onChange={e => { setText(e.target.value); setToUpdate(true) }}
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                defaultValue={text.length ? text : undefined}
            ></textarea>
        </>
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
                    <pre className='group' key={`unnamed-group-${i}`}>
                        <strong>{i+1}:</strong>
                        <span style={{backgroundColor: g.color}}>{g.string}</span>
                        <em> {`(${group.match.start}:${group.match.end})`}</em>
                    </pre>
                ))}

                <h3>Named Groups</h3>
                {Object.entries(group.namedGroups).map(([name, g]) => (
                    <pre className='group' key={`named-group-${name}`}>
                        <strong>{name}: </strong>
                        <span style={{backgroundColor: g.color}}>{g.string}</span>
                        <em> {`(${group.match.start}:${group.match.end})`}</em>
                    </pre>
                ))}
            </div>
        </details>
    </>))
}

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
                    // console.log('Recieved error from Python script: ' + e.detail[1])
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
        const match = rawCode.match(/^replacement = (.+)\n?/m)

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
            input = <p>Auto-Generation is not supported in the updated website yet. It is in the old version: <a href="https://ezregex.streamlit.app/">ezregex.streamlit.app</a></p>
            break
    }

    return (
        <div className="App">
            <span className='spread'>
                <ModePicker setMode={setMode}/>
                <DialectPicker setDialect={setDialect}/>
            </span>
            {input}
            <TextInput generated={data?.string} text={text} setText={setText} setToUpdate={setToUpdate}/>
            {(mode === 'replace') && <ReplacementInput
                text={replaceCode}
                setReplaceCode={setReplaceCode}
                setToUpdate={setToUpdate}
                blockly={inputType === "blockly"}
            />}
            {
                error ? <>
                    <hr/>
                    <p id='error-text'>{error}</p>
                </> : showMatches && <>
                    <hr/>
                    <h2>Looking for matches in:</h2>
                    <TextOutput html={data?.stringHTML}/>
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
        </div>
    );
}
