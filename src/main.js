import Vue from 'vue';
import VueRouter from 'vue-router'; // https://github.com/vuejs/vue-router-next
import Vuelidate from 'vuelidate'; // https://github.com/vuelidate/vuelidate/tree/next
import VueShortKey from 'vue-shortkey';
import VueCompositionAPI from '@vue/composition-api';
import ClickOutside from 'v-click-outside';
import App from './App.vue';
import router from './router';
import store from './store';
import './firebase';
import './scss/global/global.scss';

Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.use(VueShortKey);
Vue.use(VueCompositionAPI);
Vue.directive('click-outside', ClickOutside.directive);

const globalComponents = require.context('./components/global', false, /Base[A-Z]\w+\.(vue|js)$/);
globalComponents.keys().forEach((fileName) => {
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  Vue.component(componentName, globalComponents(fileName).default);
});

Vue.config.productionTip = false;

// const svgModules = require.context('./assets/icons', false, /\.svg$/);
// svgModules.keys().forEach(svgModules);

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
