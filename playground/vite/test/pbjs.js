export const encodeTYPE = {
    player: 1,
    viewer: 2,
};

export const decodeTYPE = {
    1: 'player',
    2: 'viewer',
};

export function encodeBase (message) {
    const bb = popByteBuffer();
    _encodeBase(message, bb);
    return toUint8Array(bb);
}

function _encodeBase (message, bb) {
    // optional int32 base = 1;
    const $base = message.base;
    if ($base !== undefined) {
        writeVarint32(bb, 8);
        writeVarint64(bb, intToLong($base));
    }
}

export function decodeBase (binary) {
    return _decodeBase(wrapByteBuffer(binary));
}

function _decodeBase (bb) {
    const message = {};

    end_of_message: while (!isAtEnd(bb)) {
        const tag = readVarint32(bb);

        switch (tag >>> 3) {
            case 0:
                break end_of_message;

                // optional int32 base = 1;
            case 1: {
                message.base = readVarint32(bb);
                break;
            }

            default:
                skipUnknownField(bb, tag & 7);
        }
    }

    return message;
}

export function encodeTest3 (message) {
    const bb = popByteBuffer();
    _encodeTest3(message, bb);
    return toUint8Array(bb);
}

function _encodeTest3 (message, bb) {
    // optional TYPE role = 1;
    const $role = message.role;
    if ($role !== undefined) {
        writeVarint32(bb, 8);
        writeVarint32(bb, $role);
    }

    // repeated string players = 2;
    const array$players = message.players;
    if (array$players !== undefined) {
        for (const value of array$players) {
            writeVarint32(bb, 18);
            writeString(bb, value);
        }
    }

    // optional sint32 age = 3;
    const $age = message.age;
    if ($age !== undefined) {
        writeVarint32(bb, 24);
        writeVarint32ZigZag(bb, $age);
    }
}

export function decodeTest3 (binary) {
    return _decodeTest3(wrapByteBuffer(binary));
}

function _decodeTest3 (bb) {
    const message = {};

    end_of_message: while (!isAtEnd(bb)) {
        const tag = readVarint32(bb);

        switch (tag >>> 3) {
            case 0:
                break end_of_message;

                // optional TYPE role = 1;
            case 1: {
                message.role = readVarint32(bb);
                break;
            }

            // repeated string players = 2;
            case 2: {
                const values = message.players || (message.players = []);
                values.push(readString(bb, readVarint32(bb)));
                break;
            }

            // optional sint32 age = 3;
            case 3: {
                message.age = readVarint32ZigZag(bb);
                break;
            }

            default:
                skipUnknownField(bb, tag & 7);
        }
    }

    return message;
}

export function encodeSub (message) {
    const bb = popByteBuffer();
    _encodeSub(message, bb);
    return toUint8Array(bb);
}

function _encodeSub (message, bb) {
    // optional Base base = 1;
    const $base = message.base;
    if ($base !== undefined) {
        writeVarint32(bb, 10);
        const nested = popByteBuffer();
        _encodeBase($base, nested);
        writeVarint32(bb, nested.limit);
        writeByteBuffer(bb, nested);
        pushByteBuffer(nested);
    }
}

export function decodeSub (binary) {
    return _decodeSub(wrapByteBuffer(binary));
}

function _decodeSub (bb) {
    const message = {};

    end_of_message: while (!isAtEnd(bb)) {
        const tag = readVarint32(bb);

        switch (tag >>> 3) {
            case 0:
                break end_of_message;

                // optional Base base = 1;
            case 1: {
                const limit = pushTemporaryLength(bb);
                message.base = _decodeBase(bb);
                bb.limit = limit;
                break;
            }

            default:
                skipUnknownField(bb, tag & 7);
        }
    }

    return message;
}

export function encodeSubRepeated (message) {
    const bb = popByteBuffer();
    _encodeSubRepeated(message, bb);
    return toUint8Array(bb);
}

function _encodeSubRepeated (message, bb) {
    // repeated Base base = 1;
    const array$base = message.base;
    if (array$base !== undefined) {
        for (const value of array$base) {
            writeVarint32(bb, 10);
            const nested = popByteBuffer();
            _encodeBase(value, nested);
            writeVarint32(bb, nested.limit);
            writeByteBuffer(bb, nested);
            pushByteBuffer(nested);
        }
    }
}

