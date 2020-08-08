<template>
  <BaseSelect
    v-model="teamate"
    :label="label"
    :list="teamArray"
    :search-keys="['name']"
  />
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      teamate: '',
    };
  },
  computed: {
    ...mapState('workspace', ['team']),
    teamArray() {
      return Object.values(this.team);
    },
  },
};
</script>
