/* eslint-disable import/prefer-default-export */
import { useStore } from 'vuex';

export const useGetUser = (id) => {
  const store = useStore();
  return store.state.workspace.team[id];
};
