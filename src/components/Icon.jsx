
import React from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

export default function Icon(){
    const iconSize = 50
    return <>
        <Box id="title" sx={{ flexShrink: 1, display: 'flex', alignItems: 'center'}}>
            <Link href="https://github.com/smartycope/ezregex" underline="hover" target="_blank" rel="noopener noreferrer" sx={{scale: '80%'}}>
                <img src="./logo192.png" id="logo" alt="EZRegex Logo" height={iconSize}/>
            </Link>
            <Typography variant="h1" component="h1" sx={{
                ml: -1,
                background: `linear-gradient(to right, #051A32, #59E6CD)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                fontWeight: 'bold',
                color: 'transparent',
                fontSize: `${iconSize/3}px`,
                position: 'relative',
                // top: '3px',
                // textOutline: '2px solid #14D7BA',
                fontFamily: "varela round",
            }}>REGEX</Typography>
        </Box>
        {/* <Typography variant="caption" id="version-caption" sx={{ color: '#ECFFFB'}}>Loading...</Typography> */}
    </>
}