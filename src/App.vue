<template>
  <router-view />
  <LoaderFullscreen v-if="loading" />
  <div id="modals" />
  <div id="popup-portal" />
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import LoaderFullscreen from '@/components/ui/LoaderFullscreen.vue';
import { auth } from '@/firebase';

export default {
  components: {
    LoaderFullscreen,
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('user', ['userAuth']),
  },
  created() {
    this.prepareSvg();
    this.observeAuth();
  },
  methods: {
    ...mapMutations('user', ['setUserAuth']),
    ...mapActions('user', ['bindUser']),
    prepareSvg() {
      const svgModules = require.context('./assets/icons', false, /\.svg$/, 'lazy');
      svgModules.keys().forEach(svgModules);
    },
    observeAuth() {
      auth.onAuthStateChanged((user) => {
        if (user && !this.userAuth) {
          this.setUserAuth({ email: user.email, uid: user.uid });
          this.bindUser(user.uid);
        } else {
          // window.location.replace(window.location.origin);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
</style>
