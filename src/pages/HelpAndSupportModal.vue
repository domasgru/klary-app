<template>
  <BaseModal
    v-bind="$props"
    max-width="456px"
    @close="$emit('close')"
  >
    <slot />
    <template #content>
      <div class="modal">
        <div class="h5">
          Help & Support
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
export default {
  emits: ['close'],
};
</script>

<style lang="scss" scoped>
.modal {
  padding: 24px 12px;
}
</style>
