<template>
  <BaseSelect
    :value="value"
    :label="label"
    :list="usersArray"
    :search-keys="['name']"
    :autofocus="true"
    @input="$emit('input', $event)"
    @select="$emit('select', $event)"
  />
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('workspace', ['team']),
    usersArray() {
      return Object.values(this.team);
    },
  },
};
</script>
