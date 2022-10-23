
## 1. [pnpm](https://zhuanlan.zhihu.com/p/373935751)

不使用 pnpm 的 workspace

<!-- 
pnpm i xxx -save-dev -w

pnpm i @test/utils -r --filter @test/ui

pnpm i xxx -r --filter @test/web

https://zhuanlan.zhihu.com/p/427588430

https://segmentfault.com/a/1190000040988970 -->

## 2. [lerna](https://www.lernajs.cn/)

```

lerna add @alins/utils --scope=@alins/main

lerna version 0.0.1 --yes
lerna publish from-git --yes

lerna version prepatch --preid alpha --no-push

lerna init

lerna bootstrap

lerna diff [package?]

lerna ls

lerna changed

lerna run [script]
```

http://www.febeacon.com/lerna-docs-zh-cn/routes/commands/version.html#preid

查看包之间的依赖关系

yarn workspaces info 
