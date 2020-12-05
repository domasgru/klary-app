<template>
  <BasePopup :is-open="isOpen">
    <slot />
    <template #content>
      <button
        v-for="{name, action, icon, theme} in items"
        :key="name"
        class="dropdown__item base-typography--button2"
        :class="{
          'dropdown__item--alarm': theme === 'alarm'
        }"
        @click="$emit(action)"
      >
        <BaseSvg
          v-if="icon"
          :name="icon"
          class="dropdown__item-icon"
        />
        {{ name }}
      </button>
    </template>
  </BasePopup>
</template>

<script>

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    isOpen: {
      type: Boolean,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  &__item {
    display: flex;
    align-items: center;
    min-width: 152px;
    padding: 6px 8px;
    color: $dark;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      background: $grey-100;
    }

    &--alarm {
      color: $error;

      &:hover {
        background: $error-light;
      }
    }
  }

  &__item-icon {
    width: 20px;
    height: 20px;
    padding: 2px;
    margin-right: 8px;
  }
}
</style>
