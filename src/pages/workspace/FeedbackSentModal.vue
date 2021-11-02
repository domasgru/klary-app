<template>
  <BaseModal
    v-bind="$props"
    :max-width="'482px'"
    @close="$emit('close')"
  >
    <template #content>
      <div class="success-message">
        <div class="success-message__illustration success-message__illustration--sent">
          <img
            class="success-message__icon"
            :src="require('@/assets/illustrations/sent.png')"
          >
        </div>
        <div class="success-message__title success-message__title--success h5">
          Your feedback has been sent
        </div>
        <div class="success-message__message--success b1">
          You can review and discuss your feedback by using Klary.
        </div>
        <div class="success-message__button-wrapper">
          <BaseButton
            fluid
            size="lg"
            @click="$emit('close')"
            v-text="'View feedback'"
          />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script>
export default {
  emits: ['close'],
};
</script>

<style lang="scss" scoped>
.success-message {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 788px;
  padding: 64px 64px 48px 64px;
  text-align: center;
  background: $light;
  border: 1px solid $grey-200;
  border-radius: $border-radius;

  &__illustration {
    position: absolute;
    top: -36px;
    right: 0;
    left: 0;
    margin: auto;
    border: 3px solid $light;

    &--sent {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: $grey-100;
      border-radius: 50%;
    }
  }

  &__icon {
    width: 40px;
  }

  &__title {
    max-width: 290px;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &--success {
      max-width: 600px;
    }
  }

  &__message {
    width: 100%;
    max-width: 592px;

    &--success {
      max-width: 460px;
    }
  }

  &__button-wrapper {
    width: 100%;
    max-width: 208px;
    margin-top: 32px;
  }
}
</style>
