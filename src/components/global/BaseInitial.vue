<template>
  <div
    class="user-initial"
    :class="computedClasses"
  >
    {{ name.slice(0,1) }}
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        default: 'md',
      },
    },
    computed: {
      computedClasses() {
        return {
          [`user-initial--${this.size}`]: true,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
.user-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: $light;
  text-transform: uppercase;
  background: $grey-400;
  border-radius: 50%;

  &--xs {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  &--sm {
    width: 32px;
    height: 32px;
  }

  &--md {
    width: 40px;
    height: 40px;
  }
}
</style>
