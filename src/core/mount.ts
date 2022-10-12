/*
 * @Author: tackchen
 * @Date: 2022-10-11 16:16:59
 * @Description: Coding something
 */
import {transformBuilderToDom, IElementBuilder} from './element/transform';

export function mount (container: string, builder: IElementBuilder) {
    document.querySelector(container)?.appendChild(
        transformBuilderToDom(builder),
    );
}

// export function mountXDom (container: IElement, el: IElement) {
    
// }