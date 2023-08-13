/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-25 20:13:00
 * @Description: Coding something
 */
const swc = require('@swc/core');

const fs = require('fs');
 
const code = `
function HelloWorld () {
  let msg = 'Hello World';
  const show = false;
  if (show) {
      return div({
          html: '',
          text: '',
          style: {},
          class: \`\${show ? 'aa' : msg}\`,
          attr: {aa: 11},
          click: () => {msg = 'xx';},
          children: [
              span({click: () => {msg = 'xx';}}, [
                  div({})
              ])
          ]
      });
  }
  return null;
}`;

swc
    .parse(code, {
        syntax: 'ecmascript', // "ecmascript" | "typescript"
        comments: false,
        script: true,
 
        // Defaults to es3
        target: 'es3',
 
        // Input source code are treated as module by default
        isModule: false,
    })
    .then((module) => {
        module.type; // file type
        module.body; // AST
        console.log(module.type, module.body);

        fs.writeFileSync('a.json', JSON.stringify(module), 'utf-8');
    });

swc.transform(code, {
  
  ''
})