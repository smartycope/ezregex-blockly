from sys import version
print('python version', version)

from pyscript import window, document, when
from pyscript.js_modules.communication import send_py2js as send_data
import json

import ezregex as er
from ezregex import *
print('ezregex version', er.__version__)

error = window.console.error

patternInput = document.querySelector('#patternInput')
replacementInput = document.querySelector('#replacementInput')
# textInput = document.querySelector('#textInput')
# textOutput = document.querySelector('#textOutput')
# regexOutput = document.querySelector('#regexOutput')
# isError = document.querySelector('#is-error')
# js2py = document.querySelector('#js2py')
# py2js = document.querySelector('#py2js')


def formatInput2code(s):
    # keywords = set(dir(builtins) + dir(er) + re.findall((lineStart + group(word) + ifFollowedBy(ow + '=')).str(), s))
    # print(anyExcept(anyof(*keywords), type='.*'))
    # s = re.sub((anyExcept('literal', type='.*')).str(), '"' + replace_entire.str() + '"', s)
    lines = s.splitlines()
    # Remove the last lines which are actually comments
    while s.splitlines()[-1].strip().startswith('#'):
        lines.pop(-1)
    # Insert the variable assignment to the last line
    lines.append('\n_rtn = '  + lines.pop(-1))
    return '\n'.join(lines)


def run_code(pattern, replacement=False):
    error: Exception
    prefix = 'Error'
    # Run the code, get the var, and get the JSON search info
    # Set the variable before the end of the last line so we can do variables in the text_area
    try:
        local = {}
        exec(formatInput2code(pattern), globals(), local)
        pattern = local['pattern']

        if isinstance(pattern, str):
            pattern = literal(pattern)

    except TypeError as err:
        prefix = "Invalid parameters"
        error = err
    except SyntaxError as err:
        prefix = 'Invalid syntax'
        error = err
    except Exception as err:
        error = err
    else:
        return pattern

    if replacement:
        err_msg = prefix + " in replacement pattern:"
    else:
        err_msg = prefix + " in pattern:"

    err_msg += '\n' + str(error.with_traceback(None))

    send_data('error', err_msg)
    return None


print
@when('custom', '#js2py')
def recieve_data(event):
    signal, data = event.detail
    data = json.loads(str(data))
    # print(f'Py script loaded data of type {type(data)}:')
    # print(data)
    match signal:
        case "update":
            update(*data)
        case _:
            error(f"Python script recieved unknown signal from js2py element: `{signal}` with data:\n{data}")

def update(pattern, replacement=None, text=None):
    # print('Py is using text:', text)

    if len(pattern):
        pattern = run_code(pattern)
        if pattern is not None:
            try:
                data = pattern._matchJSON(text)
            except Exception as err:
                error("Python script handled error when compiling EZRegex pattern:\n", str(err))
                send_data('error', str(err))
            else:
                send_data('response', json.dumps(data))
        else:
            send_data('error', 'Could not compile pattern')

    if replacement and len(replacement):
        replacement = run_code(replacement, replacement=True)
        if replacement is not None:
            try:
                data = replacement._matchJSON(text)
            except Exception as err:
                error("Python script handled error when compiling EZRegex pattern:\n", str(err))
                send_data('error', 'In replacement pattern: ' + str(err))
            else:
                send_data('response', json.dumps(data))
        else:
            send_data('error', 'Could not compile replacement pattern')


if patternInput:
    update(patternInput.value, replacementInput.value if replacementInput else None)
else:
    error('Warning: Python script couldnt find #patternInput')


try:
    version_caption = document.querySelector('#version-caption')
    version_caption.innerText = f'Copeland Carter | v{er.__version__}'
except Exception as err:
    error('Python Script: Somehow we couldnt find #version-caption')
