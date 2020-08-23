<template>
  <BaseSelect
    :value="value"
    :label="label"
    :list="usersArray"
    :search-keys="['name']"
    :autofocus="true"
    :selected-users="selectedUsers"
    @input="$emit('input', $event)"
    @select="$emit('select', $event)"
    @remove="$emit('remove', $event)"
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
    selectedUsers: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState('workspace', ['team']),
    usersArray() {
      return Object.values(this.team).filter(
        (user) => !this.selectedUsers.some((selectedUser) => selectedUser.uid === user.uid),
      );
    },
  },
};
</script>
