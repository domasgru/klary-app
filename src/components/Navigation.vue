<template>
  <nav class="navigation">
    <div class="navigation__container">
      <div
        class="navigation__brand"
        @click="$router.push('/')"
      >
        Feedback app
      </div>
      <div class="navigation__group">
        <p
          v-if="user"
          class="navigation__email"
        >
          Hello, {{ user && user.email }}
        </p>
        <BaseButton
          v-if="!user"
          class="navigation__button"
          @click="$router.push('/get-started')"
        >
          Get started
        </BaseButton>
        <template v-else>
          <BaseButton
            class="navigation__button"
            @click="$router.push('/workspaces')"
          >
            Your workspaces
          </BaseButton>
          <BaseButton
            class="navigation__button"
            @click="logout"
          >
            Logout
          </BaseButton>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import Firebase from '@/firebaseConfig';

export default {
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    logout() {
      Firebase.logout();
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  width: 100%;
  padding: 16px 28px;
  background: #fff;

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__group {
    display: flex;
    align-items: center;
  }

  &__email {
    margin-right: 10px;
  }

  &__button {
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
