<template>
  <button
    class="action-button"
    :class="{
      'action-button--star': isStarTheme,
      'action-button--active': active,
      'action-button--active-star': (isStarTheme && active),
    }"
  >
    <BaseSvg
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
$star-color: #fac04b;

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
    color: $primary;
    background: rgba(81, 31, 220, 0.1);
    border: 1px solid $primary;

    &:hover {
      background: rgba(81, 31, 220, 0.1);
    }
  }

  &--active-star {
    color: $star-color;
    background: #fff6e5;
    border: 1px solid $star-color;

    &:hover {
      background: #fff6e5;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    padding: 2px;
    fill: none;
    stroke: $grey-800;
    transition: stroke 0.2s ease;

    #{$this}--active & {
      stroke: $primary;
    }

    #{$this}--active-star & {
      fill: $star-color;
      stroke: $star-color;
    }
  }
}
</style>
