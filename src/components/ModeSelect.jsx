import React, {useContext, useState} from 'react';
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import DataContext from '../DataContext';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

// Just so I have a couple options. Didn't end up using this one
export function ModeSelectRadio() {
    const { setMode, setToUpdate } = useContext(DataContext);

    return (
        <FormControl component="fieldset" title="Select the operation mode">
            <FormLabel component="legend" sx={{ mb: 1 }}>Mode</FormLabel>
            <RadioGroup
                sx={{
                    '& .MuiFormControlLabel-root': {
                        mt: -2,
                    },
                }}
                aria-label="mode"
                name="mode"
                defaultValue="search"
                onChange={(e) => {setMode(e.target.value); setToUpdate(true)}}
            >
                <FormControlLabel
                    value="search"
                    control={<Radio size="small" />}
                    label="Search"
                />
                <FormControlLabel
                    value="replace"
                    control={<Radio size="small" />}
                    label="Replace"
                />
                <FormControlLabel
                    value="split"
                    control={<Radio size="small" />}
                    label="Split"
                />
            </RadioGroup>
        </FormControl>
    );
}

export default function ModeSelectSelect() {
    const { setMode, setToUpdate } = useContext(DataContext);

    return (
        <Box sx={{ minWidth: 200, ml: 2 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="mode-selector-label">Mode</InputLabel>
                <Select
                    labelId="mode-selector-label"
                    id="mode-selector"
                    defaultValue="search"
                    label="Mode"
                    onChange={(e) => {setMode(e.target.value); setToUpdate(true)}}
                    size="small"
                    variant="standard"
                >
                    <MenuItem value="search">Search</MenuItem>
                    <MenuItem value="replace">Replace</MenuItem>
                    <MenuItem value="split">Split</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

// Didn't end up using this one either
export function ModeSelectToolbar(){
    const { mode, setMode, setToUpdate } = useContext(DataContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (mode) => {
        setAnchorEl(null);
        setMode(mode);
        setToUpdate(true);
    };
    return <>
        <Button
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
        >
            Mode
        </Button>
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
            <MenuItem onClick={() => handleClose("search")}>{mode === "search" ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>} Search</MenuItem>
            <MenuItem onClick={() => handleClose("replace")}>{mode === "replace" ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>} Replace</MenuItem>
            <MenuItem onClick={() => handleClose("split")}>{mode === "split" ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>} Split</MenuItem>
        </Menu>
    </>
}