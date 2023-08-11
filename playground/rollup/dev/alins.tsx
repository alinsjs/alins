let count = 1;

<button
    $parent={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;