export function decodeSubRepeated (binary) {
    return _decodeSubRepeated(wrapByteBuffer(binary));
}

function _decodeSubRepeated (bb) {
    const message = {};

    end_of_message: while (!isAtEnd(bb)) {
        const tag = readVarint32(bb);

        switch (tag >>> 3) {
            case 0:
                break end_of_message;

                // repeated Base base = 1;
            case 1: {
                const limit = pushTemporaryLength(bb);
                const values = message.base || (message.base = []);
                values.push(_decodeBase(bb));
                bb.limit = limit;
                break;
            }

            default:
                skipUnknownField(bb, tag & 7);
        }
    }

    return message;
}

export function encodeNumber (message) {
    const bb = popByteBuffer();
    _encodeNumber(message, bb);
    return toUint8Array(bb);
}

function _encodeNumber (message, bb) {
    // optional bool a1 = 1;
    const $a1 = message.a1;
    if ($a1 !== undefined) {
        writeVarint32(bb, 8);
        writeByte(bb, $a1 ? 1 : 0);
    }

    // optional int32 a2 = 2;
    const $a2 = message.a2;
    if ($a2 !== undefined) {
        writeVarint32(bb, 16);
        writeVarint64(bb, intToLong($a2));
    }

    // optional int64 a3 = 3;
    const $a3 = message.a3;
    if ($a3 !== undefined) {
        writeVarint32(bb, 24);
        writeVarint64(bb, $a3);
    }

    // optional sint32 a4 = 4;
    const $a4 = message.a4;
    if ($a4 !== undefined) {
        writeVarint32(bb, 32);
        writeVarint32ZigZag(bb, $a4);
    }

    // optional sint64 a5 = 5;
    const $a5 = message.a5;
    if ($a5 !== undefined) {
        writeVarint32(bb, 40);
        writeVarint64ZigZag(bb, $a5);
    }

    // optional uint32 a6 = 6;
    const $a6 = message.a6;
    if ($a6 !== undefined) {
        writeVarint32(bb, 48);
        writeVarint32(bb, $a6);
    }

    // optional uint64 a7 = 7;
    const $a7 = message.a7;
    if ($a7 !== undefined) {
        writeVarint32(bb, 56);
        writeVarint64(bb, $a7);
    }

    // optional fixed64 a8 = 8;
    const $a8 = message.a8;
    if ($a8 !== undefined) {
        writeVarint32(bb, 65);
        writeInt64(bb, $a8);
    }

    // optional sfixed64 a9 = 9;
    const $a9 = message.a9;
    if ($a9 !== undefined) {
        writeVarint32(bb, 73);
        writeInt64(bb, $a9);
    }

    // optional fixed32 a10 = 10;
    const $a10 = message.a10;
    if ($a10 !== undefined) {
        writeVarint32(bb, 85);
        writeInt32(bb, $a10);
    }

    // optional sfixed32 a11 = 11;
    const $a11 = message.a11;
    if ($a11 !== undefined) {
        writeVarint32(bb, 93);
        writeInt32(bb, $a11);
    }

    // optional float a12 = 12;
    const $a12 = message.a12;
    if ($a12 !== undefined) {
        writeVarint32(bb, 101);
        writeFloat(bb, $a12);
    }

    // optional double a13 = 13;
    const $a13 = message.a13;
    if ($a13 !== undefined) {
        writeVarint32(bb, 105);
        writeDouble(bb, $a13);
    }
}

export function decodeNumber (binary) {
    return _decodeNumber(wrapByteBuffer(binary));
}

