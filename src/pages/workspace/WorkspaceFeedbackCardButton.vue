<template>
  <button
    class="action-button"
    :class="{
      'action-button--star': isStarTheme,
      'action-button--active': active,
      'action-button--active-star': (isStarTheme && active),
    }"
  >
    <BaseIcon
      v-if="icon"
      class="action-button__icon"
      :name="icon"
    />
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'default',
    },
    icon: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isStarTheme() {
      return this.theme === 'star';
    },
  },
};
</script>

<style lang="scss" scoped>
.action-button {
  $this: &;

  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: $border-radius;
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
    background: $grey-200;
  }

  &--active-star {
    color: $yellow;
  }

  &__icon {
    transition: stroke 0.2s ease;

    #{$this}--active-star & {
      fill: $yellow;
      stroke: $yellow;
    }
  }
}
</style>
