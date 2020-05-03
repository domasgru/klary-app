<template>
  <div>
    Your workspaces
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Firebase from '@/firebaseConfig';

export default {
  computed: {
    ...mapState('user', ['user']),
  },
  mounted() {
    Firebase.db.collection('cities').where(`team.${this.user.uid}`);
  },
};
</script>

<style lang="scss" scoped>

</style>
