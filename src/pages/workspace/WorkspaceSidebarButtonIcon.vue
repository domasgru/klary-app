<template>
  <BasePopup
    class="icon"
    :is-open="showEmojiPopup"
    :position="'bottom-start'"
    :offset="[0, 6]"
    @close="showEmojiPopup = false"
    @click.stop.prevent
  >
    <div
      class="icon__wrapper"
      :class="{
        'icon__emoji-select-theme': emojiSelectTheme,
        'is-open': showEmojiPopup
      }"
      @click="toggleEditing"
    >
      <div
        v-if="emoji"
        class="icon__emoji"
      >
        {{ emoji }}
      </div>
      <div
        v-else-if="icon"
      >
        <BaseIcon
          size="sm"
          :name="icon"
          :color="isActive ? 'primary' : 'dark'"
        />
      </div>
    </div>
    <template #content>
      <emoji-picker
        ref="emojiPicker"
        class="light"
      />
    </template>
  </BasePopup>
</template>

<script>
import { nextTick } from 'vue';
import 'emoji-picker-element';

export default {
  props: {
    icon: {
      type: String,
      default: null,
    },
    emoji: {
      type: String,
      default: null,
    },
    emojiSelectTheme: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'toggle', 'update-emoji'],
  data() {
    return {
      showEmojiPopup: false,
    };
  },
  watch: {
    async showEmojiPopup(newValue) {
      if (!newValue) {
        return;
      }

      await nextTick();
      this.$refs.emojiPicker.addEventListener('emoji-click', (e) => {
        this.$emit('update-emoji', e.detail.unicode);
        this.showEmojiPopup = false;
      });
    },
  },
  methods: {
    toggleEditing() {
      if (!this.isEditable) {
        return;
      }

      this.showEmojiPopup = !this.showEmojiPopup;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  margin-right: 8px;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  &__emoji-select-theme {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: $light;
    border: $stroke;
    border-radius: 10px;
    transition: all 0.2s ease;

    &:hover {
      border: 1px solid $grey-300;
    }

    &.is-open {
      border: 1px solid $primary;
      box-shadow: 0 0 0 4px rgba(81, 31, 220, 0.2);
    }
  }
}
</style>
