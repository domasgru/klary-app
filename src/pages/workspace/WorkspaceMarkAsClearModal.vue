<template>
  <BaseModal
    :show-modal="showModal"
    @close="$emit('close')"
  >
    <template #content>
      <div class="modal">
        <div class="modal__title h5">
          Mark as clear
        </div>
        <div class="modal__subtitle b2">
          Let {{ authorName }} know what you think about the feedback.
        </div>
        <BaseTextarea
          v-model="message"
          label="Your message"
          class="modal__message"
          placeholder="E.g. &quot;Thanks for your feedback&quot;"
          rows="4"
          padding="10px 12px"
          font-size="14px"
          line-height="20px"
        />
        <BaseButton
          class="modal__button"
          @click="$emit('mark-as-clear', message)"
          v-text="'Mark as clear'"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'mark-as-clear'],
  data() {
    return {
      message: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  padding: 24px;

  &__title {
    margin-bottom: 8px;
  }

  &__subtitle {
    margin-bottom: 24px;
  }

  &__message {
    margin-bottom: 16px;
  }

  &__button {
    margin-left: auto;
  }
}
</style>
