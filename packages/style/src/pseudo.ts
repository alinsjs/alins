/*
 * @Author ' tackchen
 * @Date ' 2022-10-25 08 '13 '09
 * @Description ' Coding something
 */


const NoArgPseudo = ['active', 'any-link', 'blank', 'checked', 'current', 'default',
    'defined', 'disabled', 'drop', 'empty', 'enabled',
    'first', 'first-child', 'first-of-type', 'fullscreen', 'future', 'focus',
    'focus-visible', 'focus-within', 'host ',
    'hover', 'indeterminate', 'in-range', 'invalid', 'last-child',
    'last-of-type', 'left', 'link', 'local-link', 'only-child',
    'only-of-type', 'optional', 'out-of-range', 'past', 'placeholder-shown', 'read-only',
    'read-write', 'required', 'right', 'root', 'scope', 'target',
    'target-within', 'user-invalid', 'valid', 'visited'] as const;

const ArgPseudo = ['dir', 'where', 'has', 'host', 'host-context', 'is', 'lang', 'not', 'nth-child',
    'nth-col', 'nth-last-child', 'nth-last-col', 'nth-last-of-type', 'nth-of-type', 'where'] as const;

type TPseudoName = (typeof NoArgPseudo)[number] | (typeof ArgPseudo)[number];

export function pseudo (name: TPseudoName, arg: number|string) {
    
    return (...args: any[]) => {

    };
}

export const hover = pseudo('hover');