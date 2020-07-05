<template>
  <div />
</template>

<script>
import {
  auth, createUserProfileDocument, getUserDocument, getUserWorkspaces,
} from '@/firebase';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['userData']),
  },
  created() {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      this.setLoading(true);
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      auth.signInWithEmailLink(email, window.location.href)
        .then(async (result) => {
          window.localStorage.removeItem('emailForSignIn');

          const { user } = result;
          this.setUserAuth(user);

          if (result.additionalUserInfo.isNewUser) {
            await createUserProfileDocument(user);
            await this.bindUser(user.uid);
            this.setAllWorkspaces([]);
            this.$router.push('/complete-user');
            this.setLoading(false);
            return;
          }

          await this.bindUser(user.uid);

          const userWorkspaces = await getUserWorkspaces(user.uid);
          this.setAllWorkspaces(userWorkspaces);
          if (!this.userData.name || !userWorkspaces.length) {
            this.$router.push('/complete-user');
            this.setLoading(false);
            return;
          }

          this.$router.push('/workspace');
          this.setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.$router.push('/');
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    ...mapActions('user', ['setUserAuth', 'bindUser']),
    ...mapActions('workspace', ['setAllWorkspaces']),
  },
};
</script>

<style lang="scss" scoped>
//
</style>
