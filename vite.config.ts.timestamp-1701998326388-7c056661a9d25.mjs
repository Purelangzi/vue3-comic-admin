// vite.config.ts
import { defineConfig } from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+vite@4.3.2_sass@1.62.1_terser@5.19.2/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue@4.1.0_vite@4.3.2_vue@3.2.47/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+unplugin-auto-import@0.16.6_@vueuse+core@10.2.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.1_vue@3.2.47/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.1_vue@3.2.47/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { createSvgIconsPlugin } from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-svg-icons@2.0.1_vite@4.3.2/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
import { viteMockServe } from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-mock@2.9.8_mockjs@1.1.0_vite@4.3.2/node_modules/vite-plugin-mock/dist/index.js";
import viteCompression from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-compression@0.5.1_vite@4.3.2/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+rollup-plugin-visualizer@5.9.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { cdn } from "file:///F:/vue3/vue3-ts-admin/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-cdn2@0.11.3/node_modules/vite-plugin-cdn2/dist/index.mjs";
var vite_config_default = defineConfig(({ command, mode }) => {
  const isDev = mode === "development";
  const isProd = mode === "production";
  const prodMock = true;
  return {
    base: isDev ? "./" : "/",
    // 开发或生产环境服务的公共基础路径，默认/
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        //自动引入vue、vuer-router和pinia的方法属性等，无需在页面中再次引入
        dts: "src/types/auto-import.d.ts",
        // 路径下自动生成文件夹存放全局指令
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: "src/types/components.d.ts"
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        mockPath: "mock",
        // 解析根目录下的mock文件夹
        // enable: true, // 3.0版本用enable，之前用localEnabled，是否启用 mock 功能
        localEnabled: command === "serve",
        // 开发环境开关
        prodEnabled: command !== "serve" && prodMock,
        // 生产打包开关
        supportTs: true,
        // 打开后，可以读取 ts ⽂件模块。请注意，打开后将⽆法监视.js ⽂件。
        // // 如果生产环境开启了 mock 功能,默认在main.ts注入代码以启动mock
        injectCode: ` import { setupProdMockServer } from '../mock';
          setupProdMockServer(); `
      }),
      viteCompression({
        verbose: true,
        // 是否在控制台中输出压缩结果
        disable: false,
        // 否禁用压缩，默认禁用，true为禁用,false为开启，打开压缩需配置nginx支持
        threshold: 10240,
        // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
        algorithm: "gzip",
        // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        ext: ".gz",
        // 压缩算法
        deleteOriginFile: true
        // 源文件压缩后是否删除，默认false，这样才能在nginx静态结合动态压缩
      }),
      visualizer({ open: true }),
      cdn({
        url: "https://cdn.bootcdn.net/ajax/libs/",
        modules: [
          "vue",
          "vue-demi",
          "vue-router",
          "pinia",
          { name: "element-plus", aliases: ["es"] },
          "@element-plus/icons-vue",
          "vue-i18n",
          "axios",
          "xlsx"
        ],
        resolve: (base, { name, version }) => {
          if (name === "vue" || name === "vue-router" || name === "vue-i18n") {
            return `${base}${name}/${version}/${name}.global.prod.min.js`;
          } else if (name === "vue-demi") {
            return `${base}${name}/${version}/index.iife.min.js`;
          } else if (name === "pinia") {
            return `${base}${name}/${version}/${name}.iife.prod.min.js`;
          } else if (name === "element-plus") {
            return `https://cdn.staticfile.org/${name}/${version}/index.full.min.js`;
          } else if (name === "@element-plus/icons-vue") {
            return `${base}element-plus-icons-vue/${version}/global.iife.min.js`;
          } else if (name === "xlsx") {
            return `${base}${name}/${version}/${name}.full.min.js`;
          } else {
            return `${base}${name}/${version}/${name}.min.js`;
          }
        }
      })
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
        "@": path.resolve("./src"),
        // 相对路径别名配置，使用 @ 代替 src
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
        // 解决开发环境警告
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          //导入 SCSS 全局变量文件
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    build: {
      target: "es2020",
      outDir: "dist",
      // 输出文件的目录
      sourcemap: !isProd,
      // 是否生成sourcemap文件,生产环境才关闭
      assetsInlineLimit: 4096,
      //默认4096,小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求
      minify: "terser",
      // 'terser' 相对较慢，但大多数情况下构建后的文件体积更小，需安装terser。'esbuild' 最小化混淆更快但构建后的文件相对更大
      cssCodeSplit: true,
      // 启用/禁用 CSS 代码拆分
      terserOptions: {
        compress: {
          drop_console: isProd,
          // 生产环境去除console
          drop_debugger: isProd
          // 生产环境去除debugger
        }
      },
      // 告诉打包工具 在external配置的 都是外部依赖项  不需要打包
      external: [
        "vue",
        "vue-router",
        "pinia",
        "element-plus",
        "@element-plus/icons-vue",
        "vue-i18n",
        "axios",
        "xlsx"
      ],
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFx2dWUzXFxcXHZ1ZTMtdHMtYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXHZ1ZTNcXFxcdnVlMy10cy1hZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovdnVlMy92dWUzLXRzLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBDb25maWdFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB2aXRlTW9ja1NlcnZlIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcblxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbidcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgeyBjZG4gfSBmcm9tICd2aXRlLXBsdWdpbi1jZG4yJ1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH06IENvbmZpZ0VudikgPT4ge1xuICBjb25zdCBpc0RldiA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCdcbiAgY29uc3QgaXNQcm9kID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nXG4gIGNvbnN0IHByb2RNb2NrID0gdHJ1ZVxuICByZXR1cm4ge1xuICAgIGJhc2U6IGlzRGV2ID8gJy4vJyA6ICcvJywgLy8gXHU1RjAwXHU1M0QxXHU2MjE2XHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU2NzBEXHU1MkExXHU3Njg0XHU1MTZDXHU1MTcxXHU1N0ZBXHU3ODQwXHU4REVGXHU1Rjg0XHVGRjBDXHU5RUQ4XHU4QkE0L1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSwgLy9cdTgxRUFcdTUyQThcdTVGMTVcdTUxNjV2dWVcdTMwMDF2dWVyLXJvdXRlclx1NTQ4Q3BpbmlhXHU3Njg0XHU2NUI5XHU2Q0Q1XHU1QzVFXHU2MDI3XHU3QjQ5XHVGRjBDXHU2NUUwXHU5NzAwXHU1NzI4XHU5ODc1XHU5NzYyXHU0RTJEXHU1MThEXHU2QjIxXHU1RjE1XHU1MTY1XG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydC5kLnRzJywgLy8gXHU4REVGXHU1Rjg0XHU0RTBCXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU2NTg3XHU0RUY2XHU1OTM5XHU1QjU4XHU2NTNFXHU1MTY4XHU1QzQwXHU2MzA3XHU0RUU0XG4gICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICB9KSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICAgICAgICBkdHM6ICdzcmMvdHlwZXMvY29tcG9uZW50cy5kLnRzJyxcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nLFxuICAgICAgfSksXG4gICAgICB2aXRlTW9ja1NlcnZlKHtcbiAgICAgICAgbW9ja1BhdGg6ICdtb2NrJywgLy8gXHU4OUUzXHU2NzkwXHU2ODM5XHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0bW9ja1x1NjU4N1x1NEVGNlx1NTkzOVxuICAgICAgICAvLyBlbmFibGU6IHRydWUsIC8vIDMuMFx1NzI0OFx1NjcyQ1x1NzUyOGVuYWJsZVx1RkYwQ1x1NEU0Qlx1NTI0RFx1NzUyOGxvY2FsRW5hYmxlZFx1RkYwQ1x1NjYyRlx1NTQyNlx1NTQyRlx1NzUyOCBtb2NrIFx1NTI5Rlx1ODBGRFxuXG4gICAgICAgIGxvY2FsRW5hYmxlZDogY29tbWFuZCA9PT0gJ3NlcnZlJywgLy8gXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU1RjAwXHU1MTczXG4gICAgICAgIHByb2RFbmFibGVkOiBjb21tYW5kICE9PSAnc2VydmUnICYmIHByb2RNb2NrLCAvLyBcdTc1MUZcdTRFQTdcdTYyNTNcdTUzMDVcdTVGMDBcdTUxNzNcbiAgICAgICAgc3VwcG9ydFRzOiB0cnVlLCAvLyBcdTYyNTNcdTVGMDBcdTU0MEVcdUZGMENcdTUzRUZcdTRFRTVcdThCRkJcdTUzRDYgdHMgXHUyRjQyXHU0RUY2XHU2QTIxXHU1NzU3XHUzMDAyXHU4QkY3XHU2Q0U4XHU2MTBGXHVGRjBDXHU2MjUzXHU1RjAwXHU1NDBFXHU1QzA2XHUyRjQ2XHU2Q0Q1XHU3NkQxXHU4OUM2LmpzIFx1MkY0Mlx1NEVGNlx1MzAwMlxuICAgICAgICAvLyAvLyBcdTU5ODJcdTY3OUNcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTVGMDBcdTU0MkZcdTRFODYgbW9jayBcdTUyOUZcdTgwRkQsXHU5RUQ4XHU4QkE0XHU1NzI4bWFpbi50c1x1NkNFOFx1NTE2NVx1NEVFM1x1NzgwMVx1NEVFNVx1NTQyRlx1NTJBOG1vY2tcbiAgICAgICAgaW5qZWN0Q29kZTogYCBpbXBvcnQgeyBzZXR1cFByb2RNb2NrU2VydmVyIH0gZnJvbSAnLi4vbW9jayc7XG4gICAgICAgICAgc2V0dXBQcm9kTW9ja1NlcnZlcigpOyBgLFxuICAgICAgfSksXG4gICAgICB2aXRlQ29tcHJlc3Npb24oe1xuICAgICAgICB2ZXJib3NlOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU3MjhcdTYzQTdcdTUyMzZcdTUzRjBcdTRFMkRcdThGOTNcdTUxRkFcdTUzOEJcdTdGMjlcdTdFRDNcdTY3OUNcbiAgICAgICAgZGlzYWJsZTogZmFsc2UsIC8vIFx1NTQyNlx1Nzk4MVx1NzUyOFx1NTM4Qlx1N0YyOVx1RkYwQ1x1OUVEOFx1OEJBNFx1Nzk4MVx1NzUyOFx1RkYwQ3RydWVcdTRFM0FcdTc5ODFcdTc1MjgsZmFsc2VcdTRFM0FcdTVGMDBcdTU0MkZcdUZGMENcdTYyNTNcdTVGMDBcdTUzOEJcdTdGMjlcdTk3MDBcdTkxNERcdTdGNkVuZ2lueFx1NjUyRlx1NjMwMVxuICAgICAgICB0aHJlc2hvbGQ6IDEwMjQwLCAvLyBcdTU5ODJcdTY3OUNcdTRGNTNcdTc5RUZcdTU5MjdcdTRFOEVcdTk2MDhcdTUwM0NcdUZGMENcdTVDMDZcdTg4QUJcdTUzOEJcdTdGMjlcdUZGMENcdTUzNTVcdTRGNERcdTRFM0FiXHVGRjBDXHU0RjUzXHU3OUVGXHU4RkM3XHU1QzBGXHU2NUY2XHU4QkY3XHU0RTBEXHU4OTgxXHU1MzhCXHU3RjI5XHVGRjBDXHU0RUU1XHU1MTREXHU5MDAyXHU1Rjk3XHU1MTc2XHU1M0NEXG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLCAvLyBcdTUzOEJcdTdGMjlcdTdCOTdcdTZDRDVcdUZGMENcdTUzRUZcdTkwMDlbJ2d6aXAnXHVGRjBDJyBicm90bGljY29tcHJlc3MgJ1x1RkYwQydkZWZsYXRlICdcdUZGMEMnZGVmbGF0ZVJhdyddXG4gICAgICAgIGV4dDogJy5neicsIC8vIFx1NTM4Qlx1N0YyOVx1N0I5N1x1NkNENVxuICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiB0cnVlLCAvLyBcdTZFOTBcdTY1ODdcdTRFRjZcdTUzOEJcdTdGMjlcdTU0MEVcdTY2MkZcdTU0MjZcdTUyMjBcdTk2NjRcdUZGMENcdTlFRDhcdThCQTRmYWxzZVx1RkYwQ1x1OEZEOVx1NjgzN1x1NjI0RFx1ODBGRFx1NTcyOG5naW54XHU5NzU5XHU2MDAxXHU3RUQzXHU1NDA4XHU1MkE4XHU2MDAxXHU1MzhCXHU3RjI5XG4gICAgICB9KSxcbiAgICAgIHZpc3VhbGl6ZXIoeyBvcGVuOiB0cnVlIH0pLFxuICAgICAgY2RuKHtcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9jZG4uYm9vdGNkbi5uZXQvYWpheC9saWJzLycsXG4gICAgICAgIG1vZHVsZXM6IFtcbiAgICAgICAgICAndnVlJyxcbiAgICAgICAgICAndnVlLWRlbWknLFxuICAgICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgICAncGluaWEnLFxuICAgICAgICAgIHsgbmFtZTogJ2VsZW1lbnQtcGx1cycsIGFsaWFzZXM6IFsnZXMnXSB9LFxuICAgICAgICAgICdAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZScsXG4gICAgICAgICAgJ3Z1ZS1pMThuJyxcbiAgICAgICAgICAnYXhpb3MnLFxuICAgICAgICAgICd4bHN4JyxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb2x2ZTogKGJhc2UsIHsgbmFtZSwgdmVyc2lvbiB9KSA9PiB7XG4gICAgICAgICAgaWYgKG5hbWUgPT09ICd2dWUnIHx8IG5hbWUgPT09ICd2dWUtcm91dGVyJyB8fCBuYW1lID09PSAndnVlLWkxOG4nKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7YmFzZX0ke25hbWV9LyR7dmVyc2lvbn0vJHtuYW1lfS5nbG9iYWwucHJvZC5taW4uanNgXG4gICAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAndnVlLWRlbWknKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7YmFzZX0ke25hbWV9LyR7dmVyc2lvbn0vaW5kZXguaWlmZS5taW4uanNgXG4gICAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSAncGluaWEnKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7YmFzZX0ke25hbWV9LyR7dmVyc2lvbn0vJHtuYW1lfS5paWZlLnByb2QubWluLmpzYFxuICAgICAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2VsZW1lbnQtcGx1cycpIHtcbiAgICAgICAgICAgIHJldHVybiBgaHR0cHM6Ly9jZG4uc3RhdGljZmlsZS5vcmcvJHtuYW1lfS8ke3ZlcnNpb259L2luZGV4LmZ1bGwubWluLmpzYFxuICAgICAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ0BlbGVtZW50LXBsdXMvaWNvbnMtdnVlJykge1xuICAgICAgICAgICAgcmV0dXJuIGAke2Jhc2V9ZWxlbWVudC1wbHVzLWljb25zLXZ1ZS8ke3ZlcnNpb259L2dsb2JhbC5paWZlLm1pbi5qc2BcbiAgICAgICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICd4bHN4Jykge1xuICAgICAgICAgICAgcmV0dXJuIGAke2Jhc2V9JHtuYW1lfS8ke3ZlcnNpb259LyR7bmFtZX0uZnVsbC5taW4uanNgXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtiYXNlfSR7bmFtZX0vJHt2ZXJzaW9ufS8ke25hbWV9Lm1pbi5qc2BcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIC8vIFx1NUYwMFx1NTNEMVx1OTYzNlx1NkJCNVx1NjI0RFx1NEVFM1x1NzQwNlx1OERFOFx1NTdERlx1RkYwQ1x1NEUwQVx1N0VCRlx1NTQwRVx1NEUwQlx1OTc2Mlx1NEVFM1x1NzgwMVx1NTNFRlx1NEVFNVx1NTIyMFx1OTY2NFx1RkYwQ1x1NTQwRVx1N0FFRmNvcnNcdTg5RTNcdTUxQjNcbiAgICAvLyBzZXJ2ZXI6IHtcbiAgICAvLyAgIHByb3h5OiB7XG4gICAgLy8gICAgICcvYXBpJzoge1xuICAgIC8vICAgICAgIHRhcmdldDogJ2h0dHA6Ly80Ny4xMTMuMTk3LjEwOTo3MDAxJyxcbiAgICAvLyAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgIC8vICAgICB9LFxuICAgIC8vICAgfSxcbiAgICAvLyB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKCcuL3NyYycpLCAvLyBcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcdTUyMkJcdTU0MERcdTkxNERcdTdGNkVcdUZGMENcdTRGN0ZcdTc1MjggQCBcdTRFRTNcdTY2RkYgc3JjXG4gICAgICAgICd2dWUtaTE4bic6ICd2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qcycsIC8vIFx1ODlFM1x1NTFCM1x1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1OEI2Nlx1NTQ0QVxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgLy8gQ1NTIFx1OTg4NFx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgLy9cdTVCRkNcdTUxNjUgU0NTUyBcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0ZcdTY1ODdcdTRFRjZcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0BpbXBvcnQgXCIuL3NyYy9zdHlsZXMvdmFyaWFibGUuc2Nzc1wiOycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgICBvdXREaXI6ICdkaXN0JywgLy8gXHU4RjkzXHU1MUZBXHU2NTg3XHU0RUY2XHU3Njg0XHU3NkVFXHU1RjU1XG4gICAgICBzb3VyY2VtYXA6ICFpc1Byb2QsIC8vIFx1NjYyRlx1NTQyNlx1NzUxRlx1NjIxMHNvdXJjZW1hcFx1NjU4N1x1NEVGNixcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTYyNERcdTUxNzNcdTk1RURcbiAgICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2LCAvL1x1OUVEOFx1OEJBNDQwOTYsXHU1QzBGXHU0RThFXHU2QjY0XHU5NjA4XHU1MDNDXHU3Njg0XHU1QkZDXHU1MTY1XHU2MjE2XHU1RjE1XHU3NTI4XHU4RDQ0XHU2RTkwXHU1QzA2XHU1MTg1XHU4MDU0XHU0RTNBIGJhc2U2NCBcdTdGMTZcdTc4MDFcdUZGMENcdTRFRTVcdTkwN0ZcdTUxNERcdTk4OURcdTU5MTZcdTc2ODQgaHR0cCBcdThCRjdcdTZDNDJcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsIC8vICd0ZXJzZXInIFx1NzZGOFx1NUJGOVx1OEY4M1x1NjE2Mlx1RkYwQ1x1NEY0Nlx1NTkyN1x1NTkxQVx1NjU3MFx1NjBDNVx1NTFCNVx1NEUwQlx1Njc4NFx1NUVGQVx1NTQwRVx1NzY4NFx1NjU4N1x1NEVGNlx1NEY1M1x1NzlFRlx1NjZGNFx1NUMwRlx1RkYwQ1x1OTcwMFx1NUI4OVx1ODhDNXRlcnNlclx1MzAwMidlc2J1aWxkJyBcdTY3MDBcdTVDMEZcdTUzMTZcdTZERjdcdTZEQzZcdTY2RjRcdTVGRUJcdTRGNDZcdTY3ODRcdTVFRkFcdTU0MEVcdTc2ODRcdTY1ODdcdTRFRjZcdTc2RjhcdTVCRjlcdTY2RjRcdTU5MjdcbiAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSwgLy8gXHU1NDJGXHU3NTI4L1x1Nzk4MVx1NzUyOCBDU1MgXHU0RUUzXHU3ODAxXHU2MkM2XHU1MjA2XG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiBpc1Byb2QsIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTNCQlx1OTY2NGNvbnNvbGVcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiBpc1Byb2QsIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTNCQlx1OTY2NGRlYnVnZ2VyXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gXHU1NDRBXHU4QkM5XHU2MjUzXHU1MzA1XHU1REU1XHU1MTc3IFx1NTcyOGV4dGVybmFsXHU5MTREXHU3RjZFXHU3Njg0IFx1OTBGRFx1NjYyRlx1NTkxNlx1OTBFOFx1NEY5RFx1OEQ1Nlx1OTg3OSAgXHU0RTBEXHU5NzAwXHU4OTgxXHU2MjUzXHU1MzA1XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAncGluaWEnLFxuICAgICAgICAnZWxlbWVudC1wbHVzJyxcbiAgICAgICAgJ0BlbGVtZW50LXBsdXMvaWNvbnMtdnVlJyxcbiAgICAgICAgJ3Z1ZS1pMThuJyxcbiAgICAgICAgJ2F4aW9zJyxcbiAgICAgICAgJ3hsc3gnLFxuICAgICAgXSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgLy8gXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU1MjA2XHU3QzdCXHU2MjUzXHU1MzA1XG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXG4gICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgICAvLyBcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTYyQzZcdTUyMDZcdTYyNTNcdTUzMDVcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgLy8gXHU4QkE5XHU2QkNGXHU0RTJBXHU2M0QyXHU0RUY2XHU5MEZEXHU2MjUzXHU1MzA1XHU2MjEwXHU3MkVDXHU3QUNCXHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgICAgICAgICAgIHJldHVybiBpZFxuICAgICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV1cbiAgICAgICAgICAgICAgICAuc3BsaXQoJy8nKVswXVxuICAgICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVAsU0FBUyxvQkFBK0I7QUFDL1IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUU5QixPQUFPLHFCQUFxQjtBQUM1QixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLFdBQVc7QUFFcEIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBaUI7QUFDNUQsUUFBTSxRQUFRLFNBQVM7QUFDdkIsUUFBTSxTQUFTLFNBQVM7QUFDeEIsUUFBTSxXQUFXO0FBQ2pCLFNBQU87QUFBQSxJQUNMLE1BQU0sUUFBUSxPQUFPO0FBQUE7QUFBQSxJQUNyQixTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixXQUFXO0FBQUEsUUFDVCxTQUFTLENBQUMsT0FBTyxjQUFjLE9BQU87QUFBQTtBQUFBLFFBQ3RDLEtBQUs7QUFBQTtBQUFBLFFBQ0wsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDbkMsQ0FBQztBQUFBLE1BQ0Qs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
