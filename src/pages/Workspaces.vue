<template>
  <div>
    <h1>Your workspaces</h1>
    <ul>
      <li
        v-for="workspace in workspaces"
        :key="workspace.name"
      >
        Name: <b>{{ workspace.name }}</b>
        <BaseButton @click="select(workspace)">
          Select workspace
        </BaseButton>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { db } from '@/firebase';

export default {
  data() {
    return {
      workspaces: [],
    };
  },
  computed: {
    ...mapState('user', ['userData']),
  },
  async mounted() {
    const data = await db.collection('workspaces').where('team', 'array-contains', this.user.uid).get();
    const workspaces = data.docs.map((doc) => doc.data());
    this.workspaces = workspaces;
  },
  methods: {
    ...mapActions('user', ['setWorkspace']),
    select(workspace) {
      this.setWorkspace(workspace);
      db.collection('users').doc(this.user.uid).update({
        currentWorkspace: workspace.name,
      });
      this.$router.push('/workspace');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
