import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import { firestorePlugin } from 'vuefire';
import LottiePlayer from 'lottie-player-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './firebase';
import './scss/global/global.scss';

Vue.use(VueRouter);
Vue.use(firestorePlugin);
Vue.use(Vuelidate);
Vue.use(LottiePlayer);

const globalComponents = require.context('./components/global', false, /Base[A-Z]\w+\.(vue|js)$/);
globalComponents.keys().forEach((fileName) => {
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  Vue.component(componentName, globalComponents(fileName).default);
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
