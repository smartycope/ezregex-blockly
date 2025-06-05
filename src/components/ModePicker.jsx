import React from 'react';

export default function ModePicker({ setMode }) {
    const handleChange = e => setMode(e.target.value);
    
    return (
        <span>
            <label htmlFor="radio-group">Mode:</label>
            <div id="radio-group">
                <span className='radio-container'>
                    <input 
                        type="radio" 
                        id="Search" 
                        name="mode" 
                        value="search" 
                        defaultChecked 
                        onChange={handleChange}
                    />
                    <label htmlFor="Search">Search</label>
                </span>

                <span className='radio-container'>
                    <input 
                        type="radio" 
                        id="replace" 
                        name="mode" 
                        value="replace" 
                        onChange={handleChange}
                    />
                    <label htmlFor="replace">Replace</label>
                </span>


                <span className='radio-container'>
                    <input 
                        type="radio" 
                        id="Split" 
                        name="mode" 
                        value="split" 
                        onChange={handleChange}
                    />
                    <label htmlFor="Split">Split</label>
                </span>
            </div>
        </span>
    );
}
