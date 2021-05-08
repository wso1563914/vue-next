# lerna + yarn workspace使用简介

## Monorepo
    Monorepo 的全称是 monolithic repository，即单体式仓库，与之对应的是 Multirepo(multiple repository)，这里的“单”和“多”是指每个仓库中所管理的模块数量。Monorepo 是把所有相关的 package 都放在一个仓库里进行管理，每个 package 独立发布。

## Lerna 是什么
    Lerna 是一个管理多个 npm 模块的工具，是 Babel 自己用来维护自己的 Monorepo 并开源出的一个项目。优化维护多包的工作流，解决多个包互相依赖，且发布需要手动维护多个包的问题。

一个lerna基本的仓库结构如下
```
lerna-repo
    |
    |-packages
    |    |
    |    |--repo1
    |    |    |
    |    |    |--...
    |    |    |--package.json
    |    |
    |    |--repo2
    |    |    |
    |    |    |--...
    |    |    |--package.json
    |
    |--...
    |--lerna.json
    |--package.json
```
我们这里采用yarn官方推荐的做法,用yarn来处理依赖问题，用lerna来处理发布问题。

### 安装
`npm i -g yarn lerna`

### 初始化项目
`lerna init`

lerna初始化后会有一个package.json和lerna.json
```
// package.json
{
  "name": "root",
  "private": true, // 私有的，不会被发布，是管理整个项目，与要发布到npm的解耦
  "devDependencies": {
    "lerna": "^3.15.0"
  }
}

// lerna.json
{
  "packages": [
    "packages/*"
  ],
  // Lerna 在管理 package 的版本号上，提供了两种模式供选择 Fixed or Independent。默认是 Fixed，更多细节，以及 Lerna 的更多玩法，请参考官网文档: https://github.com/lerna/lerna/blob/master/README.md
  "version": "independent"
}

```

### yarn workspace
    我们使用yarn来管理各种包的依赖, yarn workspace
    在package.json和lerna.json里面配置
```
// package.json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}

// lerna.json
{
  "npmClient": "yarn",
  "useWorkspaces": true,
}
```

#### 搭建环境
+ 普通项目：clone下来后通过yarn install,即可搭建完项目，有时需要配合postinstall hooks,来进行自动编译，或者其他设置。

+ monorepo: 各个库之间存在依赖，如A依赖于B，因此我们通常需要将B link到A的node_module里，一旦仓库很多的话，手动的管理这些link操作负担很大，因此需要自动化的link操作，按照拓扑排序将各个依赖进行link

解决方式：通过使用workspace，yarn install会自动的帮忙解决安装和link问题

` yarn install # 等价于 lerna bootstrap --npm-client yarn --use-workspaces `

### 安装|删除依赖
+ 普通项目： 通过yarn add和yarn remove即可简单姐解决依赖库的安装和删除问题

+ monorepo: 一般分为三种场景
    + 给某个package安装依赖：yarn workspace packageB add packageA 将packageA作为packageB的依赖进行安装

    + 给所有的package安装依赖: 使用yarn workspaces add lodash 给所有的package安装依赖

    + 给root 安装依赖：一般的公用的开发工具都是安装在root里，如typescript,我们使用yarn add -W -D typescript来给root安装依赖


```
// 对应的三种场景删除依赖如下
yarn workspace packageB remove packageA
yarn workspaces remove lodash
yarn remove -W -D typescript
```

#### 清理环境
+ 普通项目： 直接删除node_modules以及编译后的产物。

+ monorepo： 不仅需要删除root的node_modules的编译产物还需要删除各个package里的node_modules以及编译产物

解决方式：使用lerna clean来删除所有的node_modules，使用yarn workspaces run clean来执行所有package的清理工作

`lerna clean # 清理所有的node_modules`

`yarn workspaces run clean # 执行所有package的clean操作`

### 包之间的依赖关系
`yarn workspace packageB remove packageA`

需要注意的是: 对于安装local dependency，yarn的实现暂时有bug，第一次安装需要指明版本号，否则会安装失败如下

如果pkg1没有发布到npm则yarn workspace ui-form add pkg1 会安装失败，但是yarn workspace ui-form add pkg1@1.0.0会成功

### lerna publish 和 lerna version
`lerna version`

找出从上一个版本发布以来有过变更的 package

提示开发者确定要发布的版本号

将所有更新过的的 package 中的package.json的version字段更新

将依赖更新过的 package 的 包中的依赖版本号更新

更新 lerna.json 中的 version 字段

提交上述修改，并打一个 tag

推送到 git 仓库

`lerna publish`

publish会走一遍version命令，然后推送到npm

***

### 参考文献

1、[基于lerna和yarn workspace的monorepo工作流](https://zhuanlan.zhihu.com/p/71385053)

2、[lerna+yarn workspace+monorepo项目的最佳实践](https://blog.csdn.net/i10630226/article/details/99702447)

3、[基于 Lerna 管理 packages 的 Monorepo 项目最佳实践](https://blog.csdn.net/vivo_tech/article/details/98770513)

4、[精读《Monorepo 的优势》](https://mp.weixin.qq.com/s/f2ehHTNK9rx8jNBUyhSwAA)




