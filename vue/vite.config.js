/*
 * @Author: ztao
 * @Date: 2023-08-22 10:52:57
 * @LastEditTime: 2024-03-04 14:04:08
 * @Description:
 */
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import { viteMockServe } from 'vite-plugin-mock';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import path from 'path';

const nodeResolve = (dir) => path.resolve(__dirname, '.', dir);

const commonUrl = 'http://localhost:8681/';
// const commonUrl = 'https://test.epean.cn/';

// const commonUrl = 'https://lms.epean.com.cn';
// https://vitejs.dev/config/
export default ({ mode }) => {
  let env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: '/trade-web/',
    plugins: [
      vue(),
      vueSetupExtend(), //vue3.0的setup扩展,可以在setup中定义name
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
        cache: false
      }),
      viteMockServe({
        //配置mock位置
        mockPath: '/src/mock',
        localEnabled: true, // 开发环境设为true,本地开发用
        prodEnabled: false, // 生产环境设为true,这样可以控制关闭mock的时候不让mock打包到最终代码内
        injectCode: ` import { setupProdMockServer } from './mockServer'; setupProdMockServer(); `, //注入mock接口
        logger: false, //是否在控制台显示请求日志
        supportTs: false, //打开后，可以读取 ts 文件模块.请注意,打开后将无法监视js文件
        watchFiles: true // 监听文件内容变更
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
            icon: env.VITE_APP_ICON
          }
        }
      })
    ],
    //定义全局常量
    define: {
      INITIAL_COUNT: 10
      // 开启 vue-devtools
      // __VUE_PROD_DEVTOOLS__: true
    },
    productionSourceMap: true,
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
      hmr: true, // disable hot-reloading
      port: 8083, //可写可不写,写了就是固定端口3000
      proxy: {
        '/api/lms/shopee': {
          timeout: 1920000,
          // target: commonUrl,
          // target: 'http://192.168.6.173:8051/lms/shopee/',
          // target: 'http://localhost:8084/',
          target: 'https://test.epean.cn/lms/shopee/',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api\/lms\/shopee/, ''), //重写转发的请求链接
          wss: true
        },
        '/api/chat': {
          timeout: 1920000,
          // target: commonUrl,
          // target: 'http://192.168.0.155:8051/',
          // target: 'https://lms.epean.com.cn/',
          target: 'https://test.epean.cn/',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api\/chat/, 'chat'), //重写转发的请求链接
          wss: true
        },
        '/api': {
          target: commonUrl, //实际的后端 api 地址。如请求/api/abc 会转发到http://test.epean.cn/api/abc
          changeOrigin: true, //是否改写origin.设为true,则请求header中origin将会与target配置项的域名一致
          secure: true, //如果是https请设置为true
          rewrite: (url) => url.replace(/^\/api/, '') //重写转发的请求链接
        },
        '/lms': {
          target: commonUrl, //实际的后端 api 地址。如请求/api/abc 会转发到http://test.epean.cn/api/abc
          changeOrigin: true, //是否改写origin.设为true,则请求header中origin将会与target配置项的域名一致
          secure: true, //如果是https请设置为true
          rewrite: (url) => url.replace(/^\/lms/, '/lms') //重写转发的请求链接
        }
        // '/chatApi': {
        //   target: commonChatUrl, //实际的后端 api 地址。如请求/api/abc 会转发到wss://test.epean.cn/
        //   changeOrigin: true, //是否改写origin.设为true,则请求header中origin将会与target配置项的域名一致
        //   secure: true, //如果是https请设置为true
        //   wss: true,
        //   rewrite: (url) => url.replace(/^\/chatApi/, '') //重写转发的请求链接
        // }
        // '/chatApi': {
        //   target: commonChatUrl, //实际的后端 api 地址。如请求/api/abc 会转发到wss://test.epean.cn/
        //   changeOrigin: true, //是否改写origin.设为true,则请求header中origin将会与target配置项的域名一致
        //   secure: true, //如果是https请设置为true
        //   wss: true,
        //   rewrite: (url) => url.replace(/^\/chatApi/, '') //重写转发的请求链接
        // }
      }
    },
    //提供全局scss变量
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `$injectedColor: orange;`,//直接提供变量$injectedColor
          additionalData: `@import "@/styles/variables.scss";`, //导入scss文件提供变量,这个最好
          javascriptEnabled: true
        }
      }
    }
  });
};
