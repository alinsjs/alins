/*
import { IAttributes } from 'packages/core/src/element/jsx';
 * @Author: chenzhongsheng
 * @Date: 2023-07-06 22:46:06
 * @Description: Coding something
 */

import type { IAttributes, IElement } from './alins.d';

// tslint:disable-next-line:export-just-namespace

// declare const For = () => {};

declare const React: any;

declare global {
    interface Window {
        React: any;
    }
    namespace JSX {
        interface Element extends Promise<IElement>, IElement {
            (props: {a:number}): IElement;
        }
        // interface ElementClass {
        //     render():void;
        // }
        interface ElementAttributesProperty { props: {a:number}; }
        // interface ElementChildrenAttribute { children: {}; }

        // // We can't recurse forever because `type` can't be self-referential;
        // // let's assume it's reasonable to do a single React.lazy() around a single React.memo() / vice-versa
        // type LibraryManagedAttributes<C, P> = C extends React.MemoExoticComponent<infer T> | React.LazyExoticComponent<infer T>
        //     ? T extends React.MemoExoticComponent<infer U> | React.LazyExoticComponent<infer U>
        //         ? ReactManagedAttributes<U, P>
        //         : ReactManagedAttributes<T, P>
        //     : ReactManagedAttributes<C, P>;

        // // // tslint:disable-next-line:no-empty-interface
        // interface IntrinsicAttributes { href?: string }
        // // // tslint:disable-next-line:no-empty-interface
        interface IntrinsicClassAttributes { href?: string }

        interface IntrinsicElements {

            div: IAttributes,
            a: IAttributes;
            h1: IAttributes;
            h2: IAttributes;
            h3: IAttributes;
            h4: IAttributes;
            h5: IAttributes;
            h6: IAttributes;
            button: IAttributes;
            canvas: IAttributes;
            code: IAttributes;
            pre: IAttributes;
            table: IAttributes;
            th: IAttributes;
            td: IAttributes;
            tr: IAttributes;
            video: IAttributes;
            audio: IAttributes;
            ol: IAttributes;
            select: IAttributes;
            option: IAttributes;
            p: IAttributes;
            i: IAttributes;
            iframe: IAttributes;
            img: IAttributes;
            input: IAttributes;
            label: IAttributes;
            ul: IAttributes;
            li: IAttributes;
            span: IAttributes;
            textarea: IAttributes;
            form: IAttributes;
            br: IAttributes;
            tbody: IAttributes;
            abbr: IAttributes;
            article: IAttributes;
            aside: IAttributes;
            b: IAttributes;
            base: IAttributes;
            bdi: IAttributes;
            bdo: IAttributes;
            blockquote: IAttributes;
            caption: IAttributes;
            cite: IAttributes;
            del: IAttributes;
            details: IAttributes;
            dialog: IAttributes;
            em: IAttributes;
            embed: IAttributes;
            figure: IAttributes;
            footer: IAttributes;
            header: IAttributes;
            hr: IAttributes;
            menu: IAttributes;
            nav: IAttributes;
            noscript: IAttributes;
            object: IAttributes;
            progress: IAttributes;
            section: IAttributes;
            slot: IAttributes;
            small: IAttributes;
            strong: IAttributes;
            sub: IAttributes;
            summary: IAttributes;
            sup: IAttributes;
            template: IAttributes;
            title: IAttributes;
            var: IAttributes;
            [prop: string]: IAttributes;
        }
    }

    type JSXInnerComp<T> = (attrs: T & {[prop: string]:any}) => JSX.Element;

    const For: JSXInnerComp<{data?: any[], item?: string, index?: string}>;
    const If: JSXInnerComp<{data?: boolean}>;
    const ElseIf: JSXInnerComp<{data?: boolean}>;
    const Else: JSXInnerComp<{}>;
    const Switch: JSXInnerComp<{data?: any}>;
    const Case: JSXInnerComp<{data?: any, break?: boolean|null}>;
    const Default: JSXInnerComp<{break?: boolean|null}>;
    const Async: JSXInnerComp<{data?: Promise<any>, name?: string}>;
    const Show: JSXInnerComp<{data?: boolean}>;
    const Frag: (attrs: IAttributes) => JSX.Element;

    let $item: any;
    let $index: number;
    let $data: any;
    let $e: Event;
}
