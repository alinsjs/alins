/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-26 08:35:17
 * @Description: Coding something
 */

export interface IElement {
  _isBuilder?: false;
  appendChild(child: IElement): void;
  // target stopPropagation preventDefault
  addEventListener(eventName: string, listener: (e: Event)=>void, useCapture?: boolean): void;
  removeEventListener(eventName: string, listener: (e: Event)=>void, useCapture?: boolean): void;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string;
  get innerHTML(): string;
  set innerHTML(value: string);
  get innerText(): string;
  set innerText(value: string);
}

export const Renderer = {
    createElement (tag: string): IElement {
        return document.createElement(tag) as IElement;
    }
};