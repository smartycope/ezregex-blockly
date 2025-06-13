import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Grid from '@mui/material/Grid';
import { useContext } from 'react';
import DataContext from '../DataContext';

function ModeSelector({showMode, setShowMode}){
    // Keep localstorage in updated with the current state
    useEffect(() => {
        localStorage.setItem('EZRegexShowMode', showMode)
    }, [showMode])

    // Load the showMode from localstorage if it exists
    useEffect(() => {
        const savedMode = localStorage.getItem('EZRegexShowMode')
        if (savedMode) {
            setShowMode(savedMode)
        }
    }, [])

    return <FormControl sx={{ height: '100%', width: 'min-content', ml: 'auto' }} id='copy-dropdown'>
        <InputLabel id="copy-dropdown" variant="standard">Show as</InputLabel>
        <Select
            labelId="copy-dropdown"
            id="copy-dropdown"
            sx={{ height: '100%'}}
            value={showMode}
            variant="standard"
            onChange={(e) => setShowMode(e.target.value)}
            size="small"
        >
            <MenuItem value="plain">Raw</MenuItem>
            <MenuItem value="ezregex">EZRegex</MenuItem>
            <MenuItem value="regex">Regex String</MenuItem>
            <MenuItem value="code">Code</MenuItem>
            <MenuItem value="full-ezregex">Full EZRegex</MenuItem>
        </Select>
    </FormControl>
}

function RegexBox({ name, regex, ezregex, showMode }) {
    let showText = ''

    switch (showMode) {
        case 'plain':   showText = regex; break;
        case 'regex':   showText = `Coming soon!`; break;
        case 'code':    showText = `Coming soon!`; break;
        case 'full-ezregex': showText = ezregex; break;
        case 'ezregex':
            const assignmentRegex = new RegExp(/^\w+\ =\ (.*)/m)
            const lines = ezregex.split('\n')
            // Remove lines that don't start with a variable assignment, and then removed the variable assignment to pattern
            const meaningfulEzregex = lines.map(line => assignmentRegex.test(line) ? line.replace(/^pattern = (.*)/m, '$1') + '\n': "")
            showText = meaningfulEzregex.join('');
            break;
    }

    return <>
        <Grid container alignItems="top">
            <Paper
                variant="outlined"

                sx={{
                    p: 2,
                    // expand to fill the space, but not squeeze out the select box
                    // width: `calc(100% - ${dropDownWidth}px)`,
                    width: '70%',
                    flex: '1 1 auto',
                    bgcolor: 'background.paper',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    position: 'relative',
                    '&:hover .copy-button': {
                        opacity: 1,
                    },
                }}
            >
                {!regex && <Typography color="text.secondary" fontStyle="italic">No regex pattern to display</Typography>}
                {regex && (<>
                    <Tooltip title="Copy to clipboard">
                        <IconButton
                            size="small"
                            onClick={() => navigator.clipboard.writeText(showText)}
                            className="copy-button"
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                backgroundColor: 'background.paper',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {showText}
                    </Typography>
                </>)
                }
            </Paper>
        </Grid>
    </>
}

export default function CompiledRegexResultBox() {
    const [showMode, setShowMode] = useState('plain')
    const {data, code, replaceCode, mode} = useContext(DataContext)

    return (<>
        <Grid container alignItems="flex-end">
            <Typography variant="h5" sx={{ mt: 3 }}>Compiled Regex:</Typography>
            <ModeSelector showMode={showMode} setShowMode={setShowMode}/>
        </Grid>
        <RegexBox name="Regex" regex={data?.regex} ezregex={code} showMode={showMode}/>
        {/* TODO: this needs to be implemented in the package */}
        {/* {mode === 'replace' && <RegexBox name="Replacement Regex" regex={data?.['replacement regex']} ezregex={replaceCode} showMode={showMode}/>} */}
        {mode === 'replace' && <RegexBox name="Replacement Regex" regex={'Coming soon!'} ezregex={replaceCode} showMode={showMode}/>}
    </>)
}



// Didn't end up using this, I like the select box better
// I'm keeping it around in case I ever change my mind
export function CompiledEZRegexResultBox({text}){
    return <>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Compiled EZRegex:</Typography>
        <Box sx={{ position: 'relative' }}>
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    fontFamily: 'monospace',
                    '&:hover .copy-button': {
                        opacity: 1,
                    },
                }}
            >
                <Grid direction="column" columns={2} spacing={4}>
                    {text}
                    {text && (
                        <Tooltip title="Copy to clipboard">
                            <IconButton
                                size="small"
                                onClick={() => navigator.clipboard.writeText(text)}
                                className="copy-button"
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    backgroundColor: 'background.paper',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
            </Paper>
        </Box>
    </>
}
