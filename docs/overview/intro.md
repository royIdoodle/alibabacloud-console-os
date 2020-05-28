---
name: intro
zhName: 概览
sort: 0
---

# alibabacloud-console-os

## 介绍
```console-os``` 是在阿里云控制台体系中孵化🐣的微前端方案， 定位是面向企业级的微前端体系化解决方案。

## 特性

 * 📦 开箱即用，无代码侵入
 * 📎 完善的微前端体系支撑
 * 🕋 完整前端容器沙箱
 * ♋️  多实例兼容

## 使用文档

子应用

```javascript
import { mount }  from '@alicloud/console-os-react-portal';
import App from './app';

const appID = 'aliyun-console-slb'

export default mount(
  (props) => <App/>,
  document.getElementById('app'),
  appID
);
```

宿主应用

```javascript
import Application from '@alicloud/console-os-react-app'

const appConfigUrl = 'http://localhost:7100/aliyun-console-slb.manifest.json';

const Home =  () => (
  <Application
    manifest={appConfigUrl}
    id="aliyun-console-slb"
  />
);
export default Home;
```

## 其他框架使用

## React 

see [Console OS React Portal](https://github.com/aliyun/alibabacloud-console-os/tree/master/packages/react-portal)

## Vue 

see [Console OS Vue Portal](https://github.com/aliyun/alibabacloud-console-os/blob/master/packages/vue-portal/README.md)

## Try Example

克隆仓库到本地

```
git clone https://github.com/aliyun/alibabacloud-console-os.git
```

运行 React 子应用

```bash
$ cd example/SubApp/React
$ yarn install # or npm install
$ npm run start
# you will visit app on http://localhost:8080/
```

运行 Vue 子应用

```bash
$ cd example/SubApp/Vue
$ yarn install # or npm install
$ npm run serve
# you will visit app on http://localhost:8081/
```

运行 宿主 应用

```bash
$ cd example/HostApp/ReactHost
$ yarn install # or npm install
$ npm run start
# you will visit app on http://localhost:3000/
```

你可以在 http://localhost:3000/ 访问到当前加载的两个子应用。

## Try Live Demo

### React

* [基础用法](https://codesandbox.io/s/jolly-sun-pf75y)

* [React 加载 Angular 应用](https://codesandbox.io/s/busy-jepsen-xp8q9)

### Angular

* [Angular 加载 React 应用](https://codesandbox.io/s/nameless-rain-1yv57)

## 贡献指南

参见[贡献指南](https://github.com/aliyun/alibabacloud-console-toolkit/blob/master/CONTRIBUTING.md)
