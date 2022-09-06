# mini single-spa
此项目用于学习single-spa，因为感觉看源码有点累，就想着写一个简版的。
此项目使用pnpm来做monorepo,在examples里有使用vue搭建的微前端应用。
启动项目
```
pnpm run start
```
打包工具使用的是[tsup](https://tsup.egoist.dev/)(因为快)
```
pnpm run build
```
如果想要调试singlespa的话也可以使用`pnpm run watch`