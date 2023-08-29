let count = 1;

<button
    $mount={document.body}
    onclick={() => {count++;}}
>click:{count}</button>;