# EZRegex-Blockly
This is the 2nd (2.5th?) version of the frontend for the [EZRegex library](https://pypi.org/project/ezregex/). The first version (which I'm planning to take down eventually, so this will break at some point) is at [ezregex.streamlit.app](https://ezregex.streamlit.app/). This version is a re-write of that, but using *proper* tools like [React](https://react.dev/) & [Blockly](https://developers.google.com/blockly/) instead of [streamlit](https://streamlit.io/) (I love streamlit, but it's not the end of the project).

This repo is (will be) hosted on [ezregex.org](https://ezregex.org/)

## Running Locally
```bash
npm start
```

## Structure
This uses a really clever (if I don't say so myself) method of using a Python library (EZRegex) in the browser. It uses [py-script](https://pyscript.net/) to load Python client-side, import ezregex, and communicate with the React script.

The Python script is in [main.py](public/main.py), and communicates back and forth to JavaScript via custom events (with .detail) fired on the elements with ids `js2py` and `py2js`, in [index.html](public/index.html). The functions which send those events are in [communication.js](public/communication.js), which both [App.jsx](src/App.jsx) and [main.py](public/main.py) import.

This project uses [Blockly](https://developers.google.com/blockly/), as well as boring ways to make expressions. I was very impressed with it and highly recommend it.

- [blocks.js](src/blocks.js) actually describes how all the blocks look & act
- [generators.js](src/generators.js) holds the serializers for all the Blockly blocks
- [toolbox.js](src/toolbox.js) describes how the toolbox (the sidebar that holds all the blocks) looks & acts
- [ezregex.js](src/ezregex.js) customizes the generator that takes the output of the things in [generators.js](src/generators.js) and puts them together (mostly by adding '+'s)
- [serialization.js](src/serialization.js) handles serializing & deserializing the whole workspace
- [BlocklyComponent.jsx](src/BlocklyComponent.jsx) is the React component that handles the Blockly element
