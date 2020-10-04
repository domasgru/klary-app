<template>
  <button
    class="base-avatar"
    :class="computedClasses"
    :style="picture
      ? {background: `url(${picture})`, backgroundSize: 'cover',backgroundPosition: 'center'}
      : {}"
  >
    {{ picture ? '' : name.slice(0,1) }}
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  }

  &--md {
    width: 40px;
    height: 40px;
  }

  &--lg {
    width: 72px;
    height: 72px;
  }
}
</style>
