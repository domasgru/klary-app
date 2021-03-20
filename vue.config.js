module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/global/_variables.scss";
          @import "@/scss/global/_mixins.scss";
        `,
      },
    },
  },
  chainWebpack: (config) => {
    // configure svg sprites
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end();

      config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: (tag) => /^emoji-/.test(tag),
        };
        return options;
      });
  },
};
