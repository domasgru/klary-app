<template>
  <div id="app">
    <router-view />
    <LoaderFullscreen v-if="loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoaderFullscreen from '@/components/ui/LoaderFullscreen.vue';


export default {
  components: {
    LoaderFullscreen,
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
