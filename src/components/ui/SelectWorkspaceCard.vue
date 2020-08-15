<template>
  <div
    class="workspace-card"
    :class="{
      'workspace-card--new': isNew
    }"
  >
    <p
      v-if="isNew"
      class="workspace-card__message base-typography--bb2"
    >
      Hey, {{ workspaceName }} has invited you to join
    </p>
    <div class="workspace-card__content">
      <div class="workspace-card__logo">
        {{ workspaceName.slice(0, 1) }}
      </div>
      <div class="workspace-card__info">
        <p class="workspace-card__name base-typography--bb2">
          {{ workspaceName }}
        </p>
        <p class="workspace-card__domain base-typography--b-16-24">
          {{ workspaceName }}.curiodesk.com
        </p>
      </div>
      <template v-if="!isNew">
        <BaseButton
          class="workspace-card__button"
          @click="$emit('open')"
        >
          Open
        </BaseButton>
      </template>
      <template v-else>
        <BaseButton
          class="workspace-card__button"
          @click="$emit('cancel')"
        >
          Cancel
        </BaseButton>
        <BaseButton
          inverse
          @click="$emit('open')"
        >
          Join
        </BaseButton>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    workspaceName: {
      type: String,
      required: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.workspace-card {
  width: 602px;
  padding: 16px;
  margin-bottom: 48px;
  border: 1px solid $grey-200;
  border-radius: 10px;

  &--new {
    color: $light;
    background: $primary;
  }

  &__message {
    margin-bottom: 16px;
  }

  &__content {
    display: flex;
    align-items: center;
  }

  &__domain {
    text-transform: lowercase;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    margin-right: 16px;
    font-size: 32px;
    font-weight: bold;
    color: $light;
    text-transform: capitalize;
    background: $primary-100;
    border: 2px solid $light;
    border-radius: 10px;
  }

  &__name {

  }

  &__button {
    margin-left: auto;
  }

  &:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
