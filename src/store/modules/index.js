// Automatically imports all the modules and exports as a single module object
const requireModule = import.meta.globEager('./*.js');
const modules = {};

Object.entries(requireModule).forEach(([path, module]) => {
  if (path === './index.js') return;

  // create the module name from fileName
  // remove the store.js extension and capitalize
  const moduleName = path
    .replace(/(\.\/|\.js)/g, '');
    // .replace(/^\w/, (c) => c.toUpperCase());

  modules[moduleName] = {
    namespaced: true,
    ...module.default,
  };
});

export default modules;
