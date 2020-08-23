<template>
  <BaseSelect
    :type="type"
    :value="value"
    :label="label"
    :list="usersArray"
    :search-keys="['name']"
    :autofocus="true"
    :selected-value="selectedUser"
    :selected-values="selectedUsers"
    :placeholder="`Type the person's name`"
    @input="$emit('input', $event)"
    @select="$emit('select', $event)"
    @remove="$emit('remove', $event)"
  />
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    selectedUser: {
      type: Object,
      default: () => ({}),
    },
    selectedUsers: {
      type: Array,
      default: () => ([]),
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
