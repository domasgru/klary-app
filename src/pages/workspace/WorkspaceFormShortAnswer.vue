<template>
  <WorksapceFormQuestionBase
    v-bind="$props"
    @update="$emit('update', $event)"
    @save="$emit('save', $event)"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
  >
    <BaseInput
      placeholder="Short answer"
      :mode-value="value"
      @input="$emit('input', $event.target.value)"
    />
  </WorksapceFormQuestionBase>
</template>

<script>
import WorksapceFormQuestionBase from './WorkspaceFormQuestionBase.vue';

export default {
  components: {
    WorksapceFormQuestionBase,
  },
  props: {
    viewMode: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },
  emits: ['update', 'save', 'duplicate', 'delete', 'input'],
  computed: {
    isEditMode() {
      return this.viewMode === 'edit';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
