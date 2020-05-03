<template>
  <div id="app">
    <Navigation />
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Firebase from '@/firebaseConfig';
import Navigation from '@/components/Navigation.vue';

export default {
  components: {
    Navigation,
  },
  mounted() {
    Firebase.auth.onAuthStateChanged((user) => {
      this.setUser(user);
    });
  },
  methods: mapActions('user', ['setUser']),
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
