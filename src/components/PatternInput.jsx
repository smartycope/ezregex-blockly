import React from 'react';
import Editor from '@monaco-editor/react';
import InputPicker from './InputPicker';

export default function PatternInput({ text, setCode, setToUpdate, setInputType, blockly = false }) {
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

    const label = (
        <span className='spread'>
            <label htmlFor="patternInput">EZRegex Pattern:</label>
            <InputPicker setInputType={setInputType} />
        </span>
    );

    if (blockly) {
        return (
            <>
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
        );
    }

    return (
        <>
            {label}
            <Editor
                height="100px"
                defaultLanguage="python"
                beforeMount={handleEditorWillMount}
                onChange={(val) => { setCode(val); setToUpdate(true) }}
                defaultValue={text.length ? text : undefined}
                theme="vs-dark"
                options={{
                    wordWrap: 'on',
                    minimap: {
                        enabled: false,
                    },
                    links: false,
                    scrollbar: {
                        horizontal: 'hidden',
                    }
                }}
            />
        </>
    );
}
