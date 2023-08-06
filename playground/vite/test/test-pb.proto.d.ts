declare const define: {
    "enums": {
        "TYPE": {
            "player": 1,
            "viewer": 2
        }
    },
    "messages": {
        "Base": {
            "base": {
                "type": "int32",
                "id": 1
            }
        },
        "Test3": {
            "role": {
                "type": "enum",
                "id": 1,
                "enu": "TYPE"
            },
            "players": {
                "type": "string",
                "id": 2,
                "repeated": true
            },
            "age": {
                "type": "sint32",
                "id": 3
            }
        },
        "Sub": {
            "base": {
                "type": "sub",
                "id": 1,
                "sub": "Base"
            }
        },
        "SubRepeated": {
            "base": {
                "type": "sub",
                "id": 1,
                "repeated": true,
                "sub": "Base"
            }
        },
        "InnerSubRepeated": {
            "base": {
                "type": "sub",
                "id": 1,
                "repeated": true,
                "sub": "Base"
            },
            "inner": {
                "type": "sub",
                "id": 2,
                "sub": "InnerSubRepeated_Inner"
            }
        },
        "Number": {
            "a1": {
                "type": "bool",
                "id": 1
            },
            "a2": {
                "type": "int32",
                "id": 2
            },
            "a3": {
                "type": "int64",
                "id": 3
            },
            "a4": {
                "type": "sint32",
                "id": 4
            },
            "a5": {
                "type": "sint64",
                "id": 5
            },
            "a6": {
                "type": "uint32",
                "id": 6
            },
            "a7": {
                "type": "uint64",
                "id": 7
            },
            "a8": {
                "type": "fixed64",
                "id": 8
            },
            "a9": {
                "type": "sfixed64",
                "id": 9
            },
            "a10": {
                "type": "fixed32",
                "id": 10
            },
            "a11": {
                "type": "sfixed32",
                "id": 11
            },
            "a12": {
                "type": "float",
                "id": 12
            },
            "a13": {
                "type": "double",
                "id": 13
            }
        },
        "InnerSubRepeated_Inner": {
            "iiii": {
                "type": "int32",
                "id": 1
            }
        }
    },
    "syntax": 3,
    "package": "test.protocol",
    "import": []
};
export default define;