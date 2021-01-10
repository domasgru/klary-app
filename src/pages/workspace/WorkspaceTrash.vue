<template>
  <div class="wrapper">
    <h4 class="title h4">
      Trash
    </h4>
    <BaseButton
      v-if="removedFeedbacks && removedFeedbacks.length"
      type="secondary"
      class="empty-trash"
      @click="showEmptyTrashModal = true"
      v-text="'Empty trash'"
    />
  </div>
  <WorkspaceFeedbackList
    v-if="!isLoading"
    :feedbacks="removedFeedbacks"
    :inbox-type="REMOVED_TYPE"
    empty-state-text="You have no removed feedbacks"
    @open="openFeedback"
  />
  <BaseModal
    :show-modal="showEmptyTrashModal"
    max-width="512px"
    @close="showEmptyTrashModal = false"
  >
    <template #content>
      <div class="delete-modal">
        <div class="delete-modal__title h5">
          Delete all feedbacks
        </div>
        <div class="delete-modal__description b2">
          All feedbacks in the trash will be deleted forever and you won’t be able to restore it.
          Other feedback members will still be able to see it.
        </div>
        <div class="delete-modal__actions-wrapper">
          <BaseButton
            type="secondary"
            class="delete-modal__cancel-button"
            @click="showEmptyTrashModal = false"
            v-text="'Cancel'"
          />
          <BaseButton
            type="error"
            @click="emptyTrash"
            v-text="'Delete forever'"
          />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useFeedbackList } from '@/composables/useFeedback';
import { REMOVED_STATE, REMOVED_TYPE, DELETED_STATE } from '@/constants/feedback';
import { updateFeedback } from '@/firebase';
import WorkspaceFeedbackList from './WorkspaceFeedbackList.vue';

export default {
  components: {
    WorkspaceFeedbackList,
  },
  setup() {
    const store = useStore();
    const { isLoading, openFeedback, getFilteredAndSortedFeedbacks } = useFeedbackList(REMOVED_TYPE);
    const showEmptyTrashModal = ref(false);
    const { uid } = store.state.user.userData;

    const removedFeedbacks = getFilteredAndSortedFeedbacks({
      filterBy: `participants.${uid}.feedbackState`,
      filterValue: REMOVED_STATE,
    });

    const emptyTrash = () => {
      removedFeedbacks.value.forEach((feedback) => {
        updateFeedback({
          feedbackId: feedback.id,
          path: `participants.${uid}.feedbackState`,
          value: DELETED_STATE,
        });
      });
      showEmptyTrashModal.value = false;
    };

    return {
      removedFeedbacks, isLoading, openFeedback, emptyTrash, showEmptyTrashModal, REMOVED_TYPE,
    };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.delete-modal {
  padding: 24px;

  &__title {
    margin-bottom: 24px;
  }

  &__description {
    margin-bottom: 24px;
  }

  &__actions-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__cancel-button {
    margin-right: 8px;
  }
}
</style>
