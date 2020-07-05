module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/global/_variables.scss";
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
  },
};
