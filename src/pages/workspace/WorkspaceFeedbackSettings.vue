<template>
  <div class="feedback-settings">
    <BaseDropdown
      v-click-outside="{
        handler: () => showOptions = false,
        events: ['mousedown']
      }"
      v-bind="$attrs"
      :is-open="showOptions"
      :items="optionsItems"
      @click.stop
      @remove="$emit('remove'), showOptions = false"
      @unremove="$emit('unremove'), showOptions = false"
      @delete="showDeleteModal = true"
    >
      <div
        class="trigger"
        @click.stop="showOptions = !showOptions"
      >
        <slot />
      </div>
    </BaseDropdown>
    <BaseModal
      max-width="512px"
      :show-modal="showDeleteModal"
      @close="showDeleteModal = false"
    >
      <template #content>
        <div class="delete-feedback">
          <div class="delete-feedback__title h5">
            Delete feedback
          </div>
          <div class="delete-feedback__message b2">
            This feedback will be deleted forever and you won’t be able to restore it. Other feedback members will still be able to see it.
          </div>
          <div class="delete-feedback__actions">
            <BaseButton
              class="delete-feedback__cancel"
              type="secondary"
              @click="showDeleteModal = false"
              v-text="'Cancel'"
            />
            <BaseButton
              type="error"
              @click="$emit('delete'), showOptions = false"
              v-text="'Delete forever'"
            />
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      showDeleteModal: false,
    };
  },
  computed: {
    ...mapState('user', ['userData']),
    optionsItems() {
      const isRemoved = this.feedbackData.participants[this.userData.uid].feedbackState === REMOVED_STATE;
      const optionsRemoveItem = isRemoved
      ? [{ name: 'Restore', action: 'unremove', icon: 'restore' }]
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

<style lang="scss" scoped>
.delete-feedback {
  padding: 24px;

  &__title {
    margin-bottom: 24px;
  }

  &__message {
    margin-bottom: 24px;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__cancel {
    margin-right: 8px;
  }
}
</style>
