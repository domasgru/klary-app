<template>
  <div
    v-click-outside="{
      handler: () => $emit('close'),
      middleware: isClickingOutsidePopup,
      events: ['mousedown']
    }"
    class="base-popup"
  >
    <div
      ref="popupTrigger"
      class="base-popup__trigger"
    >
      <slot />
    </div>
    <teleport to="#popup-portal">
      <BaseBackgroundWrapper
        v-if="isOpen"
        ref="popupElement"
        class="base-popup__content"
        :style="popupStyles"
      >
        <slot name="content" />
      </BaseBackgroundWrapper>
    </teleport>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import { createPopper } from '@popperjs/core';

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    position: {
      type: String,
      default: 'right',
    },
    offset: {
      type: Object,
      default: null,
    },
    width: {
      type: String,
      default: 'auto',
    },
  },
  emits: ['close'],
  computed: {
    popupStyles() {
      return {
        width: this.width,
      };
    },
  },
  watch: {
    async isOpen(newValue) {
      if (!newValue) {
        return;
      }

      await nextTick();
      createPopper(this.$refs.popupTrigger, this.$refs.popupElement.$el, {
        placement: this.position,
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['right'],
            },
          },
    //       {
    //   name: 'preventOverflow',
    //   options: {
    //     altAxis: true, // false by default
    //   },
    // },
          ...(this.offset ? [{
            name: 'offset',
            options: {
              offset: this.offset,
            },
          }] : []),
        ],
      });
    },
  },
  methods: {
    isClickingOutsidePopup(event) {
      if (!this.isOpen) {
        return false;
      }
      if (event.target.closest('.base-popup__content')) {
        return false;
      }

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-popup {
  display: flex;

  &__trigger {
    cursor: pointer;
    width: 100%;
  }
}
</style>
