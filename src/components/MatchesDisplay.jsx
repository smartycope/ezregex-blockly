import React, {useContext} from 'react';
import DataContext from '../DataContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';



function Group({group, which}){
    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
        setOpen(!open);
    };
    const hasAny = Object.entries(group[which]).length > 0
    const k = `${which}`
    return <>
        <ListItemButton id='groups-line' key={'span-' + k} onClick={handleClick} sx={{ pl: 4, color: hasAny ? 'text.primary' : 'text.disabled' }}>
            {!hasAny && 'No '}
            {hasAny ? which.charAt(0).toUpperCase() + which.slice(1) : which}
            {hasAny && (open ? <ExpandLess sx={{ml: 'auto'}} /> : <ExpandMore sx={{ml: 'auto'}} />)}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit key={'collapse-' + k}>
            <List component="div" disablePadding key={'list-' + k}>
                {Object.entries(group[which]).map(([id, g]) => {
                    const k2 = `${id}-${g.start}-${g.end}-${k}`
                    return (
                    <ListItem id='groups-line' key={'listitem-' + k2} sx={{ pl: 8 }}>
                        <strong key={'strong-' + k2}>{id}:</strong>
                        <pre
                            className='group'
                            key={'pre-' + k2}
                            style={{ backgroundColor: g.color, margin: '0', marginRight: '.25rem', marginLeft: '.25rem', borderRadius: '5px'}}
                        >
                            {g.string}
                        </pre>
                        <em key={'em-' + k2}> {`(${g.start}:${g.end})`}</em>
                    </ListItem>
                    )
                })}
            </List>
        </Collapse>
    </>
}


function Match({match, index, startOpen}){
    const [open, setOpen] = React.useState(startOpen);
    const handleClick = () => {
        setOpen(!open);
    };
    const k = `${match.match.start}-${match.match.end}-${index}`
    return (
        // TODO: make this be the paper theme color instead of default black
        <Box sx={{ pl: 0, outline: '1px solid', borderRadius: '5px', margin: '2px'}} key={'box-' + k}>
        <ListItemButton key={'button-' + k} onClick={handleClick}>
            <ListItem key={'listitem-' + k}>
            <pre
                dangerouslySetInnerHTML={{ __html: match.match['string HTML'] }}
                style={{ margin: '0', borderRadius: '5px', paddingRight: '.25rem'}}
                key={'pre-' + k}
            />
            <em key={'em-' + k}>
                {`(${match.match.start}:${match.match.end})`}
            </em>
            {open ?
                <ExpandLess key={'expandless-' + k} sx={{ml: 'auto'}}/> :
                <ExpandMore key={'expandmore-' + k} sx={{ml: 'auto'}}/>
            }
            </ListItem>
        </ListItemButton>
        <Divider key={'divider-' + k}/>
        <Collapse in={open} timeout="auto" unmountOnExit key={'collapse-' + k}>
            <List component="div" disablePadding key={'list-' + k}>
                <Group group={match} which='named groups' key={'group-named-' + k}/>
                <Group group={match} which='unnamed groups' key={'group-unnamed-' + k}/>
            </List>
        </Collapse>
        </Box>
    )
}

// A List of Lists of Lists
export default function Matches() {
    const {data} = useContext(DataContext)

    if (!data) return null

    return <>
    <Typography variant="h5" sx={{ mt: 3 }}>Matches:</Typography>
    <List
        variant="outlined"
        // Not sure why this is needed
        sx={{ mt: -1}}
    >
        {data.matches.map((match, index) => <Match match={match} index={index} startOpen={data.matches.length === 1} key={'match-' + index}/>)}
    </List>
    </>
}
