import * as Blockly from 'blockly';

const ezregexGenerator = new Blockly.Generator('EZRegex')

export const Order = {
    ATOMIC: 0,
    NONE: 99,
}

ezregexGenerator.scrub_ = function(block, code, thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock()

    // Add a ' + ' in between everything, except when told not to
    if (nextBlock && !thisOnly && !block.removePlus) {
        return code + ' + ' + ezregexGenerator.blockToCode(nextBlock)
    } else if (block.removePlus){
        return code + ezregexGenerator.blockToCode(nextBlock)
    }
    return code
}

export default ezregexGenerator
