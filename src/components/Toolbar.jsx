import React from 'react';
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import InputMethodSelect from './InputMethodSelect';
import ModeSelectSelect from './ModeSelect';
import DialectSelect from './DialectSelect';
import Icon from './Icon';

export default function MyToolbar(){
    return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor: '#59E6CD', borderRadius: '10px', marginBottom: '10px'}}>
        <Toolbar>
            <Box sx={{edge: 'start'}}><Icon/></Box>
            <Box sx={{ml: 'auto', display: 'flex', alignItems: 'center', gap: 2}}>
                <InputMethodSelect/>
                <ModeSelectSelect/>
                <DialectSelect/>
            </Box>
        </Toolbar>
      </AppBar>
    </Box>
    )
}