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
      :model-value="value"
      :is-disabled="isDisabled"
      size="lg"
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
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update', 'save', 'duplicate', 'delete', 'input'],
};
</script>

<style lang="scss" scoped>

</style>
