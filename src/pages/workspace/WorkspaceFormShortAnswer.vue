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
  },
  emits: ['update', 'save', 'duplicate', 'delete'],
  computed: {
    isEditMode() {
      return this.viewMode === 'edit';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
