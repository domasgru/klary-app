/* eslint-disable import/prefer-default-export */
import { getCurrentInstance } from '@vue/composition-api';

export const useGetUser = (id) => {
  const { $store } = getCurrentInstance();
  return $store.state.workspace.team[id];
};
