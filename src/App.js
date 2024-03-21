import './App.css';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import {HTML5Backend} from "react-dnd-html5-backend";
import {TouchBackend} from "react-dnd-touch-backend";
import { useState } from 'react';

// TODO: nested chains don't all move together

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
            <DropEZRegex side={true}>
                <img src='left.svg' className='side' alt=''/>
            </DropEZRegex>

            <div className='ezregex-inner'>
                {children}
            </div>

            <DropEZRegex side={true}>
                <img src='right.svg' className='side' alt=''/>
            </DropEZRegex>
        </div>
    )
}

function DropEZRegex({children=<div className='default-drop-ezregex'/>, side=false}) {
    const [nested, setNested] = useState(children)
    const [{ canDrop, isOver}, drop] = useDrop(() => ({
        accept: 'ezregex',
        drop: (item, monitor) => {
            setNested(<EZRegex reset={() => setNested(children)}> {item.children} </EZRegex>)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }))

    // if (side){
    //     return (
    //         <div ref={drop} className='drop-ezregex-side' style={{
    //             // backgroundColor: isOver ? (canDrop ? 'green' : 'red') : 'lightgreen',
    //         }}>
    //             {nested}
    //         </div>
    //     )
    // } else {
        return (
            <div ref={drop} className='drop-ezregex' style={{
                // backgroundColor: isOver ? (canDrop ? 'green' : 'red') : 'lightgreen',
            }}>
                {nested}
            </div>
        )
    // }
}

function DropEZRegexInline(){
    const defaultNested = <div className='default-drop-ezregex'/>
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

    return (
        <div ref={drop} id='drop-ezregex-inline' style={{
            backgroundColor: isOver ? (canDrop ? 'green' : 'red') : 'lightgreen',
        }}>
            <img src='right.svg' id='drop-ezregex-inline-connector' alt=''/>
            <div id='nested-ezregex'>
                {nested}
            </div>
        </div>
    )
}

function MatchAmt(){
    return (
        <EZRegex>
            Match Amount:
            <input type='number'/>
            <DropEZRegexInline/>
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
            </DndProvider>
        </div>
    );
}

export default App;
