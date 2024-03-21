import './App.css';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import { useState } from 'react';

// TODO: nested chains don't all move together

function IntSelector(){
    return(
        <input type='number' style={{
            width: '50px',
        }}/>
    )
}

function EZRegex({reset=null, children}) {
    const [, drag, ] = useDrag(() => ({
        type: 'ezregex',
        item: {children}, // This says what the thing is we're moving
        end: reset, // This says to move the thing, not copy it
        // This only effects what the cursor looks like as it's dragging
        options: { dropEffect: reset ? 'move' : 'copy' },
    }))

    return (
        <div ref={drag} className="ezregex">
            <DropEZRegex side={true}/>
            {children}
            <DropEZRegex side={true}/>
        </div>
    )
}


function DropEZRegex({side=false}) {
    const defaultNested = <div className='default-drop-ezregex'>{side ? '+' : null}</div>
    const [nested, setNested] = useState(defaultNested)
    const [{ canDrop, isOver}, drop] = useDrop(() => ({
        accept: 'ezregex',
        drop: (item, monitor) => {
            setNested(<EZRegex reset={() => setNested(defaultNested)}> {item.children} </EZRegex>)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }))

    if (side){
        return (
            <div ref={drop} className='drop-ezregex-side' style={{
                backgroundColor: isOver ? (canDrop ? 'green' : 'red') : 'lightgreen',
            }}>
                {nested}
            </div>
        )
    } else {
        return (
            <div ref={drop} className='drop-ezregex' style={{
                backgroundColor: isOver ? (canDrop ? 'green' : 'red') : 'lightgreen',
            }}>
                {nested}
            </div>
        )
    }
}



function MatchAmt(){
    return (
        <EZRegex>
            Match Amount:
            <IntSelector/>
            <DropEZRegex/>
        </EZRegex>
    )
}


function Compiler(){
    return (
        <DropEZRegex/>
    )
}



function App() {
    return (
        <div className="App">
            <DndProvider backend={"ontouchstart" in window ? TouchBackend : HTML5Backend}>
                <MatchAmt/>
                <br/>
                <MatchAmt/>
                <br/>
                <Compiler/>
                {/* <svg width="200" height="100">

                    <path fill="none" stroke="black" strokeWidth="2" d="m321.62162,94.05405l0,75.13514l36.21622,36.21622l0,89.18919l-31.35135,30.81081l0,94.05405l-27.02703,0l0,-326.48649l22.16216,1.08108z"/>
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">Your text here</text>
                </svg>
                <svg width="400" height="500" scale={2}>

                    <path d="m321.62162,94.05405l0,75.13514l36.21622,36.21622l0,89.18919l-31.35135,30.81081l0,94.05405l-27.02703,0l0,-326.48649l22.16216,1.08108z" opacity="NaN" stroke="#000" fill="none"/>
                </svg> */}
                <div className='svgs'>
                    {/* <text x="30%" y="30%" dominantBaseline="middle" textAnchor="middle">Your text here</text> */}
                    <svg width="200" height="100" scale={20}>
                        <polyline points="5,0 5,5 0,10 0,20 5,25 5,30" fill="none" stroke="black" />
                    </svg>
                    <p>text here!</p>
                    <svg width="200" height="100">
                        <polyline points="0,0 0,5 5,10 5,20 0,25 0,30" fill="none" stroke="black" />
                    </svg>
                </div>
                <svg
                    width="10mm"
                    height="60mm"
                    viewBox="0 0 20.022602 60"
                    version="1.1"
                    id="svg1"
                    xmlSpace='preserve'
                    xmlns="http://www.w3.org/2000/svg"
                    xm
                    // xmlns:svg="http://www.w3.org/2000/svg"
                >
                <defs/>
                    <g
                        id="layer1"><path
                        style={{fill: "#24a18e"}}//, fillOpacity:1, strokeWidth:0.264583}}
                        d="M 10,3.6191812 V 10 c 0,0 9.979818,6.164543 10,10 0.03546,6.739233 0.0243,13.080826 0,20 -0.01312,3.735962 -10,10 -10,10 v 6.380819 A 3.6191812,3.6191812 135 0 1 6.3808188,60 H 0 V 0 H 6.3808188 A 3.6191812,3.6191812 45 0 1 10,3.6191812 Z"
                        id="path11" />
                    </g>
                </svg>
            </DndProvider>

        </div>
    );
}

export default App;
