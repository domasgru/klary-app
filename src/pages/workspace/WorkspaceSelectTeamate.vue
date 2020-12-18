<template>
  <BaseSelect
    :type="type"
    :model-value="modelValue"
    :label="label"
    :list="usersArray"
    :search-keys="['name']"
    :autofocus="true"
    :selected-value="selectedUser"
    :selected-values="selectedUsers"
    :placeholder="`Type the person's name`"
    @update:modelValue="$emit('update:modelValue', $event)"
    @select="$emit('select', $event)"
    @remove="$emit('remove', $event)"
  />
</template>

<script>
import { mapState } from 'vuex';

export default {
  // emits: ['select', 'remove', 'update:modelValue'],
  props: {
    type: {
      type: String,
      required: true,
    },
    modelValue: {
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
    team: {
      type: Object,
      required: true,
    },
  },
  computed: {
    usersArray() {
      return Object.values(this.team).filter(
        (user) => !this.selectedUsers.some((selectedUser) => selectedUser.uid === user.uid),
      );
    },
  },
};
</script>
