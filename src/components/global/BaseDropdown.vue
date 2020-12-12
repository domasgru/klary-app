<template>
  <BasePopup
    :is-open="isOpen"
    :side="side"
    :margin-top="marginTop"
    :margin-left="marginLeft"
    :width="width"
  >
    <slot />
    <template #content>
      <div
        v-for="{name, action, icon, theme, separator} in items"
        :key="name"
        class="dropdown__item-wrapper"
      >
        <button
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
        <div
          v-if="separator"
          class="dropdown__separator"
        />
      </div>
    </template>
  </BasePopup>
</template>

<script>
const SIZES = ['sm', 'md'];

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
    side: {
      type: String,
      default: 'right',
    },
     marginTop: {
      type: String,
      default: '0',
    },
    marginLeft: {
      type: String,
      default: '0',
    },
    width: {
      type: String,
      default: 'auto',
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  &__item {
    display: flex;
    align-items: center;
    width: 100%;
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

  &__separator {
    height: 1px;
    margin: 3px 4px;
    background: $grey-200;
  }

  &__item-icon {
    width: 20px;
    height: 20px;
    padding: 2px;
    margin-right: 8px;
  }
}
</style>
