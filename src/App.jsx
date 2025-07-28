/* eslint-disable default-case */
import React, { useEffect, useState, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { send_js2py } from './communication';
import theme from './theme';
import ReplacementBox from './components/ReplacementBox';
import TextInput from './components/TextInput';
import ResultBox from './components/ResultBox';
import CompiledRegexResultBox from './components/CompiledRegexResultBox';
import MatchesDisplay from './components/MatchesDisplay';
import MonacoComponent from './components/MonacoComponent';
import BlocklyComponent from './components/BlocklyComponent';
import ReplacedStringDisplay from './components/ReplacedStringDisplay';
import DataContext from './DataContext';
import MyToolbar from './components/Toolbar';
import SplitStringDisplay from './components/SplitStringDisplay';
import Link from '@mui/material/Link'

function InputPanel(){
    const {mode, inputType } = useContext(DataContext)
    return (
        <Paper elevation={3} sx={{
            p: 3,
            mb: 4,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box'
        }}>
            {inputType === "blocks" && <BlocklyComponent/>}
            {inputType === "manual" && <MonacoComponent/>}
            {mode === 'replace' && inputType === "manual" && <ReplacementBox/>}
            <TextInput/>
        </Paper>
    )
}

function ResultsPanel(){
    const {data, error, showMatches, mode} = useContext(DataContext)
    return (
        <Paper elevation={3} sx={{
            p: 3,
            height: '100%',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Just the error message, if there is one */}
            {error && <Typography color="error" variant="body1">{error}</Typography>}
            {/* Just the empty message, if we're empty */}
            {!error && !showMatches && <Typography variant="body1" color="text.secondary" fontStyle="italic">No pattern specified</Typography>}
            {/* The actual results */}
            {!error && showMatches && <Box>
                <ResultBox/>
                <CompiledRegexResultBox/>
                <MatchesDisplay/>
                {mode === 'replace' && data?.replaced && <ReplacedStringDisplay/>}
                {mode === 'split' && data?.split && <SplitStringDisplay/>}
            </Box>}
        </Paper>
    )
}

// TODO:
// "<s" seems to break the looking for matches in box. Sanatize HTML needed?
// add an option for "compiled regex, with EZRegex as a comment"

function AppContent() {
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

    // Set up communication with the python script
    useEffect(() => {
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
                // The script is loaded, we can update now
                case "loaded":
                    setToUpdate(true)
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

    return (
        <DataContext.Provider value={{
            code,
            replaceCode,
            data,
            text,
            error,
            mode,
            dialect,
            inputType,
            needsUpdate,
            isSmallScreen,
            showMatches,
            setDialect,

            setCode,
            setCodes,
            setReplaceCode,
            setData,
            setText,
            setError,
            setMode,
            setDialectState,
            setInputType,
            setToUpdate,
            setIsSmallScreen,
         }}>
        <Box>
            <MyToolbar/>
            <Grid container spacing={3}>
                <Box sx={{ width: isSmallScreen ? '100%' : '60%' }}>
                    <InputPanel/>
                </Box>
                {/* Why 37 instead of 40, I don't know */}
                <Box sx={{ width: isSmallScreen ? '100%' : '37%' }}>
                    <ResultsPanel/>
                </Box>
            </Grid>
            <footer>
                <br/>
                <Typography variant="caption" color="secondary">
                    EZRegex is an open source project.{' '}
                    <Link color="inherit" href="https://github.com/smartycope/ezregex-blockly">
                        Source code
                    </Link>
                </Typography>
                <br/>
                <Typography variant="caption" color="secondary" id='version-caption'>
                    Loading...
                </Typography>
            </footer>
        </Box>
        </DataContext.Provider>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <AppContent />
            </Container>
        </ThemeProvider>
    );
}
