<template>
  <button
    class="base-avatar"
    :class="computedClasses"
  >
    <img
      v-if="picture"
      class="base-avatar__image-background"
      :src="picture"
      :style="picture"
      onerror="this.style.display='none'"
    >
    <div class="base-avatar__default-initials">
      {{ name.slice(0,1) }}
    </div>
  </button>
</template>

<script>
const AVATAR_SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};
const AVATAR_SIZES_ARRAY = [AVATAR_SIZES.xs, AVATAR_SIZES.sm, AVATAR_SIZES.md, AVATAR_SIZES.lg];

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: AVATAR_SIZES.md,
      validator: (value) => AVATAR_SIZES_ARRAY.includes(value),
    },
    active: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      default: '',
    },
  },
  computed: {
    computedClasses() {
      return {
        [`base-avatar--${this.size}`]: true,
        'base-avatar--active': this.active,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.base-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 20px;
  color: $light;
  text-transform: uppercase;
  background: $grey-400;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  transition: box-shadow 0.2s ease;

  &--active {
    box-shadow: 0 0 0 3px $primary-active;
  }

  &--xs {
    width: 24px;
    height: 24px;
    font-size: 14px;
    line-height: 14px;
  }

  &--sm {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  &--md {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  &--lg {
    width: 72px;
    height: 72px;
    font-size: 36px;
  }

  &__image-background {
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__default-initials {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
