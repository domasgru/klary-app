<template>
  <BaseDropdown
    v-click-outside="{
      handler: () => showOptions = false,
      events: ['mousedown']
    }"
    :is-open="showOptions"
    :items="optionsItems"
    @click.stop
    @archive="$emit('archive')"
    @unarchive="$emit('unarchive')"
    @delete="$emit('delete')"
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
import { ARCHIVED_STATE } from '@/constants/feedback';

export default {
  props: {
    feedbackData: {
      type: Object,
      required: true,
    },
  },
  emits: ['archive', 'unarchive', 'delete'],
  data() {
    return {
      showOptions: false,
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    optionsItems() {
      const optionsArchiveItem = this.feedbackData.participants[this.userData.uid].feedbackState === ARCHIVED_STATE
      ? { name: 'Unarchive', action: 'unarchive', icon: 'archive' }
      : { name: 'Archive for you', action: 'archive', icon: 'archive' };
      const optionsDeleteItem = {
        name: 'Delete for you', action: 'delete', icon: 'delete', theme: 'alarm',
      };

      return [
        optionsArchiveItem,
        optionsDeleteItem,
      ];
    },
  },
};
</script>
