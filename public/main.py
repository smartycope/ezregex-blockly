from sys import version
print('python version', version)

from pyscript import window, document, when
from pyscript.js_modules.communication import send_py2js as send_data # type: ignore
import json

import ezregex.python as python_dialect
import ezregex.perl as perl_dialect
from ezregex import api, __version__ as ezregex_version
print('ezregex version', ezregex_version)

import re

dialects = {
    'python': python_dialect,
    'perl': perl_dialect,
}
dialect = 'python'

error = window.console.error

patternInput = document.querySelector('#patternInput')
replacementInput = document.querySelector('#replacementInput')


def formatInput2code(s):
    # keywords = set(dir(builtins) + dir(er) + re.findall((lineStart + group(word) + ifFollowedBy(ow + '=')).str(), s))
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
        exec(pattern, dialects[dialect].__dict__, local)
        pattern = local['pattern']

        if isinstance(pattern, str):
            pattern = dialects[dialect].literal(pattern)

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

def set_dialect(to):
    global dialect
    dialect = to

@when('custom', '#js2py')
def recieve_data(event):
    signal, data = event.detail
    match signal:
        case "update":
            update(*json.loads(str(data)))
        case "set_dialect":
            set_dialect(data)
        case _:
            error(f"Python script recieved unknown signal from js2py element: `{signal}` with data:\n{data}")

def update(pattern, replacement_pattern=None, text=None):
    if text is not None and not len(text.strip()):
        text = None

    replacement = None
    if len(pattern):
        pattern = run_code(pattern)
    if replacement_pattern is not None:
        replacement = run_code(replacement_pattern, replacement=True)


    if pattern is None:
        send_data('error', 'Could not compile pattern')
        return
    if replacement is None and replacement_pattern is not None:
        send_data('error', 'Could not compile replacement pattern')
        return


    try:
        data = api(pattern, replacement, text)
    except Exception as err:
        error("Python script handled error when compiling EZRegex pattern:\n", str(err))
        # send_data('error', f'Error on line {err.__traceback__.tb_lineno}: {err}')
        send_data('error', str(err))
        return
    else:
        send_data('response', json.dumps(data))


if patternInput:
    update(patternInput.value, replacementInput.value if replacementInput else None)
else:
    error('Warning: Python script couldnt find #patternInput')

try:
    version_caption = document.querySelector('#version-caption')
    version_caption.innerText = f'Copeland Carter | v{ezregex_version}'
except Exception as err:
    error('Python Script: Somehow we couldnt find #version-caption')
