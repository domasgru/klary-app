const bindings = {};

export const bindFirestoreArrayRefMutations = {
  bindEmptyArray: (state, stateKey) => { state[stateKey] = []; },
  pureSpliceArrayStateMutation: (
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
  },
};

export const unbindFirestoreRef = (stateKey) => {
  if (!bindings[stateKey]) {
    return Promise.resolve('done');
  }
  console.log(typeof bindings[stateKey]);
  return bindings[stateKey]();
};

export const bindFirestoreArrayRefAction = async (commit, stateKey, firestoreRef) => {
  unbindFirestoreRef(stateKey);
  commit('bindEmptyArray', stateKey);

  let unbind;
  const promise = new Promise((resolve, reject) => {
    unbind = firestoreRef
    .onSnapshot((snapshot) => {
      if (!snapshot.docChanges().length) {
        commit('bindEmptyArray', stateKey);
        resolve([]);
      }
      snapshot.docChanges().forEach(({
        type, newIndex, oldIndex, doc,
      }) => {
        const value = { id: doc.id, ...doc.data() };
        if (type === 'added') {
          commit('pureSpliceArrayStateMutation', {
            stateKey,
            index: newIndex,
            removeValues: 0,
            value,
          });
        }
        if (type === 'modified') {
          commit('pureSpliceArrayStateMutation', {
            stateKey,
            index: newIndex,
            removeValues: 1,
            value,
          });
        }
        if (type === 'removed') {
          commit('pureSpliceArrayStateMutation', {
            stateKey,
            index: oldIndex,
            removeValues: 1,
          });
        }
        resolve(doc);
      });
    }, reject);
  });
  bindings[stateKey] = unbind;
  return promise;
};
