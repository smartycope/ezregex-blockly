import React, { useContext } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import DataContext from '../DataContext';

export default function SplitStringDisplay(){
    const {data} = useContext(DataContext)
    return <>
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5">Split String:</Typography>
            <List>
                {data.split.map((item, index) => (
                    <ListItem key={index} sx={{ pt: 0, pb: 0, outline: '1px solid', borderRadius: '5px'}}>
                        <ListItemText primary={item || <em style={{color: 'text.disabled'}}>Empty</em>} />
                    </ListItem>
                ))}
            </List>
        </Box>
    </>
}