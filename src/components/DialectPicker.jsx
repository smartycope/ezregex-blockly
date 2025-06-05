import React from 'react';

export default function DialectPicker({ setDialect }) {
    const handleChange = e => setDialect(e.target.value);
    
    return (
        <span id="dialect-picker">
            <label htmlFor="dialect-selector">Regex Dialect:</label>
            <select 
                name="dialect" 
                id='dialect-selector' 
                required 
                onChange={handleChange}
            >
                <option value="python">Python</option>
                <option value="javascript">JavaScript (experimental)</option>
                <option value="R">R (Limited)</option>
                <option value="perl">Perl (Limited)</option>
            </select>
            <br/>
        </span>
    );
}
