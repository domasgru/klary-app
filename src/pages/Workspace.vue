<template>
  <div>
    <div class="navigation">
      <BaseSvg
        class="navigation__logo"
        name="logo"
        @click.native="$router.push('/')"
      />
      <BaseButton @click="logoutUser">
        Logout
      </BaseButton>
    </div>
    <div class="content">
      <div class="container">
        <h5>Welcome to your workspace - <b>{{ currentWorkspace.name }}</b></h5>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { logout } from '@/firebase';

export default {
  computed: {
    ...mapState('workspace', ['currentWorkspace']),
  },
  methods: {
    ...mapActions('user', ['setUserAuth', 'unbindUser']),
    logoutUser() {
      logout();
      this.setUserAuth(null);
      this.unbindUser();
      this.$router.push('/');
    },
  },
};
</script>
<style lang="scss" scoped>
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 23px 56px;
  background: $light;

  &__logo {
    width: 120px;
    height: 26px;
    cursor: pointer;
  }
}

.content {
  width: 100%;
  height: 100%;
  padding-top: 150px;
  background: $grey-50;
}

.container {
  width: 1304px;
  margin: auto;
}
</style>
