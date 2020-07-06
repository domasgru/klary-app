// Automatically imports all the modules and exports as a single module object
const requireModule = require.context('.', false, /\.js$/);
const modules = {};

requireModule.keys().forEach((fileName) => {
  if (fileName === './index.js') return;

  // create the module name from fileName
  // remove the store.js extension and capitalize
  const moduleName = fileName
    .replace(/(\.\/|\.js)/g, '');
    // .replace(/^\w/, (c) => c.toUpperCase());

  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName).default,
  };
});

export default modules;
