import React from 'react';

export default function RegexDisplay({ regex }) {
    return (
        <div id="regexOutput">
            <code id='regex-code'>{regex}</code>
            <button 
                id='copy-button' 
                onClick={() => navigator.clipboard.writeText(regex)}
            >
                Copy
            </button>
        </div>
    );
}
