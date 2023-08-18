declare module 'postcss-px-to-viewport' {
  function postcss_px_to_viewport(args: any): any

  namespace postcss_px_to_viewport {
    function postcss(css: any): void
    function process(css: any, processOpts: any, pluginOpts: any): any

    namespace postcss {
      const postcssPlugin: string
      const postcssVersion: string
    }
  }

  export = postcss_px_to_viewport
}
