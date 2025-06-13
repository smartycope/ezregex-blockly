import React, { useState, useCallback, useContext } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Editor from '@monaco-editor/react';
import DataContext from '../DataContext';

export default function ReplacementInput() {
    const {replaceCode, setReplaceCode, setToUpdate} = useContext(DataContext)
    const [editorHeight, setEditorHeight] = useState('100px');

    const handleEditorChange = useCallback((value) => {
        setReplaceCode(value);
        setToUpdate(true);
    }, [setReplaceCode, setToUpdate]);

    const handleEditorMount = (editor) => {
        const model = editor.getModel();
        if (model) {
            const lineCount = model.getLineCount();
            const height = Math.min(Math.max(100, lineCount * 19), 150);
            setEditorHeight(`${height}px`);
        }

        editor.onDidChangeModelContent(() => {
            const lineCount = editor.getModel()?.getLineCount() || 1;
            const height = Math.min(Math.max(100, lineCount * 19), 150);
            setEditorHeight(`${height}px`);
        });
    };

    return (
        <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Replacement String</Typography>
                <Editor
                    height={editorHeight}
                    defaultLanguage="text"
                    onChange={handleEditorChange}
                    value={replaceCode || 'pattern = '}
                    onMount={handleEditorMount}
                    theme="vs-dark"
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
    );
}
