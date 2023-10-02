const a = false; // @reactive
const b = false; // @reactive

// const c = `${(a && !b) ? '1' : '2'}`;

watch(() => `${(a && !b) ? '1' : '2'}`, (v) => {
    console.log('watch c', v);
});

{/* <div $$App
    style:color={`${(a && !b) ? '#f44': '#4f4'}`}
>
    Hello!
</div> */}

/**
 * todo 有bug
a.v = true;
b.v = true;
b.v = false
 */