function _decodeNumber (bb) {
    const message = {};

    end_of_message: while (!isAtEnd(bb)) {
        const tag = readVarint32(bb);

        switch (tag >>> 3) {
            case 0:
                break end_of_message;

                // optional bool a1 = 1;
            case 1: {
                message.a1 = !!readByte(bb);
                break;
            }

            // optional int32 a2 = 2;
            case 2: {
                message.a2 = readVarint32(bb);
                break;
            }

            // optional int64 a3 = 3;
            case 3: {
                message.a3 = readVarint64(bb, /* unsigned */ false);
                break;
            }

            // optional sint32 a4 = 4;
            case 4: {
                message.a4 = readVarint32ZigZag(bb);
                break;
            }

            // optional sint64 a5 = 5;
            case 5: {
                message.a5 = readVarint64ZigZag(bb);
                break;
            }

            // optional uint32 a6 = 6;
            case 6: {
                message.a6 = readVarint32(bb) >>> 0;
                break;
            }

            // optional uint64 a7 = 7;
            case 7: {
                message.a7 = readVarint64(bb, /* unsigned */ true);
                break;
            }

            // optional fixed64 a8 = 8;
            case 8: {
                message.a8 = readInt64(bb, /* unsigned */ true);
                break;
            }

            // optional sfixed64 a9 = 9;
            case 9: {
                message.a9 = readInt64(bb, /* unsigned */ false);
                break;
            }

            // optional fixed32 a10 = 10;
            case 10: {
                message.a10 = readInt32(bb) >>> 0;
                break;
            }

            // optional sfixed32 a11 = 11;
            case 11: {
                message.a11 = readInt32(bb);
                break;
            }

            // optional float a12 = 12;
            case 12: {
                message.a12 = readFloat(bb);
                break;
            }

            // optional double a13 = 13;
            case 13: {
                message.a13 = readDouble(bb);
                break;
            }

            default:
                skipUnknownField(bb, tag & 7);
        }
    }

    return message;
}

function pushTemporaryLength (bb) {
    const length = readVarint32(bb);
    const limit = bb.limit;
    bb.limit = bb.offset + length;
    return limit;
}

function skipUnknownField (bb, type) {
    switch (type) {
        case 0: while (readByte(bb) & 0x80) { } break;
        case 2: skip(bb, readVarint32(bb)); break;
        case 5: skip(bb, 4); break;
        case 1: skip(bb, 8); break;
        default: throw new Error('Unimplemented type: ' + type);
    }
}

function stringToLong (value) {
    return {
        low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
        high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
        unsigned: false,
    };
}

