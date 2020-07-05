<template>
  <div class="complete-user">
    <div class="complete-user__container">
      <component :is="currentDialog" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getUserWorkspaces } from '@/firebase';
import CompleteUserName from './CompleteUserName.vue';
import CompleteCompanyName from './CompleteCompanyName.vue';
import CompleteTeam from './CompleteTeam.vue';

export default {
  components: {
    CompleteUserName,
    CompleteCompanyName,
    CompleteTeam,
  },
  computed: {
    ...mapState('user', ['userData', 'userAuth']),
    ...mapState('workspace', ['allWorkspaces']),
    currentDialog() {
      if (!this.userData.name) {
        return 'CompleteUserName';
      } if (!this.allWorkspaces.length) {
        return 'CompleteCompanyName';
      }
      return 'CompleteTeam';
    },
  },
};
</script>

<style lang="scss" scoped>
.complete-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-bottom: 12vh;

  @media screen and (min-height: 780px) {
    padding-bottom: 20vh;
  }

  &__container {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 570px;
  }
}
</style>
