## vue3+vite 通用模板

```
使用yarn进行安装最好
```

### 生成脚手架

```yaml
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue
```

### 环境变量

需要配置哦,待开始

```
.env         # 存放不同环境共用的环境变量，定义的变量将被各环境共享
.env.dev     # 开发环境
.env.stage   # 测试环境
.env.prod    # 正式环境
```

.env

```
VITE_TOKEN_NAME = 'token'
```

.env.dev

```js
# 标志
ENV = 'development'

# base api
VITE_APP_BASE_API = '/'

//需要更改一下package.json文件dev: vite
{
    dev: "vite --mode dev"
}
//通过import.meta.env调用对应的变量
```

.env.stage

```
NODE_ENV = production

VITE_BASE_URL = http://wwww.stage.com/api

VITE_BASE_PATH = /stage
```

.env.prod

```
NODE_ENV = production

VITE_BASE_URL = http://wwww.prod.com/api

VITE_BASE_PATH = /prod
```

vite 的--mode 选项，会读取指定的值匹配的环境变量，如运行 vite --mode dev 时，.env 和.env.dev 两个环境变量文件将被加载

```yaml
//package.json
"scripts": {
  "dev": "vite --mode dev",
  "stage": "vue-tsc --noEmit && vite build --mode stage",
  "prod": "vue-tsc --noEmit && vite build --mode prod",
},
```

### 配置`vite.config.js/ts`

以下配置都是在`vite.config.js/ts`文件的对象内进行的

#### 定义全局常量

```js
//vite.config.ts/vite.config.js
define: {
    INITIAL_COUNT: 10,
}
//代码中使用
const count = ref(INITIAL_COUNT);
```

#### 配置别名 alias

```js
import path from 'path';

const nodeResolve = (dir) => path.resolve(__dirname, '.', dir);

//vite.config.ts/vite.config.js
resolve: {
    alias: {
      '@': nodeResolve('src'),
      '~': nodeResolve('public'),
    },
 }
    
//vscode设置搜索files.eol,如果是auto改成\n
//项目根目录下新建jsconfig.json,内容如下
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "baseUrl": "./",
    "paths": { "@/*": ["src/*"], "_c/*": ["src/components/*"] }
  },
  "exclude": ["node_modules", "dist"]
}
```

#### 配置代理 Proxy

```js
 //配置代理
 server: {
    host: '0.0.0.0',
    // port: 3000, //可写可不写,写了就是固定端口3000
    proxy: {
      '/api': {
        target: 'http://test.epean.cn', //实际的后端 api 地址。如请求/api/abc 会转发到http://test.epean.cn/api/abc
        // target: 'https://lms.epean.com.cn',
        changeOrigin: true, //是否改写origin.设为true,则请求header中origin将会与target配置项的域名一致
        secure: true, //如果是https请设置为true
        rewrite: (url) => url.replace(/^\/api/, ''), //重写转发的请求链接
        cookieDomainRewrite: {
          // 'lms.epean.com.cn': 'localhost'
          'test.epean.cn': 'localhost',
        },
      },
    },
  },
```

#### 提供全局 less、scss 变量

```js
  //提供全局scss/less变量,二选一即可
  css: {
    preprocessorOptions: {
      less: {
        // additionalData: `@injectedColor: red;`, //直接提供变量@injectedColor
        additionalData: '@import "@/assets/less/variables.less";', //导入less文件提供变量
        javascriptEnabled: true,
      },
      scss: {
        // additionalData: `$injectedColor: orange;`,//直接提供变量$injectedColor
        additionalData: `@import "@/assets/scss/variables.scss";`,//导入scss文件提供变量
        javascriptEnabled: true,
      },
    },
  },
```

最终文件内容

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';

