import * as Blockly from 'blockly';
import blocks from './blocks';
// import forBlock from './generators/ezregex';
import {save, load} from './serialization';
import ezregexGenerator from './ezregex';
import forBlock from './generators'
import toolbox from './toolbox';
import './index.css';
import { useEffect, useRef, useState } from 'react';


const theme = {
    'base': Blockly.Themes.Classic,
    "categoryStyles" : {
        "replacement_category": {
            "colour": "#a55b5b"
        }
    },
    "componentStyles" : {
        "workspaceBackgroundColour": "#262730"
    },
    'startHats': true
}

Blockly.FieldTextInput.prototype.spellcheck_ = false

// Returns an array of objects.
var patternsFlyoutCallback = function(workspace) {
    var blockList = [{
        "kind": 'block',
        "type": "setVar",
        // 'fields': {
        //     'VAR': {
        //         "id": ,
        //     }
        // },
    }];

    for (const i of workspace.getVariablesOfType('Vars')) {
        console.log(i.id_);
        blockList.push({
            "kind": 'block',
            "type": "getVar",
            "fields":{
                'VAR': {
                    "id": i.id_,
                }
            }
        })
    }

    return blockList;
};

// To add a button, if we want
// {
    // "kind": "button",
    // "text": "Create Variable...",
    // "callbackKey": "createVarButton"
// },


// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
ezregexGenerator.forBlock = forBlock

// Register an extension to ensure variables and groups can't be set twice
Blockly.Extensions.register('one_var_at_a_time', function() {
        // These, and only these names are used with fields
        const field = this.getField('GROUP') || this.getField('VAR')
        field.setValidator(newValue => {
            // Check to see if any other blocks of this type specify this var/group already
            for (const i of this.workspace.getBlocksByType(this.type)){
                if (i === this) continue

                if ((i.getFieldValue('GROUP') || i.getFieldValue('VAR')) == newValue)
                    return null
            }
            return newValue
        })
    }
)

Blockly.Extensions.register('remove_plus', function() { this.removePlus = true })


export default function BlocklyComponent({setToUpdate, setCodes, replaceMode}){
    const blocklyDiv = useRef()
    const [workspace, setWorkspace] = useState(null)

    useEffect(() => {
        // Actually create the workspace
        const ws = Blockly.inject(blocklyDiv.current, {
            toolbox: toolbox,
            theme: theme,
            renderer: 'thrasos',
            // horizontalLayout: true,
            oneBasedIndex: false,
            sounds: false,
            // scrollbars: false,
        })

        ws.registerToolboxCategoryCallback('PATTERNS', patternsFlyoutCallback);

        // Create these, so they can't use a different variable named these
        ws.createVariable('pattern', null)
        ws.createVariable('replacement', null)

        // This function resets the code and output divs, shows the
        // generated code from the workspace, and evals the code.
        const runCode = () => {
            const code = ezregexGenerator.workspaceToCode(ws);
            setCodes(code)
            setToUpdate(true)
        };

        // Load the initial state from storage and run the code.
        load(ws);
        runCode();

        const changeListener = (e) => {
            // Don't run the code when the workspace finishes loading; we're
            // already running it once when the application starts.
            // Don't run the code during drags; we might have invalid state.
            if (!(e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || ws.isDragging()))
                runCode()
            else if (!e.isUiEvent)
                save(ws)
        }

        // Whenever the workspace changes meaningfully, run the code again.
        ws.addChangeListener(changeListener);

        setWorkspace(ws)

        return () => {
            ws.removeChangeListener(changeListener)
            ws.dispose()
        }
    }, [])

    // Ensure that if there isn't a compiler block already, to make one
    if (workspace?.getBlocksByType('compiler') < 1){
        const blk = workspace.newBlock('compiler')
        blk.setDeletable(false)
        blk.contextMenu = false
        workspace.centerOnBlock(blk.id)
        // I have NO IDEA why this is necissary, but it makes it work
        save(workspace)
        load(workspace)
    }
    if (replaceMode && (workspace?.getBlocksByType('replacementCompiler') < 1)){
        console.log("Creating replacementCompiler block");
        const blk = workspace.newBlock('replacementCompiler')
        blk.setDeletable(false)
        blk.contextMenu = false
        // Move it over so it's not on top of the other compiler
        blk.moveBy(150, 0)
        // workspace.centerOnBlock(blk.id)
        // I have NO IDEA why this is necissary, but it makes it work
        save(workspace)
        load(workspace)
    }
    // Remove the replacementCompiler if we're not in replacement mode
    if (!replaceMode){
        workspace?.getBlocksByType('replacementCompiler').forEach(element => {
            element.dispose()
        });
    }

    // const codeDiv = document.getElementById('generatedCode').firstChild;
    // const blocklyDiv = document.getElementById('blocklyDiv');

    // Register the button callbacks
    // ws.registerButtonCallback('createVarButton', (button) =>
    //     Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), null, 'Vars')
    // )

    return (<div id="blocklyArea" style={{position: "relative"}}>
                <div ref={blocklyDiv} id="blocklyDiv"/>
    </div>);
}
