import React, { useState, useCallback, useContext } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Editor from '@monaco-editor/react';
import DataContext from '../DataContext';

export default function MonacoComponent(){
    const {text, setCode, setToUpdate} = useContext(DataContext)
    const [editorHeight, setEditorHeight] = useState('100px');

    const handleEditorWillMount = useCallback((monaco) => {
        monaco?.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: () => ({
                suggestions: [{
                    label: 'digit',
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: 'A single digit',
                    detail: "\\d",
                    insertText: "digit",
                    commitCharacters: [' ', '+'],
                    additionalTextEdits: { forceMoveMarkers: true },
                }]
            })
        });
    }, []);

    const handleEditorChange = useCallback((value) => {
        setCode(value);
        setToUpdate(true);
    }, [setCode, setToUpdate]);

    const handleEditorMount = (editor) => {
        const model = editor.getModel();
        if (model) {
            const lineCount = model.getLineCount();
            const height = Math.min(Math.max(100, lineCount * 19), 300);
            setEditorHeight(`${height}px`);
        }

        editor.onDidChangeModelContent(() => {
            const lineCount = editor.getModel()?.getLineCount() || 1;
            const height = Math.min(Math.max(100, lineCount * 19), 300);
            setEditorHeight(`${height}px`);
        });
    };

    return <Box sx={{ mt: 1, width: '100%'}}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>EZRegex Pattern</Typography>
        <Editor
                height={editorHeight}
                defaultLanguage="python"
                beforeMount={handleEditorWillMount}
                onChange={handleEditorChange}
                defaultValue={text || 'pattern = '}
                onMount={handleEditorMount}
                theme="vs-dark"
                className="monaco-editor"
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    links: false,
                    scrollbar: { horizontal: 'hidden' },
                    fontSize: 14,
                    lineNumbers: 'off',
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                    renderLineHighlight: 'none',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
    </Box>
}