const nodeResolve = (dir) => path.resolve(__dirname, '.', dir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
      cache: false
    })
  ],
  //定义全局常量
  define: {
    INITIAL_COUNT: 10
  },
  //配置别名
  resolve: {
    alias: {
      '@': nodeResolve('src'),
      '~': nodeResolve('public')
    }
  },
  //配置代理
  server: {
    host: '0.0.0.0',
    port: 3000, //可写可不写,写了就是固定端口3000
    proxy: {
      '/api': {
        target: 'http://test.epean.cn', //实际的后端 api 地址。如请求/api/abc 会转发到http://test.epean.cn/api/abc
        // target: 'https://lms.epean.com.cn',
        changeOrigin: true, //是否改写origin.设为true,则请求header中origin将会与target配置项的域名一致
        secure: true, //如果是https请设置为true
        rewrite: (url) => url.replace(/^\/api/, ''), //重写转发的请求链接
        cookieDomainRewrite: {
          // 'lms.epean.com.cn': 'localhost'
          'test.epean.cn': 'localhost'
        }
      }
    }
  },
  //提供全局scss变量
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `$injectedColor: orange;`,//直接提供变量$injectedColor
        additionalData: `@import "@/assets/scss/variables.scss";`, //导入scss文件提供变量,这个最好
        javascriptEnabled: true
      }
    }
  }
});
```

### 配置 eslint/prettier

#### 配置 eslint

```js
//安装eslint
npm install -D @babel/core @babel/eslint-parser eslint
//创建文件
npx eslint --init
//.eslintrc.cjs,只改rules部分内容
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended', // 使用推荐的eslint
    'plugin:vue/vue3-recommended', // 使用插件支持vue3
    'plugin:prettier/recommended',
    'eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true
    },
    requireConfigFile: false, //不能少
    parser: '@babel/eslint-parser'
  },
  // eslint-plugin-vue
  plugins: [
    'vue', // 引入vue的插件 vue <==> eslint-plugin-vue
    'prettier' // 引入规范插件  prettier <==>  eslint-plugin-prettier
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off', //关闭驼峰校验
    'no-unused-vars': 'warn', //警告已声明,未读取校验,不报错了
    'prettier/prettier': [
      //解决和prettier冲突的问题
      'error',
      {
        singleQuote: true, //强制单引号
        semi: true, //去掉结尾的分号
        vueIndentScriptAndStyle: true, //vue中的script和css缩进
        tabWidth: 2, //缩进2
        endOfLine: 'lf', //换行符使用lf
        arrowParens: 'always', //箭头函数参数始终带括号
        trailingComma: 'none' //结尾不加逗号
      }
    ]
  }
};

//安装插件
npx pnpm i -D vite-plugin-eslint
//把配置项放在plugin数组中,vite.config.js
plugins: [
    vue(),
    eslintPlugin({
      cache: false,
      include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'],
    }),
 ]
```

#### 配置 prettier

```js
//安装
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

//.prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "vueIndentScriptAndStyle": true,
  "tabWidth": 2,
  "endOfLine": "lf",
  "arrowParens": "always",
  "eslintIntegration": true
}
```

### 代码提交规范

```js
//安装包
yarn add -D commitizen@4.2.4 @commitlint/cli@12.1.4  @commitlint/config-conventional@12.1.4 cz-customizable@6.3.0 husky@7.0.1
//package.json配置:新增如下内容
"config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  },
  "lint-staged": {
    "src/**/*.{js,vue}": [
      "eslint --fix",
      "git add"
    ]
  }


//根目录下新增文件.cz-config.cjs,看清楚是cjs
module.exports = {
  // 可选类型
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: 修复' },
    { value: 'docs', name: 'docs: 文档变更' },
    { value: 'style', name: 'style: 代码格式(不影响代码运行的变动)' },
    { value: 'revert', name: 'revert: 回退' },
    { value: 'build', name: 'build: 打包' }
  ],
  // 消息步骤
  messages: {
    type: '请选择提交类型:',
    customScope: '请输入修改范围(可选):',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n/e/h)'
  },
  // 跳过问题
  skipQuestions: ['body', 'footer'],
  // subject文字长度默认是72
  subjectLimit: 72
};


//根目录下新增commitlint.config.cjs,看清楚是cjs
module.exports = {
  extends: ['@commitlint/config-conventional'], // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build' // 打包
      ]
    ],
    // subject 大小写不做校验
    'subject-case': [0]
  }
};


//生成.husky 文件夹
//package.json添加如下命令
scripts:{
    ...,
    "prepare": "husky install"
}
//执行
yarn prepare

//更改 .husky/pre-commit 文件内容
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged

//创建 .husky/commit-msg 文件
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"


```

### 目录结构

```
进行中哦
```

### 前期准备

#### 安装 element-plus

参考官网即可

#### 样式处理

1. 浏览器样式统一化
2. 安装 sass,直接`yarn add sass -D`即可,不需要各种解析包,在`assets/scss/variable.scss`定义变量即可直接使用

#### axios 处理

安装

```
yarn add axios
```

配置

```js
//utils/request.js
import axios from 'axios';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';

// 在全局请求和响应拦截器中添加请求状态
let loading = null;
const service = axios.create({
  baseURL: '/api',
  timeout: 600000, //10分钟
  withCredentials: true //携带身份认证文件cookie
});

