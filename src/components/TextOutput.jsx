import React from 'react';

export default function TextOutput({ html }) {
    return <pre id="textOutput" dangerouslySetInnerHTML={{ __html: html }}></pre>;
}
