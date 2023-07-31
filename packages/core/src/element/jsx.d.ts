/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-06 22:46:06
 * @Description: Coding something
 */

// tslint:disable-next-line:export-just-namespace
export = Alins;

declare namespace Alins {
    // prevent：阻止默认事件（常用）；
    // stop：阻止事件冒泡（常用）；
    // once：事件只触发一次（常用）；
    // capture：使用事件的捕获模式；
    // self：只有event.target是当前操作的元素时才触发事件；
    type TEventDecorator = 'prevent' | 'stop' | 'capture' | 'once' | 'self';
    type IEventObjectDeco = {
        listener: (e: Event)=>any;
    } & {
        [decorator in TEventDecorator]?: boolean;
    }
    type IEventObject = ((e: Event)=>any) | IEventObjectDeco;
    // | {
    //     v: (e: Event)=>any;
    //     __deco: TEventDecorator;
    // }
    interface IEventAttributes {
        onclick?: IEventObject;
        onmousedown?: IEventObject;
        onmouseenter?: IEventObject;
        onmouseleave?: IEventObject;
        onmousemove?: IEventObject;
        onmouseover?: IEventObject;
        onmouseup?: IEventObject;
        ontouchend?: IEventObject;
        ontouchmove?: IEventObject;
        ontouchstart?: IEventObject;
        onwheel?: IEventObject;
        oninput?: IEventObject;
        onchange?: IEventObject;
        onfullscreenchange?: IEventObject;
        onfullscreenerror?: IEventObject;
        oncopy?: IEventObject;
        oncut?: IEventObject;
        onpaste?: IEventObject;
        onabort?: IEventObject;
        onauxclick?: IEventObject;
        onbeforeinput?: IEventObject;
        onblur?: IEventObject;
        oncanplay?: IEventObject;
        oncanplaythrough?: IEventObject;
        onclose?: IEventObject;
        oncompositionend?: IEventObject;
        oncompositionstart?: IEventObject;
        oncompositionupdate?: IEventObject;
        oncontextmenu?: IEventObject;
        oncuechange?: IEventObject;
        ondblclick?: IEventObject;
        ondrag?: IEventObject;
        ondragend?: IEventObject;
        ondragenter?: IEventObject;
        ondragleave?: IEventObject;
        ondragover?: IEventObject;
        ondragstart?: IEventObject;
        ondrop?: IEventObject;
        ondurationchange?: IEventObject;
        onemptied?: IEventObject;
        onended?: IEventObject;
        onerror?: IEventObject;
        onfocus?: IEventObject;
        onfocusin?: IEventObject;
        onfocusout?: IEventObject;
        onformdata?: IEventObject;
        ongotpointercapture?: IEventObject;
        oninvalid?: IEventObject;
        onkeydown?: IEventObject;
        onkeypress?: IEventObject;
        onkeyup?: IEventObject;
        onload?: IEventObject;
        onloadeddata?: IEventObject;
        onloadedmetadata?: IEventObject;
        onloadstart?: IEventObject;
        onlostpointercapture?: IEventObject;
        onmouseout?: IEventObject;
        onpause?: IEventObject;
        onplay?: IEventObject;
        onplaying?: IEventObject;
        onpointercancel?: IEventObject;
        onpointerdown?: IEventObject;
        onpointerenter?: IEventObject;
        onpointerleave?: IEventObject;
        onpointermove?: IEventObject;
        onpointerout?: IEventObject;
        onpointerover?: IEventObject;
        onpointerup?: IEventObject;
        onprogress?: IEventObject;
        onratechange?: IEventObject;
        onreset?: IEventObject;
        onresize?: IEventObject;
        onscroll?: IEventObject;
        onselect?: IEventObject;
        onselectionchange?: IEventObject;
        onselectstart?: IEventObject;
        onsubmit?: IEventObject;
        onsuspend?: IEventObject;
        ontimeupdate?: IEventObject;
        ontoggle?: IEventObject;
        ontouchcancel?: IEventObject;
    }

    type IStyle = Partial<CSSStyleDeclaration>

