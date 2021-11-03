module.exports = {
  pluginOptions: {
  },
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
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: (tag) => tag.startsWith('emoji'),
        },
      }));
  },
};
