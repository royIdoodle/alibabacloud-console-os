# @alicloud/console-os-browser-vm
=========

[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]

[travis-image]: https://img.shields.io/travis/royIdoodle/alibabacloud-console-os.svg?style=flat-square
[travis-url]: https://travis-ci.org/royIdoodle/alibabacloud-console-os
[codecov-image]: https://codecov.io/gh/royIdoodle/alibabacloud-console-os/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/royIdoodle/alibabacloud-console-os

## 安装

``` bash
> npm install @alicloud/console-os-browser-vm --save
```

## 说明

直接执行代码：

``` javascript
import { evalScripts } from '@alicloud/console-os-browser-vm';

const context = evalScripts('window.test = 1;')

console.log(window.test === undefined) // true
```

获取虚拟化部分浏览器内置对象。

```javascript
import { createContext, removeContext } from '@alicloud/console-os-browser-vm';

const context = await createContext();

const run = window.eval(`
  (() => function({window, history, locaiton, document}) {
    window.test = 1;
  })()
`)

console.log(context.window.test);
console.log(window.test);

// 操作虚拟化浏览器对象
context.history.pushState(null, null, '/test');
context.locaiton.hash = 'foo'

// 销毁一个 context
await removeContext( context );
```
