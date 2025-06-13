import React, { useContext } from 'react';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CachedIcon from '@mui/icons-material/Cached';
import DataContext from '../DataContext';

export default function TextInput() {
    const {text, setText, setToUpdate, data} = useContext(DataContext)
    const handleChange = (e) => {
        setText(e.target.value);
        setToUpdate(true);
    };

    const placeholder = text.length ? text : (data?.string || "Leave empty to generate an example of something which would match the pattern");

    return (
        <Box position="relative" display="inline-block" sx={{ mt: 2, width: '100%' }}>
            <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={10}
                variant="outlined"
                label="String to match against"
                id="textInput"
                value={text}
                onChange={handleChange}
                placeholder={placeholder}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
            />
            {/* Theres no point in refreshing if there's a user provided sample */}
            {text.length === 0 && <Tooltip title="Generate a different example">
                <IconButton
                    size="small"
                    onClick={() => setToUpdate(true)}
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        className: "update-button",
                        backgroundColor: 'background.paper',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    <CachedIcon fontSize="small" />
                </IconButton>
            </Tooltip>}
        </Box>
    );
}
