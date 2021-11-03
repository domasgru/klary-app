<template>
  <EmojiPicker
    v-if="isEditable"
    v-bind="$props"
  />
  <div
    v-else
    class="icon"
  >
    <BaseIcon
      size="sm"
      :name="icon"
      :color="color"
    />
  </div>
</template>

<script>
import EmojiPicker from '@/pages/EmojiPicker.vue';

export default {
  components: {
    EmojiPicker,
  },
  props: {
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: 'dark',
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
