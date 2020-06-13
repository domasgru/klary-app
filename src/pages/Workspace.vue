<template>
  <div>
    <h1>Welcome to your workspace - <b>{{ workspace.name }}</b></h1>

    <h2>Team: </h2>
    <ul />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['workspace']),
  },
};
</script>
