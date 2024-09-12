/* eslint-disable default-case */
import React, { useEffect, useState } from 'react';
import BlocklyComponent from "./BlocklyComponent"
import Editor from '@monaco-editor/react';
import { send_js2py } from './communication';


function InputPicker({setInputType, inputType}){
    const handleChange = e => setInputType(e.target.value)
    return <span id='input-picker'>
            <label htmlFor="input-type-selector">Input method:</label>
            <select name="input-type" id='input-type-selector' required onChange={handleChange} defaultChecked={inputType}>
                <option value="blocks">Blocks</option>
                <option value="manual">Manual</option>
                {/* <option value="generate">Auto-Generate</option> */}
            </select>
            <br/>
        </span>
}

function ModePicker({setMode}){
    const handleChange = e => setMode(e.target.value)
    return <span>
        <label htmlFor="radio-group">Mode:</label>
        <div id="radio-group">
            <span className='radio-container'>
                <input type="radio" id="Search" name="mode" value="search" defaultChecked onChange={handleChange}/>
                <label htmlFor="Search">Search</label>
            </span>

            <span className='radio-container'>
                <input type="radio" id="replace" name="mode" value="replace" onChange={handleChange}/>
                <label htmlFor="replace">Replace</label>
            </span>

            <span className='radio-container'>
                <input type="radio" id="Split" name="mode" value="split" onChange={handleChange}/>
                <label htmlFor="Split">Split</label>
            </span>
        </div>
    </span>
}

function DialectPicker({setDialect}){
    const handleChange = e => setDialect(e.target.value)
    return <span id="dialect-picker">
            <label htmlFor="input-type-selector">Regex Dialect:</label>
            <select name="input-type" id='input-type-selector' required onChange={handleChange}>
                <option value="python">Python</option>
                <option value="javascript">JavaScript (expiremental)</option>
                <option value="R">R (Limited)</option>
                <option value="perl">Perl (Limited)</option>
            </select>
            <br/>
        </span>
}

function PatternInput({text, setCode, setToUpdate, setInputType, blockly=false}){
    function handleEditorWillMount(monaco) {
        monaco?.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: () => {
                return {
                    suggestions: [{
                        label: 'digit',
                        kind: monaco.languages.CompletionItemKind.Function,
                        documentation: 'A single digit',
                        detail: "\\d",
                        insertText: "digit",
                        commitCharacters: [' ', '+'],
                        additionalTextEdits: {forceMoveMarkers: true},
                    }]
                }
            }
        })
        // monaco.languages.registerCodeLensProvider('python', {
        //     provideCodeLenses: () => {
        //         return {
        //             lenses:[{
        //                 id: 'test',
        //                 command: {
        //                     arguments: ['testarg1', 'testarg2'],
        //                     id: 'test',
        //                     title: 'test title',
        //                     tooltip: 'test tooltip',
        //                 },
        //                 range: {
        //                     endColumn: 50,
        //                     startColumn: 0,
        //                     startLineNumber: 0,
        //                     endLineNumber: 50,
        //                 }
        //             }]
        //         }
        //     }
        // })
        // monaco.languages.python.pythonDefaults.addExtraLib([
        //     'def testFunc(paramA, paramB:int) -> str:',
        //     '     """ testFunc doc string """',
        //     '    ...',
        //     '}',
        // ].join('\n'), 'filename/facts.pyi');
    }

    const label = <span className='spread'>
        <label htmlFor="patternInput">EZRegex Pattern:</label>
        <InputPicker setInputType={setInputType}/>
    </span>

    if (blockly)
        return <>
            {label}
            <textarea
                id='patternInput'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                wrap="soft"
                rows={text?.split('\n').length}
                value={text.length ? text : undefined}
                readOnly={true}
            ></textarea>
        </>
    else
        return <>
            {label}
            <Editor
                height="100px"
                defaultLanguage="python"
                beforeMount={handleEditorWillMount}
                onChange={(val, evt) => {setCode(val); setToUpdate(true)}}
                defaultValue={text.length ? text : undefined}
                theme="vs-dark"
                // keepCurrentModel={true} // This is probably unnecissary?
                options={{
                    wordWrap: 'on',
                    minimap: {
                        enabled: false,
                    },
                    links: false,
                    // quickSuggestions: {
                    //     strings
                    // }
                    scrollbar: {
                        horizontal: 'hidden',
                    }
                }}
            />
            {/* <button></button> */}
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
    // return <pre id="regexOutput"><code>{regex}</code></pre>;
    return <div id="regexOutput">
        <code id='regex-code'>{regex}</code>
        <button id='copy-button' onClick={() => navigator.clipboard.writeText(regex)}>Copy</button>
    </div>
}

function Matches({matches}){
    function groups(group, key){
        return Object.entries(group[key]).map(([id, g]) => (
            <span id='groups-line' key={`span-${key}-${id}`}>
                <strong key={`strong-${key}-${id}`}>{id}:</strong>
                <pre className='group' key={`pre-${key}-${id}`} style={{backgroundColor: g.color}}>
                    {g.string}
                </pre>
                <em key={`em-${key}-${id}`}> {`(${group.match.start}:${group.match.end})`}</em>
            </span>
        ))
    }
    return matches.map(group => (<>
        <details key={`group-${group.match.start}-${group.match.end}`}>
            <summary key={`summary-${group.match.start}-${group.match.end}`}>
                <pre dangerouslySetInnerHTML={{__html: group.match['string HTML']}} key={`pre-${group.match.start}-${group.match.end}`}></pre>
                <em key={`em-${group.match.start}-${group.match.end}`}>{`(${group.match.start}:${group.match.end})`}</em>
            </summary>
            <div className='group-contents' key={`div-${group.match.start}-${group.match.end}`}>
                <h3 key={`h3-${group.match.start}-${group.match.end}`}>Unnamed Groups</h3>
                {groups(group, 'unnamed groups')}
                <h3 key={`h3-2-${group.match.start}-${group.match.end}`}>Named Groups</h3>
                {groups(group, 'named groups')}
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