service.interceptors.request.use(
  (config) => {
    if (config.loading) {
      loading = ElLoading.service({ text: '拼命加载中' });
    }
    return config; //必须返回配置
  },
  (error) => {
    ElMessage.error(error.message);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const { code, msg } = response.data;
    const { responseType } = response.config;
    if (loading) loading.close();
    if (responseType == 'blob') {
      return response.data;
    }
    //要根据code决定下面的操作
    if (code == '0000') {
      return response.data;
    } else {
      //业务错误

      ElMessageBox.alert(msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        type: 'error',
        dangerouslyUseHTMLString: true
      });

      // ElMessage.error(msg || '请求失败'); //提示错误信息
      // return Promise.reject(new Error(msg || '请求失败'));
    }
  },
  (error) => {
    if (loading) loading.close();
    console.log('错误信息', error);
    ElMessage.error(error || error.message);
    return Promise.reject(error);
  }
);

export default service;
```

#### mock 数据

新建目录

```
src/mock
```

安装

```js
yarn add mock vite-plugin-mock -D
```

配置`vite.config.js/ts`

```js
import { viteMockServe } from 'vite-plugin-mock';
//plugins数组新增配置如下
viteMockServe({
  mockPath: '/src/mock',
  localEnabled: true, // 开发环境设为true,本地开发用
  prodEnabled: false, // 生产环境设为true,这样可以控制关闭mock的时候不让mock打包到最终代码内
  injectCode: ` import { setupProdMockServer } from './mockServer'; setupProdMockServer(); `, //注入mock接口
  logger: false, //是否在控制台显示请求日志
  supportTs: false, //打开后，可以读取 ts 文件模块.请注意,打开后将无法监视js文件
  watchFiles: true // 监听文件内容变更
});
```

配置文件`src/mockServer.js`

```js
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// 逐一导入您的mock.js文件
// 可以使用 import.meta.glob功能来进行全部导入,mock文件夹下创建user.js
import user from '../mock/user';
export function setupProdMockServer() {
  createProdMockServer([...index]);
}
//user.js内容
export default [
  {
    url: '/mock/demo',
    method: 'get',
    response: () => {
      return {
        code: '0000',
        message: 'ok',
        'data|12': [
          {
            warnBl: 0, // 预警占比
            'warnLevel|0-3': 0, // 预警等级
            'warnNum|0-100': 0, // 预警数量
            'warnTotal|0-100': 0 // 报警数量
          }
        ]
      };
    }
  }
];
//可以直接使用封装的axios,如果是mock的接口,直接用mock开头,使用环境变量来区分
```

#### 菜单栏

一般情况下,菜单栏二级居多,三级也有,四级罕见

我司用的都是三级菜单,对递归这一块依然迷迷糊糊,所以纪录下来,供以后温故

```js
//element-plus菜单结构
el-menu 主菜单,整个菜单
el-sub-menu 子菜单,二级或三级等子集菜单
el-menu-item 菜单项,最终可做为路由跳转的菜单节点
//定义路由表对应的菜单规则,需递归处理,menuType=2表示是按钮
对于单个路由route而言
1. 如果meta && meta.name || menuType==1,则显示menu菜单
	1.1 存在sub,就以el-sub-menu展示
    1.2 不存在sub,以el-menu-item展示


//实现路由的两种方案
1. 在处理路由的时候,生成对应的路由结构,component组件也需要动态处理
2. 先把所有的动态结构生成好,然后做匹配

仔细思考了一下,好像我用的这种 属于第二种方案的残次品,因为第一种我是根据返回的路由动态加上component,有一些问题,个人不好描述,在思考思考
```

比较麻烦的如图所示

![](https://cdn.jsdelivr.net/gh/ztao0916/image@main/img/20230212181932.png)

```js
//两个树形数组比对 找出相同项

//根据本地的全部路由来匹配接口返回的动态路由,最后筛选出匹配的本地路由,这是最终的渲染结果

//代码如下
export const _arrRoutes = (menus, localRoutes) => {
  const list = [];
  localRoutes.filter((item) =>
    menus.some((ele) => {
      if (item.sub && item.sub.length) {
        const routeChild = _arrRoutes(ele.sub ?? [], item.sub ?? []);
        if (routeChild.length) item.sub = routeChild;
      }
      // 筛选条件[自定义]
      if (item.name === ele.name && item.uri === ele.uri) {
        list.push(item);
      }
    })
  );
  return list;
};
```



### vue细节问题汇总

#### 相同name问题

会导致控制台报警告,这个问题,百度一大串乱七八糟的回复,基本都没用

```yaml
[Vue Router warn]: No match found for location with path "xxx"
```

解决办法就是: 让name不一样