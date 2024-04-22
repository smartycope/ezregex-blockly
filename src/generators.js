import { Block, Generator } from "blockly"
import { Order } from "./ezregex"
import * as Blockly from "blockly"


const get = (block, generator, name='INPUT', defalt="''") => generator.statementToCode(block, name, Order.ATOMIC).trim() || defalt
const getVar = (block, name='VAR') => block.workspace.getVariableMap().getVariableById(block.getFieldValue(name)).name

const serializers = {
// custom
    "string": (blk, gen) => "'" + blk.getFieldValue('INPUT').replace('\\', '\\\\').replace("'", "\\'") + "'",
    "setVar": (blk, gen) => `${getVar(blk)} = `,
    "getVar": (blk, gen) => `${getVar(blk)}`,
    "compiler": (blk, gen) => `pattern = `,
    "replacementCompiler": (blk, gen) => `replacement = `,
// positionals
    "stringStart": (blk, gen) => `stringStart`,
    "stringEnd": (blk, gen) => `stringEnd`,
    "lineStart": (blk, gen) => `lineStart`,
    "lineEnd": (blk, gen) => `lineEnd`,
    "wordBoundary": (blk, gen) => `wordBoundary`,
    "notWordBoundary": (blk, gen) => `notWordBoundary`,
// literals
    "tab": (blk, gen) => `tab`,
    "space": (blk, gen) => `space`,
    "spaceOrTab": (blk, gen) => `space_or_tab`,
    "newline": (blk, gen) => `newline`,
    "carriageReturn": (blk, gen) => `carriage_return`,
    "quote": (blk, gen) => `quote`,
    "verticalTab": (blk, gen) => `vertical_tab`,
    "formFeed": (blk, gen) => `form_feed`,
    "comma": (blk, gen) => `comma`,
    "period": (blk, gen) => `period`,
    'underscore': (blk, gen) => `underscore`,
// not literals
    "notWhitespace": (blk, gen) => `not_whitespace`,
    "notDigit": (blk, gen) => `not_digit`,
    "notWord": (blk, gen) => `not_word`,
// catagories
    "whitespace": (blk, gen) => `whitespace`,
    "whitechunk": (blk, gen) => `whitechunk`,
    "digit": (blk, gen) => `digit`,
    "letter": (blk, gen) => `letter`,
    "number": (blk, gen) => `number`,
    "word": (blk, gen) => `word`,
    "wordChar": (blk, gen) => `word_char`,
    "anything": (blk, gen) => `anything`,
    "chunk": (blk, gen) => `chunk`,
    "uppercase": (blk, gen) => `uppercase`,
    "lowercase": (blk, gen) => `lowercase`,
    "hexDigit": (blk, gen) => `hex_digit`,
    "octDigit": (blk, gen) => `oct_digit`,
    "punctuation": (blk, gen) => `punctuation`,
    "controller": (blk, gen) => `controller`,
    "printable": (blk, gen) => `printable`,
    "printableAndSpace": (blk, gen) => `printable_and_space`,
    "alphaNum": (blk, gen) => `alpha_num`,
    "unicode": (blk, gen) => `unicode('${blk.getFieldValue('NAME')}')`,
    "anyBetween": (blk, gen) => `any_between('${blk.getFieldValue('A')}', '${blk.getFieldValue('B')}')`,
// amounts
    "matchMax": (blk, gen) => `match_max(${get(blk, gen)})`,
    "amt": (blk, gen) => `amt(${blk.getFieldValue('NUM')}, ${get(blk, gen)})`,
    "moreThan": (blk, gen) => `more_than(${blk.getFieldValue('NUM')}, ${get(blk, gen)})`,
    "matchRange": (blk, gen) => `match_range(${blk.getFieldValue('MIN')}, ${blk.getFieldValue('MAX')}, ${get(blk, gen)}${blk.getFieldValue('GREEDY') == 'TRUE' ? '' : ', greedy=False'}${blk.getFieldValue('POSSESSIVE') == 'TRUE' ? ', possessive=True' : ''})`,
    "atLeast": (blk, gen) => `at_least(${blk.getFieldValue('NUM')}, ${get(blk, gen)})`,
    "atMost": (blk, gen) => `at_most(${blk.getFieldValue('NUM')}, ${get(blk, gen)})`,
    "atLeastOne": (blk, gen) => `at_least_one(${get(blk, gen)}${blk.getFieldValue('GREEDY') == 'TRUE' ? '' : ', greedy=False'}${blk.getFieldValue('POSSESSIVE') == 'TRUE' ? ', possessive=True' : ''})`,
    "atLeastNone": (blk, gen) => `at_least_none(${get(blk, gen)}${blk.getFieldValue('GREEDY') == 'TRUE' ? '' : ', greedy=False'}${blk.getFieldValue('POSSESSIVE') == 'TRUE' ? ', possessive=True' : ''})`,
// choices
    "optional": (blk, gen) => `optional(${get(blk, gen)}${blk.getFieldValue('GREEDY') == 'TRUE' ? '' : ', greedy=False'}${blk.getFieldValue('POSSESSIVE') == 'TRUE' ? ', possessive=True' : ''})`,
    "either": (blk, gen) => `either(${get(blk, gen)}, ${get(blk, gen, 'OR_INPUT')})`,
    "oneOf": (blk, gen) => `one_of(TODO)`,
    "anyCharExcept": (blk, gen) => `any_char_except(*'${blk.getFieldValue('CHARS')}')`,
    // "anyExcept": (blk, gen) => ``,
// conditionals
    "ifFollowedBy": (blk, gen) => `if_followed_by(${get(blk, gen)})`,
    "ifNotFollowedBy": (blk, gen) => `if_not_followed_by(${get(blk, gen)})`,
    "ifPrecededBy": (blk, gen) => `if_preceded_by(${get(blk, gen)})`,
    "ifNotPrecededBy": (blk, gen) => `if_not_preceded_by(${get(blk, gen)})`,
    // "ifEnclosedWith": (blk, gen) => ``,
// grouping
    // "group": (blk, gen) => `group(${get(blk, gen)}${blk.getFieldValue('NAME') === '' ? '' : ", name='" + blk.getFieldValue('NAME') + "'"})`,
    "group": (blk, gen) => `group(${get(blk, gen)}${getVar(blk, 'GROUP') === '' ? '' : ", name='" + getVar(blk, 'GROUP') + "'"})`,
    "unnamedGroup": (blk, gen) => `group(${get(blk, gen)})`,
    "earlierGroup": (blk, gen) => `earlier_group('${getVar(blk, 'GROUP')}')`,
    "ifExists": (blk, gen) => `if_exists('${getVar(blk, 'GROUP')}', ${get(blk, gen, 'DOES')}, ${get(blk, gen, 'DOESNT')})`,
    "passiveGroup": (blk, gen) => `'Paul Blart, Mall Cop'`,
// replacement
    "rgroup": (blk, gen) => `rgroup('${blk.getFieldValue('RGROUP')}')`,
    "replaceEntire": (blk, gen) => `replace_entire`,
// premade
    "literallyAnything": (blk, gen) => `literallyAnything`,
    "signed": (blk, gen) => `signed`,
    "unsigned": (blk, gen) => `unsigned`,
    "plain_float": (blk, gen) => `plain_float`,
    "full_float": (blk, gen) => `full_float`,
    "int_or_float": (blk, gen) => `int_or_float`,
    "ow": (blk, gen) => `ow`,
    "email": (blk, gen) => `email`,
    "version": (blk, gen) => `version`,
    "version_numbered": (blk, gen) => `version_numbered`,
// misc
    "isExactly": (blk, gen) => `is_exactly(${get(blk, gen)})`,
    "raw": (blk, gen) => `raw('${blk.getFieldValue('REGEX')}')`,
// flags
    "ASCII": (blk, gen) => `ASCII`,
    "DOTALL": (blk, gen) => `DOTALL`,
    "IGNORECASE": (blk, gen) => `IGNORECASE`,
    "LOCALE": (blk, gen) => `LOCALE`,
    "MULTILINE": (blk, gen) => `MULTILINE`,
    "UNICODE": (blk, gen) => `UNICODE`,
}
export default serializers;
// console.log(Blockly.Variables.getVariable(Blockly.Workspace))
