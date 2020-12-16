/* eslint-disable import/prefer-default-export */
import { computed } from 'vue';
import { useStore } from 'vuex';

export const useGetUser = (id) => {
  const store = useStore();
  return computed(() => store.state.workspace.team[id]);
};
