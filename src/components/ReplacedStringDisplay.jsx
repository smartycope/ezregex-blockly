import React, { useContext } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import DataContext from '../DataContext';

export default function ReplacedStringDisplay() {
    const {data} = useContext(DataContext)
    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>Replaced String:</Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                <pre style={{ margin: 0 }}>{data?.replaced}</pre>
            </Paper>
        </Box>
    )
}