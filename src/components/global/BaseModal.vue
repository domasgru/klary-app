<template>
  <slot />
  <teleport to="#modals">
    <div
      v-if="showModal"
      class="modal-backdrop"
      @mousedown.self="$emit('close')"
    >
      <div
        :style="contentStyle"
        class="modal-content"
      >
        <div class="modal-content__icon">
          <BaseIcon
            v-if="showClose"
            name="close"
            color="grey-600"
            @click="$emit('close')"
          />
        </div>
        <slot name="content" />
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    maxWidth: {
      type: String,
      default: '600px',
    },
  },
  emits: ['close'],
  computed: {
    contentStyle: ({ maxWidth }) => ({
      maxWidth,
    }),
  },
};
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 26px;
  background: $modal-background;
}

.modal-content {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: $light;
  border-radius: $border-radius;

  &__icon {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s ease;

    &:hover {
      background: $grey-100;
    }
  }
}
</style>
