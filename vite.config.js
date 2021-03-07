// eslint-disable-next-line import/no-extraneous-dependencies
import vue from '@vitejs/plugin-vue';

const path = require('path');

export default {
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/scss/global/_variables.scss";
          @import "./src/scss/global/_mixins.scss";
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
