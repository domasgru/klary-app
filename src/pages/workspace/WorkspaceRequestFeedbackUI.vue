<template>
  <BaseModal
    :show-modal="showRequestModal"
    max-width="600px"
    @close="closeRequestModal"
  >
    <div
      class="trigger"
      @click="showRequestModal = true"
    >
      <slot />
    </div>
    <template #content>
      <WorkspaceRequestFeedbackModal
        v-model="message"
        :link="link"
        @copy-link="copyFeedbackRequestLink"
        @view-link="openFeedbackRequestLink"
        @input="saveMessage"
      />
    </template>
  </BaseModal>
</template>

<script>
import { ref } from 'vue';
import { useFeedbackRequest } from '@/composables/useFeedbackRequest';
import { debounce } from '@/utils/debounce';
import WorkspaceRequestFeedbackModal from './WorkspaceRequestFeedbackModal.vue';

export default {
  components: {
    WorkspaceRequestFeedbackModal,
  },
  setup() {
    const {
      message,
      link,
      isLoading,
      updateFeedbackRequestData,
    } = useFeedbackRequest();
    const showRequestModal = ref(false);

    const closeRequestModal = () => {
      showRequestModal.value = false;
    };
    const copyFeedbackRequestLink = () => {
      navigator.clipboard.writeText(link.value);
    };
    const openFeedbackRequestLink = () => {
      const win = window.open(link.value, '_blank');
      win.focus();
    };

    const saveMessage = debounce(() => {
      updateFeedbackRequestData();
    }, 800);

    return {
      showRequestModal,
      closeRequestModal,
      message,
      link,
      isLoading,
      copyFeedbackRequestLink,
      openFeedbackRequestLink,
      saveMessage,
    };
  },
};
</script>
