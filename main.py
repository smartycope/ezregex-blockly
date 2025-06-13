from sys import version
print('python version', version)

from pyscript import window, document, when
from pyscript.js_modules.communication import send_py2js as send_data # type: ignore
import json

import ezregex.python as python_dialect
import ezregex.perl as perl_dialect
import ezregex.javascript as javascript_dialect
import ezregex.R as R_dialect
from ezregex import api, __version__ as ezregex_version
print('ezregex v', ezregex_version, sep='')

# import re

dialects = {
    'python': python_dialect,
    'perl': perl_dialect,
    'javascript': javascript_dialect,
    'R': R_dialect,
}
dialect = 'python'

error = window.console.error
info = window.console.info
debug = window.console.debug

# patternInput = document.querySelector('#patternInput')
# replacementInput = document.querySelector('#replacementInput')


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
    # debug('run_code called')
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
    # debug('run_code finished')
    return None

def set_dialect(to):
    global dialect
    dialect = to

@when('custom', '#js2py')
def recieve_data(event):
    # debug('recieve_data called with', event)
    signal, data = event.detail
    match signal:
        case "update":
            update(*json.loads(str(data)))
        case "set_dialect":
            set_dialect(data)
        case _:
            error("line 96 ish: Python script recieved unknown signal from js2py element: `{signal}` with data:\n{data}")

def update(pattern, replacement_pattern=None, text=None):
    # debug('update called')
    # debug(f'pattern = `{pattern}`\nreplacement_pattern = `{replacement_pattern}`\ntext = `{text}`')
    if text is not None and not len(text.strip()):
        text = None

    replacement = None
    if len(pattern):
        pattern = run_code(pattern)
    else:
        return

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
    except NotImplementedError as err:
        send_data('error', 'Unable to invert pattern, try providing text to search')
    except Exception as err:
        error("line 123 ish: Python script handled error when compiling EZRegex pattern:\n", str(err))
        # send_data('error', f'Error on line {err.__traceback__.tb_lineno}: {err}')
        send_data('error', str(err))
        return
    else:
        send_data('response', json.dumps(data))

# Tell the JS we're loaded, so they can call for an update from us
send_data('loaded', None)

try:
    version_caption = document.querySelector('#version-caption')
    version_caption.innerText = f'Copeland Carter | EZRegex v{ezregex_version}'
except Exception as err:
    error('line -1: Python Script: Somehow we couldnt find #version-caption')
