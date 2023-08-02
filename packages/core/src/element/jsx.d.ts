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
    // interface IEventAttributes {
    //     onclick?: IEventObject;
    //     'onclick:prevent'?: IEventObject;
    //     'onclick:stop'?: IEventObject;
    //     'onclick:capture'?: IEventObject;
    //     'onclick:once'?: IEventObject;
    //     'onclick:self'?: IEventObject;
    //     onmousedown?: IEventObject;
    //     'onmousedown:prevent'?: IEventObject;
    //     'onmousedown:stop'?: IEventObject;
    //     'onmousedown:capture'?: IEventObject;
    //     'onmousedown:once'?: IEventObject;
    //     'onmousedown:self'?: IEventObject;
    //     onmouseenter?: IEventObject;
    //     'onmouseenter:prevent'?: IEventObject;
    //     'onmouseenter:stop'?: IEventObject;
    //     'onmouseenter:capture'?: IEventObject;
    //     'onmouseenter:once'?: IEventObject;
    //     'onmouseenter:self'?: IEventObject;
    //     onmouseleave?: IEventObject;
    //     'onmouseleave:prevent'?: IEventObject;
    //     'onmouseleave:stop'?: IEventObject;
    //     'onmouseleave:capture'?: IEventObject;
    //     'onmouseleave:once'?: IEventObject;
    //     'onmouseleave:self'?: IEventObject;
    //     onmousemove?: IEventObject;
    //     'onmousemove:prevent'?: IEventObject;
    //     'onmousemove:stop'?: IEventObject;
    //     'onmousemove:capture'?: IEventObject;
    //     'onmousemove:once'?: IEventObject;
    //     'onmousemove:self'?: IEventObject;
    //     onmouseover?: IEventObject;
    //     'onmouseover:prevent'?: IEventObject;
    //     'onmouseover:stop'?: IEventObject;
    //     'onmouseover:capture'?: IEventObject;
    //     'onmouseover:once'?: IEventObject;
    //     'onmouseover:self'?: IEventObject;
    //     onmouseup?: IEventObject;
    //     'onmouseup:prevent'?: IEventObject;
    //     'onmouseup:stop'?: IEventObject;
    //     'onmouseup:capture'?: IEventObject;
    //     'onmouseup:once'?: IEventObject;
    //     'onmouseup:self'?: IEventObject;
    //     ontouchend?: IEventObject;
    //     'ontouchend:prevent'?: IEventObject;
    //     'ontouchend:stop'?: IEventObject;
    //     'ontouchend:capture'?: IEventObject;
    //     'ontouchend:once'?: IEventObject;
    //     'ontouchend:self'?: IEventObject;
    //     ontouchmove?: IEventObject;
    //     'ontouchmove:prevent'?: IEventObject;
    //     'ontouchmove:stop'?: IEventObject;
    //     'ontouchmove:capture'?: IEventObject;
    //     'ontouchmove:once'?: IEventObject;
    //     'ontouchmove:self'?: IEventObject;
    //     ontouchstart?: IEventObject;
    //     'ontouchstart:prevent'?: IEventObject;
    //     'ontouchstart:stop'?: IEventObject;
    //     'ontouchstart:capture'?: IEventObject;
    //     'ontouchstart:once'?: IEventObject;
    //     'ontouchstart:self'?: IEventObject;
    //     onwheel?: IEventObject;
    //     'onwheel:prevent'?: IEventObject;
    //     'onwheel:stop'?: IEventObject;
    //     'onwheel:capture'?: IEventObject;
    //     'onwheel:once'?: IEventObject;
    //     'onwheel:self'?: IEventObject;
    //     oninput?: IEventObject;
    //     'oninput:prevent'?: IEventObject;
    //     'oninput:stop'?: IEventObject;
    //     'oninput:capture'?: IEventObject;
    //     'oninput:once'?: IEventObject;
    //     'oninput:self'?: IEventObject;
    //     onchange?: IEventObject;
    //     'onchange:prevent'?: IEventObject;
    //     'onchange:stop'?: IEventObject;
    //     'onchange:capture'?: IEventObject;
    //     'onchange:once'?: IEventObject;
    //     'onchange:self'?: IEventObject;
    //     onfullscreenchange?: IEventObject;
    //     'onfullscreenchange:prevent'?: IEventObject;
    //     'onfullscreenchange:stop'?: IEventObject;
    //     'onfullscreenchange:capture'?: IEventObject;
    //     'onfullscreenchange:once'?: IEventObject;
    //     'onfullscreenchange:self'?: IEventObject;
    //     onfullscreenerror?: IEventObject;
    //     'onfullscreenerror:prevent'?: IEventObject;
    //     'onfullscreenerror:stop'?: IEventObject;
    //     'onfullscreenerror:capture'?: IEventObject;
    //     'onfullscreenerror:once'?: IEventObject;
    //     'onfullscreenerror:self'?: IEventObject;
    //     oncopy?: IEventObject;
    //     'oncopy:prevent'?: IEventObject;
    //     'oncopy:stop'?: IEventObject;
    //     'oncopy:capture'?: IEventObject;
    //     'oncopy:once'?: IEventObject;
    //     'oncopy:self'?: IEventObject;
    //     oncut?: IEventObject;
    //     'oncut:prevent'?: IEventObject;
    //     'oncut:stop'?: IEventObject;
    //     'oncut:capture'?: IEventObject;
    //     'oncut:once'?: IEventObject;
    //     'oncut:self'?: IEventObject;
    //     onpaste?: IEventObject;
    //     'onpaste:prevent'?: IEventObject;
    //     'onpaste:stop'?: IEventObject;
    //     'onpaste:capture'?: IEventObject;
    //     'onpaste:once'?: IEventObject;
    //     'onpaste:self'?: IEventObject;
    //     onabort?: IEventObject;
    //     'onabort:prevent'?: IEventObject;
    //     'onabort:stop'?: IEventObject;
    //     'onabort:capture'?: IEventObject;
    //     'onabort:once'?: IEventObject;
    //     'onabort:self'?: IEventObject;
    //     onauxclick?: IEventObject;
    //     'onauxclick:prevent'?: IEventObject;
    //     'onauxclick:stop'?: IEventObject;
    //     'onauxclick:capture'?: IEventObject;
    //     'onauxclick:once'?: IEventObject;
    //     'onauxclick:self'?: IEventObject;
    //     onbeforeinput?: IEventObject;
    //     'onbeforeinput:prevent'?: IEventObject;
    //     'onbeforeinput:stop'?: IEventObject;
    //     'onbeforeinput:capture'?: IEventObject;
    //     'onbeforeinput:once'?: IEventObject;
    //     'onbeforeinput:self'?: IEventObject;
    //     onblur?: IEventObject;
    //     'onblur:prevent'?: IEventObject;
    //     'onblur:stop'?: IEventObject;
    //     'onblur:capture'?: IEventObject;
    //     'onblur:once'?: IEventObject;
    //     'onblur:self'?: IEventObject;
    //     oncanplay?: IEventObject;
    //     'oncanplay:prevent'?: IEventObject;
    //     'oncanplay:stop'?: IEventObject;
    //     'oncanplay:capture'?: IEventObject;
    //     'oncanplay:once'?: IEventObject;
    //     'oncanplay:self'?: IEventObject;
    //     oncanplaythrough?: IEventObject;
    //     'oncanplaythrough:prevent'?: IEventObject;
    //     'oncanplaythrough:stop'?: IEventObject;
    //     'oncanplaythrough:capture'?: IEventObject;
    //     'oncanplaythrough:once'?: IEventObject;
    //     'oncanplaythrough:self'?: IEventObject;
    //     onclose?: IEventObject;
    //     'onclose:prevent'?: IEventObject;
    //     'onclose:stop'?: IEventObject;
    //     'onclose:capture'?: IEventObject;
    //     'onclose:once'?: IEventObject;
    //     'onclose:self'?: IEventObject;
    //     oncompositionend?: IEventObject;
    //     'oncompositionend:prevent'?: IEventObject;
    //     'oncompositionend:stop'?: IEventObject;
    //     'oncompositionend:capture'?: IEventObject;
    //     'oncompositionend:once'?: IEventObject;
    //     'oncompositionend:self'?: IEventObject;
    //     oncompositionstart?: IEventObject;
    //     'oncompositionstart:prevent'?: IEventObject;
    //     'oncompositionstart:stop'?: IEventObject;
    //     'oncompositionstart:capture'?: IEventObject;
    //     'oncompositionstart:once'?: IEventObject;
    //     'oncompositionstart:self'?: IEventObject;
    //     oncompositionupdate?: IEventObject;
    //     'oncompositionupdate:prevent'?: IEventObject;
    //     'oncompositionupdate:stop'?: IEventObject;
    //     'oncompositionupdate:capture'?: IEventObject;
    //     'oncompositionupdate:once'?: IEventObject;
    //     'oncompositionupdate:self'?: IEventObject;
    //     oncontextmenu?: IEventObject;
    //     'oncontextmenu:prevent'?: IEventObject;
    //     'oncontextmenu:stop'?: IEventObject;
    //     'oncontextmenu:capture'?: IEventObject;
    //     'oncontextmenu:once'?: IEventObject;
    //     'oncontextmenu:self'?: IEventObject;
    //     oncuechange?: IEventObject;
    //     'oncuechange:prevent'?: IEventObject;
    //     'oncuechange:stop'?: IEventObject;
    //     'oncuechange:capture'?: IEventObject;
    //     'oncuechange:once'?: IEventObject;
    //     'oncuechange:self'?: IEventObject;
    //     ondblclick?: IEventObject;
    //     'ondblclick:prevent'?: IEventObject;
    //     'ondblclick:stop'?: IEventObject;
    //     'ondblclick:capture'?: IEventObject;
    //     'ondblclick:once'?: IEventObject;
    //     'ondblclick:self'?: IEventObject;
    //     ondrag?: IEventObject;
    //     'ondrag:prevent'?: IEventObject;
    //     'ondrag:stop'?: IEventObject;
    //     'ondrag:capture'?: IEventObject;
    //     'ondrag:once'?: IEventObject;
    //     'ondrag:self'?: IEventObject;
    //     ondragend?: IEventObject;
    //     'ondragend:prevent'?: IEventObject;
    //     'ondragend:stop'?: IEventObject;
    //     'ondragend:capture'?: IEventObject;
    //     'ondragend:once'?: IEventObject;
    //     'ondragend:self'?: IEventObject;
    //     ondragenter?: IEventObject;
    //     'ondragenter:prevent'?: IEventObject;
    //     'ondragenter:stop'?: IEventObject;
    //     'ondragenter:capture'?: IEventObject;
    //     'ondragenter:once'?: IEventObject;
    //     'ondragenter:self'?: IEventObject;
    //     ondragleave?: IEventObject;
    //     'ondragleave:prevent'?: IEventObject;
    //     'ondragleave:stop'?: IEventObject;
    //     'ondragleave:capture'?: IEventObject;
    //     'ondragleave:once'?: IEventObject;
    //     'ondragleave:self'?: IEventObject;
    //     ondragover?: IEventObject;
    //     'ondragover:prevent'?: IEventObject;
    //     'ondragover:stop'?: IEventObject;
    //     'ondragover:capture'?: IEventObject;
    //     'ondragover:once'?: IEventObject;
    //     'ondragover:self'?: IEventObject;
    //     ondragstart?: IEventObject;
    //     'ondragstart:prevent'?: IEventObject;
    //     'ondragstart:stop'?: IEventObject;
    //     'ondragstart:capture'?: IEventObject;
    //     'ondragstart:once'?: IEventObject;
    //     'ondragstart:self'?: IEventObject;
    //     ondrop?: IEventObject;
    //     'ondrop:prevent'?: IEventObject;
    //     'ondrop:stop'?: IEventObject;
    //     'ondrop:capture'?: IEventObject;
    //     'ondrop:once'?: IEventObject;
    //     'ondrop:self'?: IEventObject;
    //     ondurationchange?: IEventObject;
    //     'ondurationchange:prevent'?: IEventObject;
    //     'ondurationchange:stop'?: IEventObject;
    //     'ondurationchange:capture'?: IEventObject;
    //     'ondurationchange:once'?: IEventObject;
    //     'ondurationchange:self'?: IEventObject;
    //     onemptied?: IEventObject;
    //     'onemptied:prevent'?: IEventObject;
    //     'onemptied:stop'?: IEventObject;
    //     'onemptied:capture'?: IEventObject;
    //     'onemptied:once'?: IEventObject;
    //     'onemptied:self'?: IEventObject;
    //     onended?: IEventObject;
    //     'onended:prevent'?: IEventObject;
    //     'onended:stop'?: IEventObject;
    //     'onended:capture'?: IEventObject;
    //     'onended:once'?: IEventObject;
    //     'onended:self'?: IEventObject;
    //     onerror?: IEventObject;
    //     'onerror:prevent'?: IEventObject;
    //     'onerror:stop'?: IEventObject;
    //     'onerror:capture'?: IEventObject;
    //     'onerror:once'?: IEventObject;
    //     'onerror:self'?: IEventObject;
    //     onfocus?: IEventObject;
    //     'onfocus:prevent'?: IEventObject;
    //     'onfocus:stop'?: IEventObject;
    //     'onfocus:capture'?: IEventObject;
    //     'onfocus:once'?: IEventObject;
    //     'onfocus:self'?: IEventObject;
    //     onfocusin?: IEventObject;
    //     'onfocusin:prevent'?: IEventObject;
    //     'onfocusin:stop'?: IEventObject;
    //     'onfocusin:capture'?: IEventObject;
    //     'onfocusin:once'?: IEventObject;
    //     'onfocusin:self'?: IEventObject;
    //     onfocusout?: IEventObject;
    //     'onfocusout:prevent'?: IEventObject;
    //     'onfocusout:stop'?: IEventObject;
    //     'onfocusout:capture'?: IEventObject;
    //     'onfocusout:once'?: IEventObject;
    //     'onfocusout:self'?: IEventObject;
    //     onformdata?: IEventObject;
    //     'onformdata:prevent'?: IEventObject;
    //     'onformdata:stop'?: IEventObject;
    //     'onformdata:capture'?: IEventObject;
    //     'onformdata:once'?: IEventObject;
    //     'onformdata:self'?: IEventObject;
    //     ongotpointercapture?: IEventObject;
    //     'ongotpointercapture:prevent'?: IEventObject;
    //     'ongotpointercapture:stop'?: IEventObject;
    //     'ongotpointercapture:capture'?: IEventObject;
    //     'ongotpointercapture:once'?: IEventObject;
    //     'ongotpointercapture:self'?: IEventObject;
    //     oninvalid?: IEventObject;
    //     'oninvalid:prevent'?: IEventObject;
    //     'oninvalid:stop'?: IEventObject;
    //     'oninvalid:capture'?: IEventObject;
    //     'oninvalid:once'?: IEventObject;
    //     'oninvalid:self'?: IEventObject;
    //     onkeydown?: IEventObject;
    //     'onkeydown:prevent'?: IEventObject;
    //     'onkeydown:stop'?: IEventObject;
    //     'onkeydown:capture'?: IEventObject;
    //     'onkeydown:once'?: IEventObject;
    //     'onkeydown:self'?: IEventObject;
    //     onkeypress?: IEventObject;
    //     'onkeypress:prevent'?: IEventObject;
    //     'onkeypress:stop'?: IEventObject;
    //     'onkeypress:capture'?: IEventObject;
    //     'onkeypress:once'?: IEventObject;
    //     'onkeypress:self'?: IEventObject;
    //     onkeyup?: IEventObject;
    //     'onkeyup:prevent'?: IEventObject;
    //     'onkeyup:stop'?: IEventObject;
    //     'onkeyup:capture'?: IEventObject;
    //     'onkeyup:once'?: IEventObject;
    //     'onkeyup:self'?: IEventObject;
    //     onload?: IEventObject;
    //     'onload:prevent'?: IEventObject;
    //     'onload:stop'?: IEventObject;
    //     'onload:capture'?: IEventObject;
    //     'onload:once'?: IEventObject;
    //     'onload:self'?: IEventObject;
    //     onloadeddata?: IEventObject;
    //     'onloadeddata:prevent'?: IEventObject;
    //     'onloadeddata:stop'?: IEventObject;
    //     'onloadeddata:capture'?: IEventObject;
    //     'onloadeddata:once'?: IEventObject;
    //     'onloadeddata:self'?: IEventObject;
    //     onloadedmetadata?: IEventObject;
    //     'onloadedmetadata:prevent'?: IEventObject;
    //     'onloadedmetadata:stop'?: IEventObject;
    //     'onloadedmetadata:capture'?: IEventObject;
    //     'onloadedmetadata:once'?: IEventObject;
    //     'onloadedmetadata:self'?: IEventObject;
    //     onloadstart?: IEventObject;
    //     'onloadstart:prevent'?: IEventObject;
    //     'onloadstart:stop'?: IEventObject;
    //     'onloadstart:capture'?: IEventObject;
    //     'onloadstart:once'?: IEventObject;
    //     'onloadstart:self'?: IEventObject;
    //     onlostpointercapture?: IEventObject;
    //     'onlostpointercapture:prevent'?: IEventObject;
    //     'onlostpointercapture:stop'?: IEventObject;
    //     'onlostpointercapture:capture'?: IEventObject;
    //     'onlostpointercapture:once'?: IEventObject;
    //     'onlostpointercapture:self'?: IEventObject;
    //     onmouseout?: IEventObject;
    //     'onmouseout:prevent'?: IEventObject;
    //     'onmouseout:stop'?: IEventObject;
    //     'onmouseout:capture'?: IEventObject;
    //     'onmouseout:once'?: IEventObject;
    //     'onmouseout:self'?: IEventObject;
    //     onpause?: IEventObject;
    //     'onpause:prevent'?: IEventObject;
    //     'onpause:stop'?: IEventObject;
    //     'onpause:capture'?: IEventObject;
    //     'onpause:once'?: IEventObject;
    //     'onpause:self'?: IEventObject;
    //     onplay?: IEventObject;
    //     'onplay:prevent'?: IEventObject;
    //     'onplay:stop'?: IEventObject;
    //     'onplay:capture'?: IEventObject;
    //     'onplay:once'?: IEventObject;
    //     'onplay:self'?: IEventObject;
    //     onplaying?: IEventObject;
    //     'onplaying:prevent'?: IEventObject;
    //     'onplaying:stop'?: IEventObject;
    //     'onplaying:capture'?: IEventObject;
    //     'onplaying:once'?: IEventObject;
    //     'onplaying:self'?: IEventObject;
    //     onpointercancel?: IEventObject;
    //     'onpointercancel:prevent'?: IEventObject;
    //     'onpointercancel:stop'?: IEventObject;
    //     'onpointercancel:capture'?: IEventObject;
    //     'onpointercancel:once'?: IEventObject;
    //     'onpointercancel:self'?: IEventObject;
    //     onpointerdown?: IEventObject;
    //     'onpointerdown:prevent'?: IEventObject;
    //     'onpointerdown:stop'?: IEventObject;
    //     'onpointerdown:capture'?: IEventObject;
    //     'onpointerdown:once'?: IEventObject;
    //     'onpointerdown:self'?: IEventObject;
    //     onpointerenter?: IEventObject;
    //     'onpointerenter:prevent'?: IEventObject;
    //     'onpointerenter:stop'?: IEventObject;
    //     'onpointerenter:capture'?: IEventObject;
    //     'onpointerenter:once'?: IEventObject;
    //     'onpointerenter:self'?: IEventObject;
    //     onpointerleave?: IEventObject;
    //     'onpointerleave:prevent'?: IEventObject;
    //     'onpointerleave:stop'?: IEventObject;
    //     'onpointerleave:capture'?: IEventObject;
    //     'onpointerleave:once'?: IEventObject;
    //     'onpointerleave:self'?: IEventObject;
    //     onpointermove?: IEventObject;
    //     'onpointermove:prevent'?: IEventObject;
    //     'onpointermove:stop'?: IEventObject;
    //     'onpointermove:capture'?: IEventObject;
    //     'onpointermove:once'?: IEventObject;
    //     'onpointermove:self'?: IEventObject;
    //     onpointerout?: IEventObject;
    //     'onpointerout:prevent'?: IEventObject;
    //     'onpointerout:stop'?: IEventObject;
    //     'onpointerout:capture'?: IEventObject;
    //     'onpointerout:once'?: IEventObject;
    //     'onpointerout:self'?: IEventObject;
    //     onpointerover?: IEventObject;
    //     'onpointerover:prevent'?: IEventObject;
    //     'onpointerover:stop'?: IEventObject;
    //     'onpointerover:capture'?: IEventObject;
    //     'onpointerover:once'?: IEventObject;
    //     'onpointerover:self'?: IEventObject;
    //     onpointerup?: IEventObject;
    //     'onpointerup:prevent'?: IEventObject;
    //     'onpointerup:stop'?: IEventObject;
    //     'onpointerup:capture'?: IEventObject;
    //     'onpointerup:once'?: IEventObject;
    //     'onpointerup:self'?: IEventObject;
    //     onprogress?: IEventObject;
    //     'onprogress:prevent'?: IEventObject;
    //     'onprogress:stop'?: IEventObject;
    //     'onprogress:capture'?: IEventObject;
    //     'onprogress:once'?: IEventObject;
    //     'onprogress:self'?: IEventObject;
    //     onratechange?: IEventObject;
    //     'onratechange:prevent'?: IEventObject;
    //     'onratechange:stop'?: IEventObject;
    //     'onratechange:capture'?: IEventObject;
    //     'onratechange:once'?: IEventObject;
    //     'onratechange:self'?: IEventObject;
    //     onreset?: IEventObject;
    //     'onreset:prevent'?: IEventObject;
    //     'onreset:stop'?: IEventObject;
    //     'onreset:capture'?: IEventObject;
    //     'onreset:once'?: IEventObject;
    //     'onreset:self'?: IEventObject;
    //     onresize?: IEventObject;
    //     'onresize:prevent'?: IEventObject;
    //     'onresize:stop'?: IEventObject;
    //     'onresize:capture'?: IEventObject;
    //     'onresize:once'?: IEventObject;
    //     'onresize:self'?: IEventObject;
    //     onscroll?: IEventObject;
    //     'onscroll:prevent'?: IEventObject;
    //     'onscroll:stop'?: IEventObject;
    //     'onscroll:capture'?: IEventObject;
    //     'onscroll:once'?: IEventObject;
    //     'onscroll:self'?: IEventObject;
    //     onselect?: IEventObject;
    //     'onselect:prevent'?: IEventObject;
    //     'onselect:stop'?: IEventObject;
    //     'onselect:capture'?: IEventObject;
    //     'onselect:once'?: IEventObject;
    //     'onselect:self'?: IEventObject;
    //     onselectionchange?: IEventObject;
    //     'onselectionchange:prevent'?: IEventObject;
    //     'onselectionchange:stop'?: IEventObject;
    //     'onselectionchange:capture'?: IEventObject;
    //     'onselectionchange:once'?: IEventObject;
    //     'onselectionchange:self'?: IEventObject;
    //     onselectstart?: IEventObject;
    //     'onselectstart:prevent'?: IEventObject;
    //     'onselectstart:stop'?: IEventObject;
    //     'onselectstart:capture'?: IEventObject;
    //     'onselectstart:once'?: IEventObject;
    //     'onselectstart:self'?: IEventObject;
    //     onsubmit?: IEventObject;
    //     'onsubmit:prevent'?: IEventObject;
    //     'onsubmit:stop'?: IEventObject;
    //     'onsubmit:capture'?: IEventObject;
    //     'onsubmit:once'?: IEventObject;
    //     'onsubmit:self'?: IEventObject;
    //     onsuspend?: IEventObject;
    //     'onsuspend:prevent'?: IEventObject;
    //     'onsuspend:stop'?: IEventObject;
    //     'onsuspend:capture'?: IEventObject;
    //     'onsuspend:once'?: IEventObject;
    //     'onsuspend:self'?: IEventObject;
    //     ontimeupdate?: IEventObject;
    //     'ontimeupdate:prevent'?: IEventObject;
    //     'ontimeupdate:stop'?: IEventObject;
    //     'ontimeupdate:capture'?: IEventObject;
    //     'ontimeupdate:once'?: IEventObject;
    //     'ontimeupdate:self'?: IEventObject;
    //     ontoggle?: IEventObject;
    //     'ontoggle:prevent'?: IEventObject;
    //     'ontoggle:stop'?: IEventObject;
    //     'ontoggle:capture'?: IEventObject;
    //     'ontoggle:once'?: IEventObject;
    //     'ontoggle:self'?: IEventObject;
    //     ontouchcancel?: IEventObject;
    //     'ontouchcancel:prevent'?: IEventObject;
    //     'ontouchcancel:stop'?: IEventObject;
    //     'ontouchcancel:capture'?: IEventObject;
    //     'ontouchcancel:once'?: IEventObject;
    //     'ontouchcancel:self'?: IEventObject;
    // }

    type IStyle = Partial<CSSStyleDeclaration>

    interface IBaseAttributes extends IEventAttributes {
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
    }

    interface IAttributes extends IBaseAttributes {
        $parent?: HTMLElement|Node|DocumentFragment;
        $show?: boolean|(()=>boolean);
        $attributes?: {
            [prop in keyof IBaseAttributes]?: IAttributes[prop];
        } & {
            [prop: string]: any;
        }
        'value:string'?: any;
        'value:number'?: any;
        'value:boolean'?: any;
        [prop: string]: any;
    }
}

// declare const For = () => {};


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
            // // HTML
            // for: {data: any[], item?: string; index?: string},
            // if: {data: boolean},
            // elseif: {data: boolean},
            // else: {},
            // switch: {data: any},
            // case: {data: any, break?: boolean|null},
            // default: {break?: boolean|null},
            // async: {data: Promise<any>, name?: string},
            // show: {data: boolean},

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

    type JSXInnerComp<T> = (attrs: T) => JSX.Element;

    const For: JSXInnerComp<{data: any[], item?: string, index?: string}>;
    const If: JSXInnerComp<{data: boolean}>;
    const ElseIf: JSXInnerComp<{data: boolean}>;
    const Else: JSXInnerComp<{}>;
    const Switch: JSXInnerComp<{data: any}>;
    const Case: JSXInnerComp<{data: any, break?: boolean|null}>;
    const Default: JSXInnerComp<{break?: boolean|null}>;
    const Async: JSXInnerComp<{data: Promise<any>, name?: string}>;
    const Show: JSXInnerComp<{data: boolean}>;

    var $item: any;
    var $index: number;
    var $data: any;
}
