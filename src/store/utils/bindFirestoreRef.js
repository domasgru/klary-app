const bindings = {};

export const pureSpliceArrayStateMutation = (
  state,
  {
    stateKey, index, removeValues, value,
  },
) => {
  const stateArray = state[stateKey] || [];
      if (value) {
        stateArray.splice(index, removeValues, value);
      } else {
        stateArray.splice(index, removeValues);
      }
      state[stateKey] = stateArray;
};

export const bindFirestoreArrayRefAction = (commit, stateKey, firestoreRef) => {
  const unsubscribe = firestoreRef
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(({
        type, newIndex, oldIndex, doc,
    }) => {
        if (type === 'added') {
          commit('pureSpliceArrayStateMutation', {
            stateKey,
            index: newIndex,
            removeValues: 0,
            value: doc.data(),
          });
        }
        if (type === 'modified') {
          commit('pureSpliceArrayStateMutation', {
            stateKey,
            index: newIndex,
            removeValues: 1,
            value: doc.data(),
          });
        }
        if (type === 'removed') {
          commit('pureSpliceArrayStateMutation', {
            stateKey,
            index: oldIndex,
            removeValues: 1,
          });
        }
      });
  });
  bindings[stateKey] = unsubscribe;
};

export const unbindFirestoreRef = (stateKey) => {
  if (!bindings[stateKey]) {
    return Promise.resolve();
  }
  return bindings[stateKey]();
};
