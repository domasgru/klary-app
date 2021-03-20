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
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { debounce } from '@/utils/debounce';
import { updateFeedbackRequest } from '@/firebase';
import WorkspaceRequestFeedbackModal from './WorkspaceRequestFeedbackModal.vue';

export default {
  components: {
    WorkspaceRequestFeedbackModal,
  },
  props: {
    feedbackRequestId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const feedbackRequest = computed(() => store.state.feedback.feedbackRequests.find((fr) => fr.id === props.feedbackRequestId));
    const link = computed(() => `${window.origin}/give-feedback/${feedbackRequest.value.id}`);
    const showRequestModal = ref(false);

    const message = ref(feedbackRequest.value.message);
    watch(feedbackRequest, (newValue) => {
      message.value = newValue.message;
    });

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
      updateFeedbackRequest(feedbackRequest.value.id, {
        message: message.value,
      });
    }, 800);

    return {
      showRequestModal,
      closeRequestModal,
      message,
      link,
      copyFeedbackRequestLink,
      openFeedbackRequestLink,
      saveMessage,
    };
  },
};
</script>
