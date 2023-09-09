let a = 1;
const $a = { a: 1 };
// a++;
const b = a + 1;

const c = {
    a: a + 2
};

watch: $a, (newValue, oldValue) => {
    console.log('a changed:', newValue, oldValue);
};
watch: $a.a, (newValue, oldValue) => {
    console.log('a changed:', newValue, oldValue);
};
watch: a + 1, (newValue, oldValue) => {
    console.log('a + 1 changed:', newValue, oldValue);
};
watch: () => a * 2, (newValue, oldValue) => {
    console.log('a * 2 changed:', newValue, oldValue);
};
watch: b, (newValue, oldValue) => {
    console.log('b changed:', newValue, oldValue);
};
watch: c, (newValue, oldValue, prop) => {
    console.log('c changed:', newValue, oldValue, prop);
};

<button $$App onclick={a++}>Modify A</button>;