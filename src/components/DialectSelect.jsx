import React, { useContext, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DataContext from '../DataContext';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export default function DialectSelect() {
    const { setDialect, setToUpdate } = useContext(DataContext);

    return (
        <Box sx={{ minWidth: 200, ml: 2 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="dialect-selector-label">Regex Dialect</InputLabel>
                <Select
                    labelId="dialect-selector-label"
                    id="dialect-selector"
                    defaultValue="python"
                    label="Regex Dialect"
                    onChange={(e) => {setDialect(e.target.value); setToUpdate(true)}}
                    size="small"
                    variant="standard"
                >
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="javascript">JavaScript (experimental)</MenuItem>
                    <MenuItem value="R">R (Limited)</MenuItem>
                    <MenuItem value="perl">Perl (Limited)</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

// Just so I have a couple options. Didn't end up using this one
export function DialectSelectToolbar(){
    const { dialect, setDialect, setToUpdate } = useContext(DataContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (dialect) => {
        setAnchorEl(null);
        setDialect(dialect);
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
            Dialect
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
            <MenuItem onClick={() => handleClose("python")}>{dialect === "python" ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>} Python</MenuItem>
            <MenuItem onClick={() => handleClose("javascript")}>{dialect === "javascript" ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>} JavaScript (experimental)</MenuItem>
            <MenuItem onClick={() => handleClose("R")}>{dialect === "R" ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>} R (Limited)</MenuItem>
            <MenuItem onClick={() => handleClose("perl")}>{dialect === "perl" ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>} Perl (Limited)</MenuItem>
        </Menu>
    </>
}