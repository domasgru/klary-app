import { createStore, createLogger } from 'vuex';
import { vuexfireMutations, firestoreOptions } from 'vuexfire';
import modules from './modules';

firestoreOptions.wait = true;
const isProduction = process.env.NODE_ENV === 'production';

// eslint-disable-next-line import/prefer-default-export
export const store = createStore({
  state: {
    loading: false,
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value;
    },
    ...vuexfireMutations,
  },
  modules,
  plugins: [
    ...(!isProduction ? [createLogger()] : []),
  ],
  strict: !isProduction,
});
