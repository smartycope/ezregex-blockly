import React from 'react';

export default function Matches({ matches }) {
    function groups(group, key) {
        return Object.entries(group[key]).map(([id, g]) => (
            <span id='groups-line' key={`span-${key}-${id}`}>
                <strong key={`strong-${key}-${id}`}>{id}:</strong>
                <pre 
                    className='group' 
                    key={`pre-${key}-${id}`} 
                    style={{ backgroundColor: g.color }}
                >
                    {g.string}
                </pre>
                <em key={`em-${key}-${id}`}> {`(${group.match.start}:${group.match.end})`}</em>
            </span>
        ));
    }

    return matches.map((group, index) => (
        <details key={`group-${group.match.start}-${group.match.end}-${index}`}>
            <summary key={`summary-${group.match.start}-${group.match.end}-${index}`}>
                <pre 
                    dangerouslySetInnerHTML={{ __html: group.match['string HTML'] }} 
                    key={`pre-${group.match.start}-${group.match.end}-${index}`}
                />
                <em key={`em-${group.match.start}-${group.match.end}-${index}`}>
                    {`(${group.match.start}:${group.match.end})`}
                </em>
            </summary>
            <div 
                className='group-contents' 
                key={`div-${group.match.start}-${group.match.end}-${index}`}
            >
                <h3 key={`h3-${group.match.start}-${group.match.end}-${index}`}>
                    Unnamed Groups
                </h3>
                {groups(group, 'unnamed groups')}
                <h3 key={`h3-2-${group.match.start}-${group.match.end}-${index}`}>
                    Named Groups
                </h3>
                {groups(group, 'named groups')}
            </div>
        </details>
    ));
}
