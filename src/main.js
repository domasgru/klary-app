/* eslint-disable no-underscore-dangle */
import { createApp } from 'vue';
import { VuelidatePlugin } from '@vuelidate/core'; // https://github.com/vuelidate/vuelidate/tree/next
import App from './App.vue';
import { router } from './router';
import { store } from './store';
import './firebase';
import './scss/global/global.scss';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VuelidatePlugin);

app.directive('click-outside', {
  beforeMount(el, binding) {
      // Define ourClickEventHandler
      const ourClickEventHandler = (event) => {
          if (!el.contains(event.target) && el !== event.target) {
              // as we are attaching an click event listern to the document (below)
              // ensure the events target is outside the element or a child of it
              binding.value(event); // before binding it
          }
      };
      // attached the handler to the element so we can remove it later easily
      el.__vueClickEventHandler__ = ourClickEventHandler;

      // attaching ourClickEventHandler to a listener on the document here
      document.addEventListener('click', ourClickEventHandler);
  },
  unmounted(el) {
      // Remove Event Listener
      document.removeEventListener('click', el.__vueClickEventHandler__);
  },
});

const globalComponents = require.context('./components/global', false, /Base[A-Z]\w+\.(vue|js)$/);
globalComponents.keys().forEach((fileName) => {
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  app.component(componentName, globalComponents(fileName).default);
});

app.mount('#app');
