/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-13 18:00:27
 * @Description: Coding something
 */

import $protobuf from 'protobufjs/dist/light/protobuf.min';

import data from '../test-pb.proto';

const nested = {
};

for (const key in data.enums) {
    nested[key] = {values: data.enums[key]};
}
for (const key in data.messages) {
    const item = data.messages[key];
    const nest = {};
    for (const key in item) {
        const config = item[key];
        const type = config.type;
        nest[key] = {
            id: config.id,
            type: type === 'sub' ? config.sub : (type === 'enum' ? config.enu : type)
        };

        if (config.repeated) {
            nest[key].rule = 'repeated';
        }
    }
    nested[key] = {fields: nest};
}

console.warn('【protobuf nested】', nested);

const proto = ($protobuf.roots['default'] || ($protobuf.roots['default'] = new $protobuf.Root()))
    .addJSON({
        cg: {
            nested: {
                protocol: {
                    nested
                }
            }
        }
    });

const protoRoot = proto.lookup('cg.protocol');

export function encodePB (name, payload) {
    const pbObject = protoRoot[name];
    const errMsg = pbObject.verify(payload);
    if (errMsg) { throw Error(errMsg); }
    const pbMsg = pbObject.create(payload);
    const msgBuffer = pbObject.encode(pbMsg).finish();
    return [].slice.call(msgBuffer);
}

export function decodePB (name, array) {
    const protobufBuffer = new Uint8Array(array);
    const message = protoRoot[name];
    return message.decode(protobufBuffer);
}