    interface IAttributes extends IEventAttributes {
        accesskey?: any;
        alt?: any;
        async?: any;
        autoplay?: any;
        checked?: any;
        color?: any;
        cols?: any;
        dir?: any;
        disabled?: any;
        enctype?: any;
        formnovalidate?: any;
        height?: any;
        hidden?: any;
        id?: any;
        lang?: any;
        maxlength?: any;
        name?: any;
        nonce?: any;
        readonly?: any;
        required?: any;
        size?: any;
        src?: any;
        style?: IStyle | string | (()=>string);
        summary?: any;
        tabindex?: any;
        target?: any;
        title?: any;
        type?: any;
        value?: any;
        href?: any;
        selected?: any;
        poster?: any;
        muted?: any;
        controls?: any;
        loop?: any;
        border?: any;
        cellspacing?: any;
        cellpadding?: any;
        rowspan?: any;
        colspan?: any;
        [prop: string]: any;
    }
}

declare const For = () => {};

declare global {
    namespace JSX {
        interface PElement extends Promise<HTMLElement>, HTMLElement{}
        // tslint:disable-next-line:no-empty-interface
        interface Element extends PElement {
        }
        // interface ElementClass {
        //     render():void;
        // }
        // interface ElementAttributesProperty { props: {}; }
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
        // interface IntrinsicClassAttributes { href?: string }

        interface IntrinsicElements {
            // HTML
            for: {data: any, item: string; index: string},

            div: Alins.IAttributes,
            a: Alins.IAttributes;
            h1: Alins.IAttributes;
            h2: Alins.IAttributes;
            h3: Alins.IAttributes;
            h4: Alins.IAttributes;
            h5: Alins.IAttributes;
            h6: Alins.IAttributes;
            button: Alins.IAttributes;
            canvas: Alins.IAttributes;
            code: Alins.IAttributes;
            pre: Alins.IAttributes;
            table: Alins.IAttributes;
            th: Alins.IAttributes;
            td: Alins.IAttributes;
            tr: Alins.IAttributes;
            video: Alins.IAttributes;
            audio: Alins.IAttributes;
            ol: Alins.IAttributes;
            select: Alins.IAttributes;
            option: Alins.IAttributes;
            p: Alins.IAttributes;
            i: Alins.IAttributes;
            iframe: Alins.IAttributes;
            img: Alins.IAttributes;
            input: Alins.IAttributes;
            label: Alins.IAttributes;
            ul: Alins.IAttributes;
            li: Alins.IAttributes;
            span: Alins.IAttributes;
            textarea: Alins.IAttributes;
            form: Alins.IAttributes;
            br: Alins.IAttributes;
            tbody: Alins.IAttributes;
            abbr: Alins.IAttributes;
            article: Alins.IAttributes;
            aside: Alins.IAttributes;
            b: Alins.IAttributes;
            base: Alins.IAttributes;
            bdi: Alins.IAttributes;
            bdo: Alins.IAttributes;
            blockquote: Alins.IAttributes;
            caption: Alins.IAttributes;
            cite: Alins.IAttributes;
            del: Alins.IAttributes;
            details: Alins.IAttributes;
            dialog: Alins.IAttributes;
            em: Alins.IAttributes;
            embed: Alins.IAttributes;
            figure: Alins.IAttributes;
            footer: Alins.IAttributes;
            header: Alins.IAttributes;
            hr: Alins.IAttributes;
            menu: Alins.IAttributes;
            nav: Alins.IAttributes;
            noscript: Alins.IAttributes;
            object: Alins.IAttributes;
            progress: Alins.IAttributes;
            section: Alins.IAttributes;
            slot: Alins.IAttributes;
            small: Alins.IAttributes;
            strong: Alins.IAttributes;
            sub: Alins.IAttributes;
            summary: Alins.IAttributes;
            sup: Alins.IAttributes;
            template: Alins.IAttributes;
            title: Alins.IAttributes;
            var: Alins.IAttributes;
            [prop: string]: Alins.IAttributes;
        }
    }
}
