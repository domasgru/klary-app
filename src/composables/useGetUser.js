/* eslint-disable import/prefer-default-export */
import { computed, watch } from 'vue';
import { useStore } from 'vuex';

export const useGetUser = (id) => {
  const store = useStore();
  watch(() => {
    console.log(id);
  });
  return computed(() => store.state.workspace.team[id]);
};
