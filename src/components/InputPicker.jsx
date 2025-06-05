import React from 'react';

export default function InputPicker({ setInputType, inputType }) {
    const handleChange = e => setInputType(e.target.value);
    
    return (
        <span id='input-picker'>
            <label htmlFor="input-type-selector">Input method:</label>
            <select 
                name="input-type" 
                id='input-type-selector' 
                required 
                onChange={handleChange} 
                defaultChecked={inputType}
            >
                <option value="blocks">Blocks</option>
                <option value="manual">Manual</option>
            </select>
            <br/>
        </span>
    );
}
