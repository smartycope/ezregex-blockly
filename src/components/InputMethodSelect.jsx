import React from 'react';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { useContext } from 'react';
import DataContext from '../DataContext';

export default function InputMethodSelect() {
    const {inputType, setInputType} = useContext(DataContext)
    const handleChange = (e) => setInputType(e.target.value);

    return (
        <Box sx={{ minWidth: 200, mt: 1 }}>
            <FormControl fullWidth size="small" title="Choose how to input your pattern">
                <InputLabel id="input-type-label">Input Method</InputLabel>
                <Select
                    labelId="input-type-label"
                    id="input-type-selector"
                    value={inputType}
                    label="Input Method"
                    onChange={handleChange}
                    size="small"
                    variant="standard"
                >
                    <MenuItem value="blocks">Blocks</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
