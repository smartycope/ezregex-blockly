import React from 'react';

export default function ReplacementInput({ text, setReplaceCode, setToUpdate, blockly = false }) {
    const props = {
        id: 'replacementInput',
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'off',
        wrap: "soft",
        rows: text?.split('\n').length,
    };
    const label = <label htmlFor="replacementInput">Replacement EZRegex Pattern:</label>;

    if (blockly) {
        return (
            <>
                {label}
                <textarea 
                    {...props}
                    value={text.length ? text : undefined}
                    readOnly={true}
                />
            </>
        );
    }

    return (
        <>
            {label}
            <textarea 
                {...props}
                onChange={e => { setReplaceCode(e.target.value); setToUpdate(true) }}
                defaultValue={text.length ? text : undefined}
            />
        </>
    );
}
