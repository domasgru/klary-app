<template>
  <button
    class="action-button btn2"
    :class="{
      'action-button--star': isStarTheme,
      'action-button--active': active,
      'action-button--active-star': (isStarTheme && active),
    }"
  >
    <BaseIcon
      v-if="icon"
      class="action-button__icon"
      :color="(isStarTheme && active) ? 'yellow' : 'dark'"
      :fill-color="(isStarTheme && active) ? 'yellow': 'none'"
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
  padding: 7px;
  border: 1px solid $grey-200;
  border-radius: $border-radius;
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
    background: $grey-150;
  }

  &--active {
    color: $success;
    background: $success-light;
    border: 1px solid $success;

    &:hover {
      background: $success-light;
    }
  }

  &--active-star {
    color: $yellow;
    background: #fff6e5;
    border: 1px solid $yellow;

    &:hover {
      background: #fff6e5;
    }
  }

  &__icon {
    transition: stroke 0.2s ease;
  }
}
</style>
