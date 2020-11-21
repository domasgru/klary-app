<template>
  <router-link
    class="sidebar-button base-typography--button2"
    :to="to"
    :class="{
      'sidebar-button--is-fluid': isFluid,
      'sidebar-button--is-active': isActive,
    }"
  >
    <BaseSvg
      v-if="icon"
      :name="icon"
      :stroke-color="isActive ? '#511FDC' : '#17171A'"
      class="sidebar-button__icon"
    />
    <div v-if="text">
      {{ text }}
    </div>
    <slot />
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    isFluid: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-button {
  $this: &;

  display: flex;
  align-items: center;
  padding: 6px 8px;
  color: $dark;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &--is-active {
    color: $primary-100 !important;
    background: #e5e0f4 !important;
  }

  &:hover {
    background: #ebebee;
  }

  &--is-fluid {
    width: 100%;
  }

  &__icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}
</style>
