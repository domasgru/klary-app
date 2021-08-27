<template>
  <BaseSvg
    class="base-logo"
    :name="svgFileName"
    :class="computedClasses"
  />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text',
    },
    size: {
      type: String,
      default: 'md',
    },
    color: {
      type: String,
      default: 'dark',
    },
  },
  computed: {
    svgFileName: ({ type }) => {
      if (type === 'text') {
        return 'logo-text';
      } if (type === 'symbol') {
        return 'logo-symbol';
      } if (type === 'full') {
        return 'logo-full';
      }

      return 'text';
    },
    computedClasses: ({ type, size, color }) => ({
      [`base-logo--${type}-${size}`]: size,
      [`base-logo--${color}`]: color,
    }),
  },
};
</script>

<style lang="scss" scoped>
.base-logo {
  //stroke: $dark;

  &--sm {
    width: 43px;
    height: 24px;
  }

  &--full-lg {
    width: 106px;
    height: 40px;
  }

  &--lg {
    width: 56px;
    height: 32px;
  }

  &--dark {
    fill: $dark;
  }

  &--grey {
    //fill: $grey-600;
  }
}
</style>
