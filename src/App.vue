<template>
  <router-view />
  <!-- eslint-disable -->
  <LoaderFullscreen v-if="loading" />
</template>

<script>
import { mapState } from 'vuex';
import LoaderFullscreen from '@/components/ui/LoaderFullscreen.vue';

export default {
  components: {
    LoaderFullscreen,
  },
  created() {
    const svgModules = require.context('./assets/icons', false, /\.svg$/, 'lazy');
    svgModules.keys().forEach(svgModules);
  },
  computed: {
    ...mapState(['loading']),

  },
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
</style>
