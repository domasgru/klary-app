/* eslint-disable no-underscore-dangle */
import { createApp } from 'vue';
import { VuelidatePlugin } from '@vuelidate/core'; // https://github.com/vuelidate/vuelidate/tree/next
import clickOutsideDirective from '@/plugins/click-outside';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { Vue as VueIntegration } from '@sentry/integrations';
import App from './App.vue';
import { router } from './router';
import { store } from './store';
import './firebase';
// eslint-disable-next-line import/no-unresolved
import 'windi.css';
import './scss/global/global.scss';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VuelidatePlugin);

app.config.isCustomElement = (tag) => tag.startsWith('emoji');
app.directive('click-outside', clickOutsideDirective);

const globalComponents = require.context('./components/global', false, /Base[A-Z]\w+\.(vue|js)$/);
globalComponents.keys().forEach((fileName) => {
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');
  app.component(componentName, globalComponents(fileName).default);
});

Sentry.init({
  dsn: 'https://f6d0ac28ca5b4b2a8108369781166909@o512707.ingest.sentry.io/5613438',
  integrations: [
    new Integrations.BrowserTracing(),
    new VueIntegration({ Vue: app }),
  ],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

app.mount('#app');
