/*
 * @Author: tackchen
 * @Date: 2022-10-10 17:41:14
 * @Description: Coding something
 */


interface IElement {
    type: 'css' | 'event' | 'props' |
        'text' | 'selector' | 'children' |
        'comp';
}

interface IEvent extends IElement {
    type: 'event';
}
type IEventBuilder = ()=> IEvent;

interface ICss extends IElement {
    type: 'css';
}
type ICssBuilder = ()=> ICss;


interface IController {
    type: 'for' | 'if' | 'bind';
}

interface IXDomConstructor {
    (data: string): IXDom;
    (template: TemplateStringsArray): IXDom;
}


interface IXDom extends IXDomConstructor {
    css: ICss;
    props(): IXDom;
}