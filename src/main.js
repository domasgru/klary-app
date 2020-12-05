/* eslint-disable no-underscore-dangle */
import { createApp } from 'vue';
import { VuelidatePlugin } from '@vuelidate/core'; // https://github.com/vuelidate/vuelidate/tree/next
import clickOutsideDirective from '@/plugins/click-outside';
import App from './App.vue';
import { router } from './router';
import { store } from './store';
import './firebase';
import './scss/global/global.scss';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VuelidatePlugin);

app.directive('click-outside', clickOutsideDirective);

const globalComponents = require.context('./components/global', false, /Base[A-Z]\w+\.(vue|js)$/);
globalComponents.keys().forEach((fileName) => {
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  app.component(componentName, globalComponents(fileName).default);
});

app.mount('#app');
