import React, { useContext } from 'react';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import DataContext from '../DataContext';

export default function ResultBox() {
    const {data} = useContext(DataContext)
    return <>
        <Typography variant="h5">Looking for matches in:</Typography>
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                bgcolor: 'background.paper',
                whiteSpace: 'pre-wrap',
            }}
        >
            {data?.['string HTML'] ? (
                <div dangerouslySetInnerHTML={{ __html: data?.['string HTML'].trim() }} />
            ) : (
                <Typography color="text.secondary" fontStyle="italic">
                    No text to display
                </Typography>
            )}
        </Paper>
    </>
}
