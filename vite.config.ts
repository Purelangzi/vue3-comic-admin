import { defineConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { cdn } from 'vite-plugin-cdn2'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const prodMock = true
  return {
    base: isDev ? './' : '/', // 开发或生产环境服务的公共基础路径，默认/
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'], //自动引入vue、vuer-router和pinia的方法属性等，无需在页面中再次引入
        dts: 'src/types/auto-import.d.ts', // 路径下自动生成文件夹存放全局指令
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts',
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: 'mock', // 解析根目录下的mock文件夹
        // enable: true, // 3.0版本用enable，之前用localEnabled，是否启用 mock 功能

        localEnabled: command === 'serve', // 开发环境开关
        prodEnabled: command !== 'serve' && prodMock, // 生产打包开关
        supportTs: true, // 打开后，可以读取 ts ⽂件模块。请注意，打开后将⽆法监视.js ⽂件。
        // // 如果生产环境开启了 mock 功能,默认在main.ts注入代码以启动mock
        injectCode: ` import { setupProdMockServer } from '../mock';
          setupProdMockServer(); `,
      }),
      viteCompression({
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false, // 否禁用压缩，默认禁用，true为禁用,false为开启，打开压缩需配置nginx支持
        threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
        algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        ext: '.gz', // 压缩算法
        deleteOriginFile: true, // 源文件压缩后是否删除，默认false，这样才能在nginx静态结合动态压缩
      }),
      visualizer({ open: true }),
      cdn({
        url: 'https://cdn.bootcdn.net/ajax/libs/',
        modules: [
          'vue',
          'vue-demi',
          'vue-router',
          'pinia',
          { name: 'element-plus', aliases: ['es'] },
          '@element-plus/icons-vue',
          'vue-i18n',
          'axios',
          'xlsx',
        ],
        resolve: (base, { name, version }) => {
          if (name === 'vue' || name === 'vue-router' || name === 'vue-i18n') {
            return `${base}${name}/${version}/${name}.global.prod.min.js`
          } else if (name === 'vue-demi') {
            return `${base}${name}/${version}/index.iife.min.js`
          } else if (name === 'pinia') {
            return `${base}${name}/${version}/${name}.iife.prod.min.js`
          } else if (name === 'element-plus') {
            return `https://cdn.staticfile.org/${name}/${version}/index.full.min.js`
          } else if (name === '@element-plus/icons-vue') {
            return `${base}element-plus-icons-vue/${version}/global.iife.min.js`
          } else if (name === 'xlsx') {
            return `${base}${name}/${version}/${name}.full.min.js`
          } else {
            return `${base}${name}/${version}/${name}.min.js`
          }
        },
      }),
    ],
    // 开发阶段才代理跨域，上线后下面代码可以删除，后端cors解决
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'http://47.113.197.109:7001',
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js', // 解决开发环境警告
      },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          //导入 SCSS 全局变量文件
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    build: {
      target: 'es2020',
      outDir: 'dist', // 输出文件的目录
      sourcemap: !isProd, // 是否生成sourcemap文件,生产环境才关闭
      assetsInlineLimit: 4096, //默认4096,小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求
      minify: 'terser', // 'terser' 相对较慢，但大多数情况下构建后的文件体积更小，需安装terser。'esbuild' 最小化混淆更快但构建后的文件相对更大
      cssCodeSplit: true, // 启用/禁用 CSS 代码拆分
      terserOptions: {
        compress: {
          drop_console: isProd, // 生产环境去除console
          drop_debugger: isProd, // 生产环境去除debugger
        },
      },
      // 告诉打包工具 在external配置的 都是外部依赖项  不需要打包
      external: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'vue-i18n',
        'axios',
        'xlsx',
      ],
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // 静态资源拆分打包
            if (id.includes('node_modules')) {
              // 让每个插件都打包成独立的文件
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
        },
      },
    },
  }
})
