// TODO add labels at the top of the toolboxes

const toolbox = {
'kind': 'categoryToolbox',
'contents': [
    {'name': "Common",
        'kind': 'category',
        'contents': [
            {
                'kind': 'block',
                'type': "string",
            },
            {
                'kind': 'block',
                'type': "group",
            },
            {
                'kind': 'block',
                'type': "optional",
            },
            {
                'kind': 'block',
                'type': "matchMax",
            },
            {
                'kind': 'block',
                'type': "whitechunk",
            },
            {
                'kind': 'block',
                'type': "number",
            },
            {
                'kind': 'block',
                'type': "word",
            },
            {
                'kind': 'block',
                'type': "anything",
            },
            {
                'kind': 'block',
                'type': "chunk",
            },
            {
                'kind': 'block',
                'type': "uppercase",
            },
            {
                'kind': 'block',
                'type': "lowercase",
            },
            {
                'kind': 'block',
                'type': "raw",
            },
        ]
    },
    {'name': "Positionals",
        'kind': 'category',
        'categorystyle': 'text_category',
        'contents': [
            {
                'kind': 'block',
                'type': "stringStart",
            },
            {
                'kind': 'block',
                'type': "stringEnd",
            },
            {
                'kind': 'block',
                'type': "lineStart",
            },
            {
                'kind': 'block',
                'type': "lineEnd",
            },
            {
                'kind': 'block',
                'type': "wordBoundary",
            },
            {
                'kind': 'block',
                'type': "notWordBoundary",
            },
        ],
    },
    {'name': "Literals",
        'kind': 'category',
        'categorystyle': 'variable_category',
        'contents': [
            {
                'kind': 'block',
                'type': "string",
            },
            {
                'kind': 'block',
                'type': "tab",
            },
            {
                'kind': 'block',
                'type': "space",
            },
            {
                'kind': 'block',
                'type': "spaceOrTab",
            },
            {
                'kind': 'block',
                'type': "newline",
            },
            {
                'kind': 'block',
                'type': "carriageReturn",
            },
            {
                'kind': 'block',
                'type': "quote",
            },
            {
                'kind': 'block',
                'type': "verticalTab",
            },
            {
                'kind': 'block',
                'type': "formFeed",
            },
            {
                'kind': 'block',
                'type': "comma",
            },
            {
                'kind': 'block',
                'type': "period",
            },
            {
                'kind': 'block',
                'type': 'underscore',
            },
            {
                'kind': 'block',
                'type': "literallyAnything",
            },
            {
                'kind': 'block',
                'type': "signed",
            },
            {
                'kind': 'block',
                'type': "unsigned",
            },
            {
                'kind': 'block',
                'type': "plain_float",
            },
            {
                'kind': 'block',
                'type': "full_float",
            },
            {
                'kind': 'block',
                'type': "int_or_float",
            },
            {
                'kind': 'block',
                'type': "ow",
            },
            {
                'kind': 'block',
                'type': "email",
            },
            {
                'kind': 'block',
                'type': "version",
            },
            {
                'kind': 'block',
                'type': "version_numbered",
            },
        ]
    },
    {'name': "Not literals",
        'kind': 'category',
        'categorystyle': 'variable_dynamic_category',
        'contents': [
            {
                'kind': 'block',
                'type': "notWhitespace",
            },
            {
                'kind': 'block',
                'type': "notDigit",
            },
            {
                'kind': 'block',
                'type': "notWord",
            },
        ]
    },
    {'name': "Catagories",
        'kind': 'category',
        'categorystyle': 'list_category',
        'contents': [
            {
                'kind': 'block',
                'type': "whitespace",
            },
            {
                'kind': 'block',
                'type': "whitechunk",
            },
            {
                'kind': 'block',
                'type': "digit",
            },
            {
                'kind': 'block',
                'type': "letter",
            },
            {
                'kind': 'block',
                'type': "number",
            },
            {
                'kind': 'block',
                'type': "word",
            },
            {
                'kind': 'block',
                'type': "wordChar",
            },
            {
                'kind': 'block',
                'type': "anything",
            },
            {
                'kind': 'block',
                'type': "chunk",
            },
            {
                'kind': 'block',
                'type': "uppercase",
            },
            {
                'kind': 'block',
                'type': "lowercase",
            },
            {
                'kind': 'block',
                'type': "hexDigit",
            },
            {
                'kind': 'block',
                'type': "octDigit",
            },
            {
                'kind': 'block',
                'type': "punctuation",
            },
            {
                'kind': 'block',
                'type': "controller",
            },
            {
                'kind': 'block',
                'type': "printable",
            },
            {
                'kind': 'block',
                'type': "printableAndSpace",
            },
            {
                'kind': 'block',
                'type': "alphaNum",
            },
            {
                'kind': 'block',
                'type': "unicode",
            },
            {
                'kind': 'block',
                'type': "anyBetween",
            },
        ]
    },
    {'name': "Amounts",
        'kind': 'category',
        'categorystyle': 'loop_category',
        'contents': [
            {
                'kind': 'block',
                'type': "matchMax",
            },
            {
                'kind': 'block',
                'type': "amt",
            },
            {
                'kind': 'block',
                'type': "moreThan",
            },
            {
                'kind': 'block',
                'type': "matchRange",
            },
            {
                'kind': 'block',
                'type': "atLeast",
            },
            {
                'kind': 'block',
                'type': "atMost",
            },
            {
                'kind': 'block',
                'type': "atLeastOne",
            },
            {
                'kind': 'block',
                'type': "atLeastNone",
            },
        ]
    },
    {'name': "Choices",
        'kind': 'category',
        'categorystyle': 'math_category',
        'contents': [
            {
                'kind': 'block',
                'type': "optional",
            },
            {
                'kind': 'block',
                'type': "either",
            },
            {
                'kind': 'block',
                'type': "oneOf",
            },
            {
                'kind': 'block',
                'type': "anyCharExcept",
            },
            // {
                // 'kind': 'block',
                // 'type': "anyExcept",
            // },
        ]
    },
    {'name': "Conditionals",
        'kind': 'category',
        'categorystyle': 'logic_category',
        'contents': [
            {
                'kind': 'block',
                'type': "ifFollowedBy",
            },
            {
                'kind': 'block',
                'type': "ifNotFollowedBy",
            },
            {
                'kind': 'block',
                'type': "ifPrecededBy",
            },
            {
                'kind': 'block',
                'type': "ifNotPrecededBy",
            },
            {
                'kind': 'block',
                'type': "isExactly",
            },
            // {
                // 'kind': 'block',
                // 'type': "ifEnclosedWith",
            // },
        ]
    },
    {'name': "Grouping",
        'kind': 'category',
        'categorystyle': 'colour_category',
        'contents': [
            {'type': "group",
                'kind': 'block',
            },
            {'type': "unnamedGroup",
                'kind': 'block',
            },
            {'type': "earlierGroup",
                'kind': 'block',
            },
            {'type': "ifExists",
                'kind': 'block',
            },
            {'type': "passiveGroup",
                'kind': 'block',
            },
        ],
    },
    { 'kind': 'sep' },
    {'name': "Flags",
        'kind': 'category',
        'categorystyle': 'procedure_category',
        'contents': [
            {
                'kind': 'block',
                'type': "ASCII",
            },
            {
                'kind': 'block',
                'type': "DOTALL",
            },
            {
                'kind': 'block',
                'type': "IGNORECASE",
            },
            {
                'kind': 'block',
                'type': "LOCALE",
            },
            {
                'kind': 'block',
                'type': "MULTILINE",
            },
            {
                'kind': 'block',
                'type': "UNICODE",
            },
        ]
    },
    { 'kind': 'sep' },
    {'name': "Replacement",
        'kind': 'category',
        'categorystyle': 'replacement_category',
        'contents': [
            {
                'kind': 'block',
                'type': "rgroup",
            },
            {
                'kind': 'block',
                'type': "replaceEntire",
            },
        ]
    },
    { 'kind': 'sep' },
    {"name": "Patterns",
        "kind": "category",
        "custom": "PATTERNS"
    },
]
}

export default toolbox;