function longToString (value) {
    const low = value.low;
    const high = value.high;
    return String.fromCharCode(
        low & 0xFFFF,
        low >>> 16,
        high & 0xFFFF,
        high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

const f32 = new Float32Array(1);
const f32_u8 = new Uint8Array(f32.buffer);

const f64 = new Float64Array(1);
const f64_u8 = new Uint8Array(f64.buffer);

function intToLong (value) {
    value |= 0;
    return {
        low: value,
        high: value >> 31,
        unsigned: value >= 0,
    };
}

const bbStack = [];

function popByteBuffer () {
    const bb = bbStack.pop();
    if (!bb) return {bytes: new Uint8Array(64), offset: 0, limit: 0};
    bb.offset = bb.limit = 0;
    return bb;
}

function pushByteBuffer (bb) {
    bbStack.push(bb);
}

function wrapByteBuffer (bytes) {
    return {bytes, offset: 0, limit: bytes.length};
}

function toUint8Array (bb) {
    const bytes = bb.bytes;
    const limit = bb.limit;
    return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip (bb, offset) {
    if (bb.offset + offset > bb.limit) {
        throw new Error('Skip past limit');
    }
    bb.offset += offset;
}

function isAtEnd (bb) {
    return bb.offset >= bb.limit;
}

function grow (bb, count) {
    const bytes = bb.bytes;
    const offset = bb.offset;
    const limit = bb.limit;
    const finalOffset = offset + count;
    if (finalOffset > bytes.length) {
        const newBytes = new Uint8Array(finalOffset * 2);
        newBytes.set(bytes);
        bb.bytes = newBytes;
    }
    bb.offset = finalOffset;
    if (finalOffset > limit) {
        bb.limit = finalOffset;
    }
    return offset;
}

function advance (bb, count) {
    const offset = bb.offset;
    if (offset + count > bb.limit) {
        throw new Error('Read past limit');
    }
    bb.offset += count;
    return offset;
}

function readBytes (bb, count) {
    const offset = advance(bb, count);
    return bb.bytes.subarray(offset, offset + count);
}

function writeBytes (bb, buffer) {
    const offset = grow(bb, buffer.length);
    bb.bytes.set(buffer, offset);
}

function readString (bb, count) {
    // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
    const offset = advance(bb, count);
    const fromCharCode = String.fromCharCode;
    const bytes = bb.bytes;
    const invalid = '\uFFFD';
    let text = '';

    for (let i = 0; i < count; i++) {
        let c1 = bytes[i + offset], c2, c3, c4, c;

        // 1 byte
        if ((c1 & 0x80) === 0) {
            text += fromCharCode(c1);
        }

        // 2 bytes
        else if ((c1 & 0xE0) === 0xC0) {
            if (i + 1 >= count) text += invalid;
            else {
                c2 = bytes[i + offset + 1];
                if ((c2 & 0xC0) !== 0x80) text += invalid;
                else {
                    c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
                    if (c < 0x80) text += invalid;
                    else {
                        text += fromCharCode(c);
                        i++;
                    }
                }
            }
        }

        // 3 bytes
        else if ((c1 & 0xF0) == 0xE0) {
            if (i + 2 >= count) text += invalid;
            else {
                c2 = bytes[i + offset + 1];
                c3 = bytes[i + offset + 2];
                if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
                else {
                    c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
                    if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
                    else {
                        text += fromCharCode(c);
                        i += 2;
                    }
                }
            }
        }

        // 4 bytes
        else if ((c1 & 0xF8) == 0xF0) {
            if (i + 3 >= count) text += invalid;
            else {
                c2 = bytes[i + offset + 1];
                c3 = bytes[i + offset + 2];
                c4 = bytes[i + offset + 3];
                if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
                else {
                    c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
                    if (c < 0x10000 || c > 0x10FFFF) text += invalid;
                    else {
                        c -= 0x10000;
                        text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
                        i += 3;
                    }
                }
            }
        }

        else text += invalid;
    }

    return text;
}

function writeString (bb, text) {
    // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
    const n = text.length;
    let byteCount = 0;

    // Write the byte count first
    for (let i = 0; i < n; i++) {
        let c = text.charCodeAt(i);
        if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
            c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
        }
        byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }
    writeVarint32(bb, byteCount);

    let offset = grow(bb, byteCount);
    const bytes = bb.bytes;

    // Then write the bytes
    for (let i = 0; i < n; i++) {
        let c = text.charCodeAt(i);
        if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
            c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
        }
        if (c < 0x80) {
            bytes[offset++] = c;
        } else {
            if (c < 0x800) {
                bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
            } else {
                if (c < 0x10000) {
                    bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
                } else {
                    bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
                    bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
                }
                bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
            }
            bytes[offset++] = (c & 0x3F) | 0x80;
        }
    }
}

function writeByteBuffer (bb, buffer) {
    const offset = grow(bb, buffer.limit);
    const from = bb.bytes;
    const to = buffer.bytes;

    // This for loop is much faster than subarray+set on V8
    for (let i = 0, n = buffer.limit; i < n; i++) {
        from[i + offset] = to[i];
    }
}

function readByte (bb) {
    return bb.bytes[advance(bb, 1)];
}

function writeByte (bb, value) {
    const offset = grow(bb, 1);
    bb.bytes[offset] = value;
}

function readFloat (bb) {
    let offset = advance(bb, 4);
    const bytes = bb.bytes;

    // Manual copying is much faster than subarray+set in V8
    f32_u8[0] = bytes[offset++];
    f32_u8[1] = bytes[offset++];
    f32_u8[2] = bytes[offset++];
    f32_u8[3] = bytes[offset++];
    return f32[0];
}

function writeFloat (bb, value) {
    let offset = grow(bb, 4);
    const bytes = bb.bytes;
    f32[0] = value;

    // Manual copying is much faster than subarray+set in V8
    bytes[offset++] = f32_u8[0];
    bytes[offset++] = f32_u8[1];
    bytes[offset++] = f32_u8[2];
    bytes[offset++] = f32_u8[3];
}

function readDouble (bb) {
    let offset = advance(bb, 8);
    const bytes = bb.bytes;

    // Manual copying is much faster than subarray+set in V8
    f64_u8[0] = bytes[offset++];
    f64_u8[1] = bytes[offset++];
    f64_u8[2] = bytes[offset++];
    f64_u8[3] = bytes[offset++];
    f64_u8[4] = bytes[offset++];
    f64_u8[5] = bytes[offset++];
    f64_u8[6] = bytes[offset++];
    f64_u8[7] = bytes[offset++];
    return f64[0];
}

function writeDouble (bb, value) {
    let offset = grow(bb, 8);
    const bytes = bb.bytes;
    f64[0] = value;

    // Manual copying is much faster than subarray+set in V8
    bytes[offset++] = f64_u8[0];
    bytes[offset++] = f64_u8[1];
    bytes[offset++] = f64_u8[2];
    bytes[offset++] = f64_u8[3];
    bytes[offset++] = f64_u8[4];
    bytes[offset++] = f64_u8[5];
    bytes[offset++] = f64_u8[6];
    bytes[offset++] = f64_u8[7];
}

function readInt32 (bb) {
    const offset = advance(bb, 4);
    const bytes = bb.bytes;
    return (
        bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
    );
}

function writeInt32 (bb, value) {
    const offset = grow(bb, 4);
    const bytes = bb.bytes;
    bytes[offset] = value;
    bytes[offset + 1] = value >> 8;
    bytes[offset + 2] = value >> 16;
    bytes[offset + 3] = value >> 24;
}

function readInt64 (bb, unsigned) {
    return {
        low: readInt32(bb),
        high: readInt32(bb),
        unsigned,
    };
}

function writeInt64 (bb, value) {
    writeInt32(bb, value.low);
    writeInt32(bb, value.high);
}

function readVarint32 (bb) {
    let c = 0;
    let value = 0;
    let b;
    do {
        b = readByte(bb);
        if (c < 32) value |= (b & 0x7F) << c;
        c += 7;
    } while (b & 0x80);
    return value;
}

function writeVarint32 (bb, value) {
    value >>>= 0;
    while (value >= 0x80) {
        writeByte(bb, (value & 0x7f) | 0x80);
        value >>>= 7;
    }
    writeByte(bb, value);
}

function readVarint64 (bb, unsigned) {
    let part0 = 0;
    let part1 = 0;
    let part2 = 0;
    let b;

    b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
            b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

                    b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
                        b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
                            b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                                    b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                                        b = readByte(bb); part2 |= (b & 0x7F) << 7;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return {
        low: part0 | (part1 << 28),
        high: (part1 >>> 4) | (part2 << 24),
        unsigned,
    };
}

function writeVarint64 (bb, value) {
    const part0 = value.low >>> 0;
    const part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
    const part2 = value.high >>> 24;

    // ref: src/google/protobuf/io/coded_stream.cc
    const size =
    part2 === 0 ?
        part1 === 0 ?
            part0 < 1 << 14 ?
                part0 < 1 << 7 ? 1 : 2 :
                part0 < 1 << 21 ? 3 : 4 :
            part1 < 1 << 14 ?
                part1 < 1 << 7 ? 5 : 6 :
                part1 < 1 << 21 ? 7 : 8 :
        part2 < 1 << 7 ? 9 : 10;

    const offset = grow(bb, size);
    const bytes = bb.bytes;

    switch (size) {
        case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
        case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
        case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
        case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
        case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
        case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
        case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
        case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
        case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
        case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
    }
}

function readVarint32ZigZag (bb) {
    const value = readVarint32(bb);

    // ref: src/google/protobuf/wire_format_lite.h
    return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag (bb, value) {
    // ref: src/google/protobuf/wire_format_lite.h
    writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag (bb) {
    const value = readVarint64(bb, /* unsigned */ false);
    const low = value.low;
    const high = value.high;
    const flip = -(low & 1);

    // ref: src/google/protobuf/wire_format_lite.h
    return {
        low: ((low >>> 1) | (high << 31)) ^ flip,
        high: (high >>> 1) ^ flip,
        unsigned: false,
    };
}

function writeVarint64ZigZag (bb, value) {
    const low = value.low;
    const high = value.high;
    const flip = high >> 31;

    // ref: src/google/protobuf/wire_format_lite.h
    writeVarint64(bb, {
        low: (low << 1) ^ flip,
        high: ((high << 1) | (low >>> 31)) ^ flip,
        unsigned: false,
    });
}
