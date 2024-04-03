from sys import version
print('python version', version)

from pyscript import window, document, when
from pyscript.js_modules.communication import send_py2js as send_data
import json

import ezregex as er
from ezregex import *
print('ezregex version', er.__version__)


patternInput = document.querySelector('#patternInput').firstChild
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


def run_code(pattern):
    successful = False
    # Run the code, get the var, and get the JSON search info
    # Set the variable before the end of the last line so we can do variables in the text_area
    try:
        local = {}
        exec(formatInput2code(pattern), globals(), local)
        pattern = local['pattern']
    except TypeError as err:
        err_msg = 'Invalid parameters in EZRegex pattern:'
        err_msg += '\n' + str(err.with_traceback(None))
    except SyntaxError as err:
        err_msg = 'Invalid syntax in EZRegex pattern:'
        err_msg += '\n' + str(err.with_traceback(None))
    except Exception as err:
        err_msg = str(err.with_traceback(None))
    else:
        successful = True

    if not successful: print(err_msg)

    return pattern if successful else None


@when('custom', '#js2py')
def recieve_data(event):
    signal, data = event.detail
    # print(f'recieved data of type {type(data)}:')
    # print(data)
    data = json.loads(str(data))
    match signal:
        case "update":
            update(*data)
        case _:
            print(f"Unknown signal recieved from js2py element: `{signal}` with data:\n{data}")

def update(pattern, text=None):
    # textOutput = document.querySelector('#textOutput')
    # print(textOutput)
    # if pattern is None:
    #     pattern = patternInput.innerText
    print('Py is using text:', text)

    if len(pattern):
        # firstLine = pattern.split('<br>')[-1]
        result = run_code(pattern)
        if result is not None:
            try:
                data = result._matchJSON(text)
            except Exception as err:
                # isError.innerText = 'true'
                print("Handled error when compiling:", err)
                # regexOutput.innerText = str(result)
                # send_data('response', )
                # print('sent data')
            else:
                # isError.innerText = 'false'
                # textInput.value = data['string']
                # print('regexOutput', regexOutput)
                # print('textOutput', textOutput)
                # regexOutput.innerHTML = data['regex']
                # textOutput.innerHTML = data['stringHTML']
                send_data('response', json.dumps(data))
                # print('sent data')
        else:
            send_data('error', 'Could not compile pattern')

update(patternInput.innerHTML.split('<br/>'))

version_caption = document.querySelector('#version-caption')
version_caption.innerText = f'Copeland Carter | v{er.__version__}'
