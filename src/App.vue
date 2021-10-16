<template>
  <router-view />
  <LoaderFullscreen v-if="loading" />
  <NotSupportedBrowser
    v-if="isBrowserNotSupported"
    class="not-supported"
  />
  <div id="modals" />
  <div id="popup-portal" />
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import LoaderFullscreen from '@/components/ui/LoaderFullscreen.vue';
import NotSupportedBrowser from '@/pages/NotSupportedBrowser.vue';
import { auth } from '@/firebase';

export default {
  components: {
    LoaderFullscreen,
    NotSupportedBrowser,
  },
  data() {
    return {
      isBrowserNotSupported: false,
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('user', ['userAuth']),
  },
  created() {
    this.prepareSvg();
    this.observeAuth();
    this.handleBrowserSupport();
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
    handleBrowserSupport() {
      const ua = navigator.userAgent || navigator.vendor;

      this.isBrowserNotSupported = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}

.not-supported {
  z-index: 10000;
}
</style>
