import {createContext as _$$} from '../../../packages/client-core/dist/alins.esm.min';
(window as any)._$$ = _$$;
let count = 1;

<button
    $parent={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;