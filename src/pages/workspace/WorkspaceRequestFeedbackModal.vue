<template>
  <div class="request">
    <div class="request__header">
      <div class="request__title h5">
        Request feedback
      </div>
      <div class="request__subtitle b2">
        Share your link with colleagues to get feedback from them.
      </div>
      <div class="request__caption caption">
        Add message inside your link (optional)
      </div>
      <BaseTextarea
        :placeholder="'E.g. Hi, I am collecting feedbacks on how I am doing at work. Please share your thoughts about my work.'"
        :model-value="modelValue"
        padding="10px 12px"
        font-size="14px"
        line-height="20px"
        rows="3"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
    </div>

    <div class="request__footer">
      <div class="request__link b2">
        <div
          class="request__link-input"
          :title="link"
        >
          {{ link }}
        </div>
        <button
          class="request__link-view b2"
          @click="$emit('view-link')"
        >
          View
        </button>
      </div>
      <BaseButton
        class="request__copy"
        @click="$emit('copy-link')"
        v-text="'Copy link'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue', 'copy-link', 'view-link'],
};
</script>

<style lang="scss" scoped>
.request {
  &__header {
    padding: 24px;
  }

  &__title {
    margin-bottom: 8px;
  }

  &__subtitle {
    margin-bottom: 24px;
  }

  &__caption {
    margin-bottom: 8px;
  }

  &__footer {
    display: flex;
    padding: 24px;
    background: $grey-100;
    border-top: 1px solid $grey-200;
  }

  &__link {
    display: flex;
    flex-grow: 1;
    margin-right: 8px;
    background: $light;
    border: 1px solid $grey-200;
    border-radius: $border-radius;
  }

  &__link-input {
    flex-grow: 1;

    @include text-overflow-ellipsis;

    max-width: 368px;
    padding: 10px 16px;
  }

  &__link-view {
    flex-shrink: 0;
    padding: 10px 20px;
    cursor: pointer;
    border-left: 1px solid $grey-200;
  }

  &__copy {
    flex-shrink: 0;
  }
}
</style>
