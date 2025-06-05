import React from 'react';

export default function TextInput({ generated, text, setText, setToUpdate }) {
    return (
        <>
            <label htmlFor="textInput">String to match against:</label>
            <textarea
                id='textInput'
                rows={text?.split('\n').length}
                placeholder={text.length ? text : (generated ? generated : "Leave empty to generate an example")}
                onChange={e => { setText(e.target.value); setToUpdate(true) }}
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                defaultValue={text.length ? text : undefined}
            />
        </>
    );
}
