<template>
  <BaseDropdown
    v-click-outside="{
      handler: () => showOptions = false,
      events: ['mousedown']
    }"
    :is-open="showOptions"
    :items="optionsItems"
    @click.stop
    @remove="$emit('remove'), showOptions = false"
    @unremove="$emit('unremove'), showOptions = false"
    @delete="$emit('delete'), showOptions = false"
  >
    <div
      class="trigger"
      @click.stop="showOptions = !showOptions"
    >
      <slot />
    </div>
  </BaseDropdown>
</template>

<script>
import { mapState } from 'vuex';
import { updateFeedback } from '@/firebase';
import { REMOVED_STATE } from '@/constants/feedback';

export default {
  props: {
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  emits: ['remove', 'unremove', 'delete'],
  data() {
    return {
      showOptions: false,
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    optionsItems() {
      const isRemoved = this.feedbackData.participants[this.userData.uid].feedbackState === REMOVED_STATE;
      const optionsRemoveItem = isRemoved
      ? [{ name: 'Restore', action: 'unremove', icon: 'trash' }]
      : [{
          name: 'Remove for you', action: 'remove', icon: 'trash', theme: 'alarm',
      }];

      const optionsDeleteItem = isRemoved
      ? [{
        name: 'Delete for you', action: 'delete', icon: 'trash', theme: 'alarm',
      }]
      : [];

      return [
        ...optionsRemoveItem,
        ...optionsDeleteItem,
      ];
    },
  },
};
</script>
